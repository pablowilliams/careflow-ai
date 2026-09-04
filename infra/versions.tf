terraform {
  required_version = ">= 1.8.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = local.tags
  }
}

locals {
  name = "careflow-${var.environment}"
  tags = {
    Application        = "careflow-ai"
    Environment        = var.environment
    Owner              = var.owner
    DataClassification = "synthetic-only"
    ManagedBy          = "terraform"
  }
}
