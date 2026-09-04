# AWS infrastructure

This Terraform establishes the safe synthetic foundation: encrypted/versioned knowledge storage, encrypted/PITR workflow state, a kill switch, logs, and a budget. It deliberately does not invent target-organization identity, networking, live FHIR integration, or Bedrock/AgentCore permissions.

```bash
terraform init
terraform fmt -check
terraform validate
terraform plan -var environment=sandbox -var write_kill_switch=true
```

The default keeps writes disabled. Review service availability and policy in `eu-west-2` before selecting AgentCore resources. Production needs remote state, account vending, SCPs, security services, private connectivity decisions, deployment roles, alarms, backups, and local assurance.
