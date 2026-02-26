terraform {
  required_version = ">= 1.7.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

resource "aws_s3_bucket" "app_artifacts" {
  bucket = var.artifacts_bucket_name
}

resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/codex-kit/${var.project_name}"
  retention_in_days = 14
}

