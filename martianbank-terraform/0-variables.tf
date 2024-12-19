# Define the AWS region where the resources will be deployed
variable "region" {
  default = "eu-west-3" # Paris region in AWS
}

# Define the availability zone 1 for the EKS cluster
variable "zone1" {
  default = "eu-west-3a" # First availability zone within the Paris region
}

# Define the availability zone 2 for the EKS cluster
variable "zone2" {
  default = "eu-west-3b" # Second availability zone within the Paris region
}

# Name of the Amazon EKS (Elastic Kubernetes Service) cluster
variable "eks_cluster_name" {
  default = "martianbank" # The cluster name for easy identification
}

# Kubernetes version to be used for the EKS cluster
variable "eks_version" {
  default = "1.28" # Specifies the version of Kubernetes for the cluster
}