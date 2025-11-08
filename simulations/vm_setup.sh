#!/bin/bash
#
# VM Setup Script - Runs on each Azure VM
# This script installs dependencies and executes the assigned simulation
#
# Arguments:
#   $1 - Case study name (e.g., "GridSize", "CorrelationSweep")
#   $2 - Azure storage account name
#   $3 - Azure storage container name
#   $4 - Azure storage account key
#

set -e  # Exit on error

CASE_STUDY=$1
STORAGE_ACCOUNT=$2
CONTAINER_NAME=$3
STORAGE_KEY=$4

echo "=========================================="
echo "Social Simulations - VM Setup"
echo "=========================================="
echo "Case Study: $CASE_STUDY"
echo "Started at: $(date)"
echo "Hostname: $(hostname)"
echo "=========================================="

# Update system
echo "[1/7] Updating system packages..."
sudo apt-get update -y
# Skip upgrade to save time - not needed for simulations
# sudo apt-get upgrade -y

# Install Python 3.10+ and pip
echo "[2/7] Installing Python and pip..."
sudo apt-get install -y python3 python3-pip python3-venv

# Install Azure CLI for blob storage upload
echo "[3/7] Installing Azure CLI..."
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Create working directory
echo "[4/7] Setting up working directory..."
mkdir -p /home/azureuser/simulations
cd /home/azureuser/simulations

# Copy simulation files from local storage (uploaded by azure_deploy.py)
# Files are already on the VM at this point

# Install Python dependencies
echo "[5/7] Installing Python dependencies..."
# Try with --user flag first, fallback to direct install if needed
pip3 install --user numpy pandas matplotlib seaborn tqdm || pip3 install numpy pandas matplotlib seaborn tqdm

# Run the simulation
echo "[6/7] Running simulation: $CASE_STUDY"
echo "=========================================="
cd /home/azureuser/simulations/$CASE_STUDY

# Execute the simulation
python3 run_simulation.py 2>&1 | tee simulation.log

echo "=========================================="
echo "Simulation completed!"
echo "=========================================="

# Upload results to Azure Blob Storage
echo "[7/7] Uploading results to Azure Storage..."

# Login to Azure using managed identity or provided credentials
# The azure_deploy.py script will handle authentication

# Create archive of results
if [ ! -d "results" ]; then
    echo "ERROR: Results directory not found! Simulation may have failed."
    exit 1
fi
tar -czf results_${CASE_STUDY}.tar.gz results/

# Upload using Azure CLI
az storage blob upload \
    --account-name "$STORAGE_ACCOUNT" \
    --account-key "$STORAGE_KEY" \
    --container-name "$CONTAINER_NAME" \
    --name "${CASE_STUDY}_results.tar.gz" \
    --file results_${CASE_STUDY}.tar.gz \
    --overwrite

# Also upload the log file
az storage blob upload \
    --account-name "$STORAGE_ACCOUNT" \
    --account-key "$STORAGE_KEY" \
    --container-name "$CONTAINER_NAME" \
    --name "${CASE_STUDY}_simulation.log" \
    --file simulation.log \
    --overwrite

echo "=========================================="
echo "Results uploaded successfully!"
echo "Completed at: $(date)"
echo "=========================================="

# Signal completion (create a done marker)
touch /home/azureuser/simulations/${CASE_STUDY}_DONE
