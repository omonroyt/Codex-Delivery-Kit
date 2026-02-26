# Terraform AWS Base

Base IaC para AWS con:

- S3 de artifacts
- CloudWatch Log Group

## Uso

```bash
terraform init
terraform plan -var='artifacts_bucket_name=my-bucket-name'
terraform apply -var='artifacts_bucket_name=my-bucket-name'
```

