# Terraform Azure Base

Base IaC para Azure con:

- Resource Group
- Storage Account para artifacts

## Uso

```bash
terraform init
terraform plan -var='storage_account_name=myuniquestorageacct'
terraform apply -var='storage_account_name=myuniquestorageacct'
```

