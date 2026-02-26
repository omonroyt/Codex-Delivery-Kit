output "artifacts_bucket" {
  value = aws_s3_bucket.app_artifacts.id
}

output "log_group_name" {
  value = aws_cloudwatch_log_group.app_logs.name
}

