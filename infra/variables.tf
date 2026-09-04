variable "aws_region" {
  type    = string
  default = "eu-west-2"
}

variable "environment" {
  type    = string
  default = "sandbox"
  validation {
    condition     = contains(["sandbox", "dev", "test", "prod"], var.environment)
    error_message = "Use a known environment."
  }
}

variable "owner" {
  type    = string
  default = "portfolio"
}

variable "write_kill_switch" {
  type        = bool
  default     = true
  description = "True blocks all write tool execution."
}

variable "monthly_budget_gbp" {
  type    = number
  default = 25
}
