"""
Quick script to download GridSize results from VM 0 and delete all VMs
"""

import subprocess
import sys
import os
from pathlib import Path

import config_azure as config


def run_az_command(command):
    """Execute Azure CLI command"""
    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True,
            shell=(sys.platform == "win32")
        )
        return result
    except subprocess.CalledProcessError as e:
        print(f"Error: {e.stderr}")
        raise


def download_results_from_vm():
    """Download GridSize results from VM 0"""
    print("Downloading GridSize results from VM 0...")

    vm_ip = "172.171.209.16"  # VM 0 IP

    # Create local results directory
    local_results = Path(__file__).parent / "azure_results" / "GridSize"
    local_results.mkdir(parents=True, exist_ok=True)

    try:
        # Download results directory using SCP
        print(f"  Downloading from {vm_ip}...")
        subprocess.run([
            "scp", "-r",
            "-o", "StrictHostKeyChecking=no",
            f"{config.ADMIN_USERNAME}@{vm_ip}:/home/azureuser/simulations/GridSize/results/*",
            str(local_results)
        ], check=True, timeout=300)

        print(f"✓ Results downloaded to: {local_results}")

        # Also try to download the log file
        try:
            subprocess.run([
                "scp",
                "-o", "StrictHostKeyChecking=no",
                f"{config.ADMIN_USERNAME}@{vm_ip}:/home/azureuser/simulations/GridSize/simulation.log",
                str(local_results)
            ], timeout=60)
            print(f"✓ Log file downloaded")
        except:
            print("  (Log file not found, skipping)")

        return True
    except subprocess.TimeoutExpired:
        print("✗ Download timed out - simulation may still be running")
        return False
    except Exception as e:
        print(f"✗ Download failed: {e}")
        return False


def delete_all_vms():
    """Delete all 3 VMs"""
    print("\nDeleting all VMs to save costs...")

    vm_names = ["sim-vm-0", "sim-vm-1", "sim-vm-2"]

    for vm_name in vm_names:
        try:
            print(f"  Deleting {vm_name}...")
            run_az_command([
                "az", "vm", "delete",
                "--resource-group", config.RESOURCE_GROUP,
                "--name", vm_name,
                "--yes"
            ])
            print(f"  ✓ {vm_name} deleted")
        except Exception as e:
            print(f"  ✗ Failed to delete {vm_name}: {e}")

    print("\n✓ All VMs deleted!")
    print(f"Storage account '{config.STORAGE_ACCOUNT_NAME}' kept for future use")


def main():
    print("=" * 70)
    print("DOWNLOAD RESULTS AND CLEANUP VMs".center(70))
    print("=" * 70)
    print()

    # Step 1: Download results
    success = download_results_from_vm()

    if not success:
        response = input("\nDownload failed. Delete VMs anyway? (yes/no): ").lower().strip()
        if response != "yes":
            print("Cleanup cancelled")
            return

    # Step 2: Delete VMs
    delete_all_vms()

    print("\n" + "=" * 70)
    print("CLEANUP COMPLETE".center(70))
    print("=" * 70)
    print(f"\nResults saved to: ./azure_results/GridSize/")
    print(f"VMs deleted - no more charges!")
    print(f"Storage account kept: {config.STORAGE_ACCOUNT_NAME}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nCleanup interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nError occurred: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
