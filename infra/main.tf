resource "aws_kms_key" "careflow" {
  description             = "CareFlow synthetic workflow encryption"
  enable_key_rotation     = true
  deletion_window_in_days = 30
}

resource "aws_kms_alias" "careflow" {
  name          = "alias/${local.name}"
  target_key_id = aws_kms_key.careflow.key_id
}

resource "aws_dynamodb_table" "workflow" {
  name         = "${local.name}-workflow"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"
  range_key    = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.careflow.arn
  }

  point_in_time_recovery {
    enabled = true
  }

  ttl {
    attribute_name = "expiresAt"
    enabled        = true
  }
}

resource "aws_s3_bucket" "knowledge" {
  bucket = "${local.name}-knowledge-${data.aws_caller_identity.current.account_id}"
}
resource "aws_s3_bucket_versioning" "knowledge" {
  bucket = aws_s3_bucket.knowledge.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "knowledge" {
  bucket = aws_s3_bucket.knowledge.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.careflow.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "knowledge" {
  bucket                  = aws_s3_bucket.knowledge.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_cloudwatch_log_group" "application" {
  name              = "/careflow/${var.environment}/application"
  retention_in_days = 30
  kms_key_id        = aws_kms_key.careflow.arn
}

resource "aws_ssm_parameter" "kill_switch" {
  name  = "/careflow/${var.environment}/write-kill-switch"
  type  = "String"
  value = tostring(var.write_kill_switch)
}

resource "aws_budgets_budget" "monthly" {
  name         = "${local.name}-monthly"
  budget_type  = "COST"
  limit_amount = tostring(var.monthly_budget_gbp)
  limit_unit   = "GBP"
  time_unit    = "MONTHLY"
}

data "aws_caller_identity" "current" {}

# AgentCore Runtime, Gateway, Bedrock model profiles, Knowledge Bases, Lambda,
# Step Functions, API Gateway, WAF and workforce federation are intentionally
# integration modules, because availability, policy, identity provider, network,
# and organizational controls must be selected in the target NHS environment.
# The durable data, encryption, observability, kill-switch and cost foundations
# above are safe to plan in a standalone synthetic sandbox.
