"""
Download Results from Azure Blob Storage

This script downloads simulation results from Azure Storage
and extracts them to local directories.

Usage:
    python download_results.py
    python download_results.py --case-study GridSize  # Download specific study only
"""

import argparse
import subprocess
import os
import tarfile
from pathlib import Path
import json

import config_azure as config


def get_storage_key():
    """Get storage account key"""
    print("Retrieving storage account key...")
    result = subprocess.run([
        "az", "storage", "account", "keys", "list",
        "--account-name", config.STORAGE_ACCOUNT_NAME,
        "--resource-group", config.RESOURCE_GROUP,
        "--output", "json"
    ], capture_output=True, text=True, check=True)

    keys = json.loads(result.stdout)
    return keys[0]["value"]


def list_blobs(storage_key):
    """List all blobs in the container"""
    print(f"Listing blobs in container: {config.CONTAINER_NAME}...")

    result = subprocess.run([
        "az", "storage", "blob", "list",
        "--account-name", config.STORAGE_ACCOUNT_NAME,
        "--account-key", storage_key,
        "--container-name", config.CONTAINER_NAME,
        "--output", "json"
    ], capture_output=True, text=True, check=True)

    blobs = json.loads(result.stdout)
    return blobs


def download_blob(blob_name, output_path, storage_key):
    """Download a single blob"""
    print(f"Downloading: {blob_name}...")

    subprocess.run([
        "az", "storage", "blob", "download",
        "--account-name", config.STORAGE_ACCOUNT_NAME,
        "--account-key", storage_key,
        "--container-name", config.CONTAINER_NAME,
        "--name", blob_name,
        "--file", output_path,
        "--output", "none"
    ], check=True)

    print(f"✓ Downloaded: {blob_name}")


def extract_results(archive_path, extract_to):
    """Extract tar.gz archive"""
    print(f"Extracting: {archive_path}...")

    with tarfile.open(archive_path, "r:gz") as tar:
        tar.extractall(path=extract_to)

    print(f"✓ Extracted to: {extract_to}")


def main():
    """Main execution function"""
    parser = argparse.ArgumentParser(description="Download simulation results from Azure")
    parser.add_argument(
        "--case-study",
        help="Download specific case study only (e.g., GridSize)"
    )
    parser.add_argument(
        "--output-dir",
        default="azure_results",
        help="Output directory for downloaded results (default: azure_results)"
    )

    args = parser.parse_args()

    print("="*70)
    print("DOWNLOADING SIMULATION RESULTS FROM AZURE".center(70))
    print("="*70 + "\n")

    # Create output directory
    output_dir = Path(args.output_dir)
    output_dir.mkdir(exist_ok=True)

    # Get storage key
    storage_key = get_storage_key()

    # List all blobs
    blobs = list_blobs(storage_key)

    if not blobs:
        print("No results found in Azure Storage")
        return

    print(f"\nFound {len(blobs)} blob(s):")
    for blob in blobs:
        print(f"  - {blob['name']} ({blob['properties']['contentLength'] / 1024 / 1024:.2f} MB)")

    print()

    # Download results
    for blob in blobs:
        blob_name = blob["name"]

        # Filter by case study if specified
        if args.case_study and not blob_name.startswith(args.case_study):
            continue

        # Download based on file type
        if blob_name.endswith("_results.tar.gz"):
            # Results archive
            archive_path = output_dir / blob_name
            download_blob(blob_name, str(archive_path), storage_key)

            # Extract
            case_study_name = blob_name.replace("_results.tar.gz", "")
            extract_to = output_dir / case_study_name
            extract_results(archive_path, extract_to)

            # Remove archive after extraction
            archive_path.unlink()

        elif blob_name.endswith(".log"):
            # Log file
            log_path = output_dir / blob_name
            download_blob(blob_name, str(log_path), storage_key)

        else:
            # Other files
            file_path = output_dir / blob_name
            download_blob(blob_name, str(file_path), storage_key)

    print("\n" + "="*70)
    print("DOWNLOAD COMPLETE".center(70))
    print("="*70)
    print(f"\nResults saved to: {output_dir.absolute()}")

    # Show summary
    print("\nDownloaded case studies:")
    for subdir in output_dir.iterdir():
        if subdir.is_dir():
            # Count files
            num_files = sum(1 for _ in subdir.rglob("*") if _.is_file())
            print(f"  ✓ {subdir.name} ({num_files} files)")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nDownload interrupted by user")
    except Exception as e:
        print(f"\n\nError occurred: {e}")
        import traceback
        traceback.print_exc()
