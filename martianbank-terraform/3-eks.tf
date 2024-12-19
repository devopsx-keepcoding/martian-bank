# Create an IAM role for the EKS cluster
resource "aws_iam_role" "eks" {
  # Name of the IAM role, incorporating the EKS cluster name for uniqueness
  name = "eks-cluster-${var.eks_cluster_name}" # Example: "eks-cluster-martianbank"

  # Define the trust relationship policy that allows EKS to assume this role
  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17", # Specifies the policy language version
  "Statement": [
    {
      "Effect": "Allow", # Grants permission
      "Principal": {
        "Service": "eks.amazonaws.com" # Allows the EKS service to assume the role
      },
      "Action": "sts:AssumeRole" # Action enabling the service to use the role
    }
  ]
}
POLICY
}

# Attach the Amazon EKS Cluster Policy to the IAM role
resource "aws_iam_role_policy_attachment" "eks_amazon_eks_cluster_policy" {
  # ARN of the managed policy providing permissions for EKS cluster management
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  # Specifies the IAM role to attach the policy to
  role       = aws_iam_role.eks.name
}

# Create the EKS cluster
resource "aws_eks_cluster" "this" {
  name     = var.eks_cluster_name 
  version  = var.eks_version 
  role_arn = aws_iam_role.eks.arn

  # Specify the VPC configuration for the cluster
  vpc_config {
    # Subnet IDs for the cluster (combines private and public subnets for flexibility)
    subnet_ids = concat(
      module.vpc.private_subnets, # Private subnets for internal communication
      module.vpc.public_subnets  # Public subnets for public-facing workloads
    )
  }

  # Ensure the cluster creation waits for the IAM role policy to be attached
  depends_on = [aws_iam_role_policy_attachment.eks_amazon_eks_cluster_policy]
}
