# Create an IAM role for EKS worker nodes
resource "aws_iam_role" "nodes" {
  name = "eks-node-group-nodes-${var.eks_cluster_name}" # Name of the role, unique per cluster

  # Define the trust policy to allow EC2 instances (nodes) to assume this role
  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
}

# Attach the Amazon EKS Worker Node Policy to the IAM role
resource "aws_iam_role_policy_attachment" "nodes_amazon_eks_worker_node_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy" # Provides permissions to manage nodes
  role       = aws_iam_role.nodes.name
}

# Attach the Amazon EKS CNI Policy for networking capabilities
resource "aws_iam_role_policy_attachment" "nodes_amazon_eks_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy" # Allows the cluster to manage networking
  role       = aws_iam_role.nodes.name
}

# Attach a policy for read-only access to Amazon ECR
resource "aws_iam_role_policy_attachment" "nodes_amazon_ec2_container_registry_read_only" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly" # Provides read-only access to ECR
  role       = aws_iam_role.nodes.name
}

# Optional: Attach a policy to enable SSH access to nodes via SSM
resource "aws_iam_role_policy_attachment" "amazon_ssm_managed_instance_core" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore" # Allows SSM session management
  role       = aws_iam_role.nodes.name
}

# Create a private node group for the EKS cluster
resource "aws_eks_node_group" "private_nodes" {
  cluster_name    = aws_eks_cluster.this.name 
  node_group_name = "private-nodes"
  node_role_arn   = aws_iam_role.nodes.arn

  # Use private subnets for the node group
  subnet_ids = module.vpc.private_subnets # Ensures nodes are internal and secure

  # Specify the instance type and capacity type for the nodes
  capacity_type  = "ON_DEMAND"
  instance_types = ["t3a.medium"]

  # Configure scaling for the node group
  scaling_config {
    desired_size = 2 # Number of nodes to maintain
    max_size     = 2 # Maximum number of nodes
    min_size     = 2 # Minimum number of nodes
  }

  # Configure updates for the node group
  update_config {
    max_unavailable = 1 
  }

  # Add labels for easier identification and management
  labels = {
    role = "private-nodes" # Label to identify these as private nodes
  }

  # Ensure policies are attached before creating the node group
  depends_on = [
    aws_iam_role_policy_attachment.nodes_amazon_eks_worker_node_policy,
    aws_iam_role_policy_attachment.nodes_amazon_eks_cni_policy,
    aws_iam_role_policy_attachment.nodes_amazon_ec2_container_registry_read_only,
  ]
}
