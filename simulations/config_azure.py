"""
Azure Configuration for Running Simulations on Cloud VMs
"""

# Azure Resource Configuration
RESOURCE_GROUP = "social-simulations"
LOCATION = "eastus"  # Change to your preferred region
STORAGE_ACCOUNT_NAME = "socialsimulationsnew"  # Must be globally unique, lowercase, no hyphens
CONTAINER_NAME = "simulation-results"

# VM Configuration
VM_SIZE = "Standard_D8s_v3"  # 8 cores, 32GB RAM - ~$0.38/hour
# Alternative options:
# "Standard_D4s_v3"  # 4 cores, 16GB RAM - ~$0.19/hour
# "Standard_D16s_v3" # 16 cores, 64GB RAM - ~$0.77/hour
# "Standard_D32s_v3" # 32 cores, 128GB RAM - ~$1.54/hour

VM_IMAGE = "Canonical:0001-com-ubuntu-server-jammy:22_04-lts-gen2:latest"  # Ubuntu 22.04 LTS
ADMIN_USERNAME = "azureuser"

# Case Study Assignments
# Maps case study name to VM
# You can run multiple studies on same VM or distribute across multiple VMs
CASE_STUDIES = {
    "CorrelationSweep": {
        "folder": "CorrelationSweep",
        "vm_index": 0,  # Runs on VM 0
        "priority": 1
    },
    "OrderedRatio": {
        "folder": "OrderedRatio",
        "vm_index": 0,  # Runs on VM 0 (sequential after CorrelationSweep)
        "priority": 2
    }
}

# Number of VMs to create
# Based on max vm_index in CASE_STUDIES
NUM_VMS = max(study["vm_index"] for study in CASE_STUDIES.values()) + 1

# SSH Configuration
SSH_KEY_PATH = "~/.ssh/id_rsa.pub"  # Path to your public SSH key
# If you don't have one, generate with: ssh-keygen -t rsa -b 4096

# Timeouts and Monitoring
VM_STARTUP_TIMEOUT = 600  # seconds (10 minutes)
SIMULATION_TIMEOUT = 43200  # seconds (12 hours max per simulation)
POLLING_INTERVAL = 60  # seconds between status checks

# Cleanup Configuration
AUTO_DELETE_VMS = True  # Automatically delete VMs after completion
AUTO_DELETE_RESOURCE_GROUP = False  # Keep resource group (for storage)
KEEP_STORAGE_ACCOUNT = True  # Keep storage account with results

# Cost Estimation (approximate, verify with Azure pricing)
COST_PER_HOUR = {
    "Standard_D4s_v3": 0.19,
    "Standard_D8s_v3": 0.38,
    "Standard_D16s_v3": 0.77,
    "Standard_D32s_v3": 1.54
}

# Tags for Azure resources (for tracking and billing)
RESOURCE_TAGS = {
    "project": "social-simulations",
    "environment": "research",
    "auto-shutdown": "true"
}
