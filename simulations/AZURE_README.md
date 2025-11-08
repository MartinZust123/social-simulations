## Azure Cloud Deployment for Social Simulations

This guide explains how to run multiple case study simulations in parallel on Azure cloud VMs.

## Overview

The Azure deployment system allows you to:
- **Run 3 case studies in parallel** on separate VMs
- **Automatically provision** infrastructure (VMs, storage)
- **Upload and execute** simulations remotely
- **Download results** automatically
- **Clean up** resources after completion

## Prerequisites

### 1. Azure Account
- Active Azure subscription
- Azure CLI installed: `https://docs.microsoft.com/en-us/cli/azure/install-azure-cli`

### 2. Azure CLI Login
```bash
az login
```

### 3. SSH Key (for VM access)
Generate if you don't have one:
```bash
ssh-keygen -t rsa -b 4096
```

Default location: `~/.ssh/id_rsa.pub`

## Configuration

Edit `config_azure.py` to customize:

### Resource Settings
```python
RESOURCE_GROUP = "social-simulations-rg"  # Azure resource group name
LOCATION = "eastus"                        # Azure region
STORAGE_ACCOUNT_NAME = "socialsims"        # Must be globally unique
```

### VM Configuration
```python
VM_SIZE = "Standard_D8s_v3"  # 8 cores, 32GB RAM, ~$0.38/hour
```

**VM Size Options:**
- `Standard_D4s_v3`: 4 cores, 16GB RAM (~$0.19/hour) - For smaller studies
- `Standard_D8s_v3`: 8 cores, 32GB RAM (~$0.38/hour) - **Recommended**
- `Standard_D16s_v3`: 16 cores, 64GB RAM (~$0.77/hour) - For faster execution
- `Standard_D32s_v3`: 32 cores, 128GB RAM (~$1.54/hour) - Maximum speed

### Case Study Assignment
```python
CASE_STUDIES = {
    "GridSize": {"vm_index": 0},         # VM 0
    "CorrelationSweep": {"vm_index": 1}, # VM 1
    "OrderedRatio": {"vm_index": 2}      # VM 2
}
```

- **vm_index**: Which VM runs this study (0-indexed)
- You can assign multiple studies to the same VM (they run sequentially)

## Usage

### Option 1: Run All Case Studies (Recommended)
```bash
cd simulations
python azure_deploy.py --all
```

This will:
1. Create 3 VMs (one per case study)
2. Run all simulations in parallel
3. Download results
4. Delete VMs automatically

### Option 2: Run Specific Case Studies
```bash
python azure_deploy.py --case-studies GridSize CorrelationSweep
```

### Option 3: Download Results Only
```bash
python azure_deploy.py --download-only
```

Useful if simulations are running or already completed.

### Option 4: Keep VMs Running (No Cleanup)
```bash
python azure_deploy.py --all --no-cleanup
```

VMs will remain running for manual inspection.

## Workflow

### Step 1: Create Infrastructure
- Creates resource group
- Creates storage account
- Creates 3 VMs (Standard_D8s_v3)

### Step 2: Deploy Code
- Uploads simulation folders to each VM
- Uploads setup script (`vm_setup.sh`)

### Step 3: Run Simulations
Each VM:
1. Installs Python and dependencies
2. Executes `run_simulation.py`
3. Uploads results to Azure Blob Storage
4. Creates completion marker

### Step 4: Download Results
- Downloads result archives from blob storage
- Extracts to `azure_results/` folder
- Organized by case study name

### Step 5: Cleanup
- Deletes all VMs
- **Keeps** storage account (for result preservation)
- **Keeps** resource group

## Cost Estimation

### With Default Settings (Standard_D8s_v3)

**Scenario 1: All case studies in parallel (3 VMs)**
- GridSize: ~30-60 minutes
- CorrelationSweep: ~15-30 minutes
- OrderedRatio: ~30-60 minutes
- **Total runtime**: ~1 hour (limited by slowest)
- **Cost**: 3 VMs × 1 hour × $0.38 = **~$1.14**

**Scenario 2: Sequential on 1 VM**
- Total runtime: ~2 hours
- Cost: 1 VM × 2 hours × $0.38 = **~$0.76**
- Slower but cheaper

**Storage costs**: ~$0.01/month (negligible)

### Cost Optimization Tips

1. **Use smaller VMs for testing**:
   ```python
   VM_SIZE = "Standard_D4s_v3"  # $0.19/hour
   ```

2. **Run sequentially on 1 VM**:
   ```python
   CASE_STUDIES = {
       "GridSize": {"vm_index": 0},
       "CorrelationSweep": {"vm_index": 0},  # Same VM
       "OrderedRatio": {"vm_index": 0}       # Same VM
   }
   NUM_VMS = 1
   ```

3. **Enable auto-shutdown**:
   Azure portal → VM → Auto-shutdown settings

## File Structure

```
simulations/
├── config_azure.py          # Azure configuration
├── azure_deploy.py          # Main orchestrator
├── vm_setup.sh              # VM initialization script
├── download_results.py      # Result download script
├── AZURE_README.md          # This file
│
├── GridSize/                # Case study 1
├── CorrelationSweep/        # Case study 2
├── OrderedRatio/            # Case study 3
├── FvsQ/                    # Case study 4 (optional)
│
└── azure_results/           # Downloaded results (created after run)
    ├── GridSize/
    │   └── results/
    │       ├── raw_data.csv
    │       ├── aggregated_data.csv
    │       └── plots/
    ├── CorrelationSweep/
    └── OrderedRatio/
```

## Monitoring

### Check VM Status
```bash
az vm list --resource-group social-simulations-rg --output table
```

### SSH into VM
```bash
# Get VM IP
az vm show --resource-group social-simulations-rg --name sim-vm-0 --show-details --query publicIps -o tsv

# Connect
ssh azureuser@<VM_IP>

# Check simulation progress
tail -f /home/azureuser/simulations/GridSize/simulation.log
```

### Check Storage
```bash
az storage blob list \
    --account-name socialsims \
    --container-name simulation-results \
    --output table
```

## Troubleshooting

### Issue: "az command not found"
**Solution**: Install Azure CLI
```bash
# Windows
winget install Microsoft.AzureCLI

# macOS
brew install azure-cli

# Linux
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### Issue: "Storage account name already exists"
**Solution**: Change `STORAGE_ACCOUNT_NAME` in `config_azure.py` to something globally unique

### Issue: "SSH connection refused"
**Solution**: Wait 1-2 minutes after VM creation for SSH to become available

### Issue: "Simulation taking too long"
**Solution**:
- SSH into VM
- Check logs: `tail -f /home/azureuser/simulations/*/simulation.log`
- Check CPU usage: `htop`

### Issue: "Out of memory on VM"
**Solution**: Increase VM size in `config_azure.py`:
```python
VM_SIZE = "Standard_D16s_v3"  # 64GB RAM
```

## Manual Cleanup

If automatic cleanup fails:

### Delete VMs
```bash
az vm delete --resource-group social-simulations-rg --name sim-vm-0 --yes
az vm delete --resource-group social-simulations-rg --name sim-vm-1 --yes
az vm delete --resource-group social-simulations-rg --name sim-vm-2 --yes
```

### Delete Everything
```bash
az group delete --name social-simulations-rg --yes
```

⚠️ **Warning**: This deletes storage account and all results!

## Best Practices

1. **Test locally first**: Run simulations locally before cloud deployment
2. **Start small**: Test with 1 VM and small parameters
3. **Monitor costs**: Check Azure Cost Management regularly
4. **Set spending limits**: Azure portal → Subscriptions → Budgets
5. **Clean up**: Always verify VMs are deleted after completion

## Advanced Usage

### Running FvsQ on Azure

The large F×q study (17,100 simulations) can also run on Azure:

```python
CASE_STUDIES = {
    "FvsQ": {"vm_index": 0}
}
VM_SIZE = "Standard_D32s_v3"  # 32 cores for maximum speed
```

Estimated:
- Runtime: ~1-2 hours (vs. ~4-9 hours locally)
- Cost: ~$3-4

### Parallel FvsQ Sharding

Split FvsQ into 4 VMs for even faster execution:
1. Modify `FvsQ/config.py` to create 4 copies with different F/q ranges
2. Assign each to different VM
3. Merge results afterward

## Support

- Azure documentation: https://docs.microsoft.com/en-us/azure/
- Azure CLI reference: https://docs.microsoft.com/en-us/cli/azure/
- Pricing calculator: https://azure.microsoft.com/en-us/pricing/calculator/

## Security Notes

- SSH keys are used for authentication (no passwords)
- Storage account keys are retrieved at runtime (not stored)
- VMs are in a private resource group
- Consider using Azure Key Vault for production use
