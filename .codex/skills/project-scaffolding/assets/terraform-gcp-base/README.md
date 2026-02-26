# Terraform GCP Base

Base IaC para GCP con Cloud Storage para artifacts.

## Uso

```bash
terraform init
terraform plan -var='project_id=my-project' -var='artifacts_bucket_name=my-bucket'
terraform apply -var='project_id=my-project' -var='artifacts_bucket_name=my-bucket'
```

