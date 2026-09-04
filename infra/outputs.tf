output "workflow_table_name" {
  value = aws_dynamodb_table.workflow.name
}
output "knowledge_bucket_name" {
  value = aws_s3_bucket.knowledge.id
}
output "kms_key_arn" {
  value = aws_kms_key.careflow.arn
}
output "write_kill_switch_parameter" {
  value = aws_ssm_parameter.kill_switch.name
}
