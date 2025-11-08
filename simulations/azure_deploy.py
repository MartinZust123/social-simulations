"""
Azure Deployment Script for Social Simulations

This script orchestrates the entire cloud simulation workflow:
1. Creates Azure resources (VMs, storage)
2. Uploads simulation code to VMs
3. Executes simulations in parallel across VMs
4. Downloads results
5. Cleans up resources

Usage:
    python azure_deploy.py --case-studies GridSize CorrelationSweep OrderedRatio
    python azure_deploy.py --all  # Run all configured case studies
    python azure_deploy.py --download-only  # Just download existing results
"""

import argparse
import os
import sys
import time
import subprocess
import json
from pathlib import Path

import config_azure as config


def print_banner(text):
    """Print formatted banner"""
    print("\n" + "="*70)
    print(text.center(70))
    print("="*70 + "\n")


def run_az_command(command, capture_output=True):
    """
    Execute an Azure CLI command

    Args:
        command: List of command arguments
        capture_output: Whether to capture output

    Returns:
        CompletedProcess object
    """
    try:
        # On Windows, use shell=True to find az command
        result = subprocess.run(
            command,
            capture_output=capture_output,
            text=True,
            check=True,
            shell=(sys.platform == "win32")
        )
        return result
    except subprocess.CalledProcessError as e:
        print(f"Error executing command: {' '.join(command)}")
        print(f"Error: {e.stderr}")
        raise


def check_azure_login():
    """Check if user is logged into Azure CLI"""
    print("Checking Azure CLI login status...")
    try:
        result = run_az_command(["az", "account", "show"])
        account_info = json.loads(result.stdout)
        print(f"✓ Logged in as: {account_info['user']['name']}")
        print(f"✓ Subscription: {account_info['name']}")
        return True
    except subprocess.CalledProcessError:
        print("✗ Not logged in to Azure CLI")
        print("\nPlease run: az login")
        return False
    except Exception as e:
        print(f"✗ Error checking Azure login: {e}")
        print(f"Debug - stdout: {result.stdout if 'result' in locals() else 'N/A'}")
        return False


def create_resource_group():
    """Create Azure resource group"""
    print(f"Creating resource group: {config.RESOURCE_GROUP}...")

    # Check if exists
    try:
        run_az_command([
            "az", "group", "show",
            "--name", config.RESOURCE_GROUP
        ])
        print(f"✓ Resource group already exists")
        return
    except:
        pass

    # Create new
    run_az_command([
        "az", "group", "create",
        "--name", config.RESOURCE_GROUP,
        "--location", config.LOCATION,
        "--tags", *[f"{k}={v}" for k, v in config.RESOURCE_TAGS.items()]
    ])
    print(f"✓ Resource group created")


def create_storage_account():
    """Create Azure storage account for results"""
    print(f"Creating storage account: {config.STORAGE_ACCOUNT_NAME}...")

    # Check if exists
    try:
        run_az_command([
            "az", "storage", "account", "show",
            "--name", config.STORAGE_ACCOUNT_NAME,
            "--resource-group", config.RESOURCE_GROUP
        ])
        print(f"✓ Storage account already exists")
    except:
        # Create new
        run_az_command([
            "az", "storage", "account", "create",
            "--name", config.STORAGE_ACCOUNT_NAME,
            "--resource-group", config.RESOURCE_GROUP,
            "--location", config.LOCATION,
            "--sku", "Standard_LRS"
        ])
        print(f"✓ Storage account created")

    # Get storage key
    result = run_az_command([
        "az", "storage", "account", "keys", "list",
        "--account-name", config.STORAGE_ACCOUNT_NAME,
        "--resource-group", config.RESOURCE_GROUP
    ])
    keys = json.loads(result.stdout)
    storage_key = keys[0]["value"]

    # Create container
    try:
        run_az_command([
            "az", "storage", "container", "create",
            "--name", config.CONTAINER_NAME,
            "--account-name", config.STORAGE_ACCOUNT_NAME,
            "--account-key", storage_key
        ])
        print(f"✓ Storage container created: {config.CONTAINER_NAME}")
    except:
        print(f"✓ Storage container already exists")

    return storage_key


def create_vm(vm_name, vm_index):
    """
    Create a virtual machine

    Args:
        vm_name: Name for the VM
        vm_index: Index number for the VM
    """
    print(f"Creating VM: {vm_name}...")

    # Check if VM already exists
    try:
        run_az_command([
            "az", "vm", "show",
            "--resource-group", config.RESOURCE_GROUP,
            "--name", vm_name
        ])
        print(f"✓ VM already exists: {vm_name}")
        return
    except:
        pass

    # Read SSH public key
    ssh_key_path = os.path.expanduser(config.SSH_KEY_PATH)
    with open(ssh_key_path, 'r') as f:
        ssh_key = f.read().strip()

    # Create VM
    run_az_command([
        "az", "vm", "create",
        "--resource-group", config.RESOURCE_GROUP,
        "--name", vm_name,
        "--image", config.VM_IMAGE,
        "--size", config.VM_SIZE,
        "--admin-username", config.ADMIN_USERNAME,
        "--ssh-key-value", ssh_key,
        "--public-ip-sku", "Standard",
        "--tags", *[f"{k}={v}" for k, v in config.RESOURCE_TAGS.items()]
    ], capture_output=False)

    print(f"✓ VM created: {vm_name}")


def get_vm_ip(vm_name):
    """Get public IP address of a VM"""
    result = run_az_command([
        "az", "vm", "show",
        "--resource-group", config.RESOURCE_GROUP,
        "--name", vm_name,
        "--show-details",
        "--query", "publicIps",
        "--output", "tsv"
    ])
    return result.stdout.strip()


def upload_simulation_code(vm_ip, case_study_folder):
    """
    Upload simulation code to VM using SCP

    Args:
        vm_ip: IP address of VM
        case_study_folder: Folder name (e.g., "GridSize")
    """
    print(f"Uploading {case_study_folder} code to VM...")

    # Create simulations directory on VM first
    print(f"  Creating directory on VM...")
    subprocess.run([
        "ssh",
        "-o", "StrictHostKeyChecking=no",
        "-o", "ConnectTimeout=30",
        "-o", "ServerAliveInterval=10",
        "-o", "ServerAliveCountMax=3",
        f"{config.ADMIN_USERNAME}@{vm_ip}",
        "mkdir -p /home/azureuser/simulations"
    ], check=True, timeout=120)

    local_path = Path(__file__).parent / case_study_folder
    remote_path = f"{config.ADMIN_USERNAME}@{vm_ip}:/home/azureuser/simulations/"

    # Remove existing folder on VM to avoid conflicts (ignore errors if doesn't exist)
    print(f"  Cleaning up old files...")
    try:
        subprocess.run([
            "ssh",
            "-o", "StrictHostKeyChecking=no",
            "-o", "ConnectTimeout=30",
            "-o", "ServerAliveInterval=10",
            "-o", "ServerAliveCountMax=3",
            f"{config.ADMIN_USERNAME}@{vm_ip}",
            f"rm -rf /home/azureuser/simulations/{case_study_folder}"
        ], timeout=120)
    except subprocess.TimeoutExpired:
        print(f"  Warning: Cleanup timed out, continuing anyway...")

    # Upload with verbose output
    print(f"  Uploading files...")
    subprocess.run([
        "scp", "-r",
        "-o", "StrictHostKeyChecking=no",
        "-o", "ConnectTimeout=30",
        "-o", "ServerAliveInterval=10",
        "-o", "ServerAliveCountMax=3",
        str(local_path),
        remote_path
    ], check=True, timeout=600)

    print(f"✓ Code uploaded")


def run_simulation_on_vm(vm_ip, case_study, storage_key):
    """
    Execute simulation on VM

    Args:
        vm_ip: IP address of VM
        case_study: Case study name
        storage_key: Azure storage account key
    """
    print(f"Starting simulation: {case_study} on VM {vm_ip}...")

    # Upload vm_setup.sh script
    setup_script = Path(__file__).parent / "vm_setup.sh"
    subprocess.run([
        "scp",
        "-o", "StrictHostKeyChecking=no",
        str(setup_script),
        f"{config.ADMIN_USERNAME}@{vm_ip}:/home/azureuser/"
    ], check=True)

    # Execute setup script on VM
    ssh_command = [
        "ssh",
        "-o", "StrictHostKeyChecking=no",
        f"{config.ADMIN_USERNAME}@{vm_ip}",
        f"bash /home/azureuser/vm_setup.sh {case_study} {config.STORAGE_ACCOUNT_NAME} {config.CONTAINER_NAME} {storage_key}"
    ]

    subprocess.run(ssh_command, check=True)

    print(f"✓ Simulation completed: {case_study}")


def delete_vm(vm_name):
    """Delete a virtual machine"""
    print(f"Deleting VM: {vm_name}...")

    run_az_command([
        "az", "vm", "delete",
        "--resource-group", config.RESOURCE_GROUP,
        "--name", vm_name,
        "--yes"
    ], capture_output=False)

    print(f"✓ VM deleted: {vm_name}")


def main():
    """Main execution function"""
    parser = argparse.ArgumentParser(description="Deploy simulations to Azure VMs")
    parser.add_argument(
        "--case-studies",
        nargs="+",
        help="List of case studies to run (e.g., GridSize CorrelationSweep)"
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Run all configured case studies"
    )
    parser.add_argument(
        "--download-only",
        action="store_true",
        help="Only download results, skip deployment"
    )
    parser.add_argument(
        "--no-cleanup",
        action="store_true",
        help="Skip VM deletion after completion"
    )

    args = parser.parse_args()

    # Determine which case studies to run
    if args.all:
        case_studies_to_run = list(config.CASE_STUDIES.keys())
    elif args.case_studies:
        case_studies_to_run = args.case_studies
    else:
        print("Error: Must specify --case-studies or --all")
        sys.exit(1)

    print_banner("AZURE CLOUD SIMULATION DEPLOYMENT")

    # Check Azure login
    if not check_azure_login():
        sys.exit(1)

    print(f"Case studies to run: {', '.join(case_studies_to_run)}")
    print(f"Number of VMs: {config.NUM_VMS}")
    print(f"VM Size: {config.VM_SIZE}")
    print(f"Estimated cost: ~${config.COST_PER_HOUR[config.VM_SIZE] * config.NUM_VMS * 5:.2f} (assuming 5 hours)")
    print()

    response = input("Continue with deployment? (yes/no): ").lower().strip()
    if response != "yes":
        print("Deployment cancelled")
        sys.exit(0)

    if not args.download_only:
        # Step 1: Create infrastructure
        print_banner("STEP 1: CREATING AZURE INFRASTRUCTURE")
        create_resource_group()
        storage_key = create_storage_account()

        # Step 2: Create VMs
        print_banner("STEP 2: CREATING VIRTUAL MACHINES")
        vm_names = [f"sim-vm-{i}" for i in range(config.NUM_VMS)]

        for i, vm_name in enumerate(vm_names):
            create_vm(vm_name, i)

        # Wait for VMs to be ready
        print("\nWaiting for VMs to be ready...")
        time.sleep(30)

        # Get VM IPs
        vm_ips = {vm_name: get_vm_ip(vm_name) for vm_name in vm_names}
        print("\nVM IP Addresses:")
        for vm_name, ip in vm_ips.items():
            print(f"  {vm_name}: {ip}")

        # Step 3: Deploy and run simulations
        print_banner("STEP 3: DEPLOYING AND RUNNING SIMULATIONS")

        # Group case studies by VM
        vm_assignments = {}
        for case_study in case_studies_to_run:
            vm_idx = config.CASE_STUDIES[case_study]["vm_index"]
            if vm_idx not in vm_assignments:
                vm_assignments[vm_idx] = []
            vm_assignments[vm_idx].append(case_study)

        # Run simulations on each VM
        for vm_idx, case_studies in vm_assignments.items():
            vm_name = vm_names[vm_idx]
            vm_ip = vm_ips[vm_name]

            print(f"\n--- VM {vm_idx} ({vm_name}) ---")

            for case_study in case_studies:
                folder = config.CASE_STUDIES[case_study]["folder"]
                upload_simulation_code(vm_ip, folder)
                run_simulation_on_vm(vm_ip, folder, storage_key)

        print_banner("SIMULATIONS COMPLETED")

    # Step 4: Download results
    print_banner("STEP 4: DOWNLOADING RESULTS")
    subprocess.run(["python", "download_results.py"], check=True)

    # Step 5: Cleanup
    if config.AUTO_DELETE_VMS and not args.no_cleanup and not args.download_only:
        print_banner("STEP 5: CLEANING UP RESOURCES")

        for vm_name in vm_names:
            delete_vm(vm_name)

        print("✓ All VMs deleted")

    print_banner("DEPLOYMENT COMPLETE")
    print(f"Results downloaded to: ./azure_results/")
    print(f"Storage account: {config.STORAGE_ACCOUNT_NAME} (kept for future use)")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nDeployment interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nError occurred: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
