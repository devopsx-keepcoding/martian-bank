# Create a VPC using the AWS VPC module from the Terraform Registry
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws" # Official VPC module
  version = "5.16.0" 

  # Name for the VPC, incorporating the EKS cluster name for clarity
  name = "vpc-${var.eks_cluster_name}"

  # CIDR block for the VPC, defining the IP address range
  cidr = "10.0.0.0/16"

  # Specify the availability zones to be used
  azs             = [var.zone1, var.zone2] # Distributes resources across two zones for high availability
  private_subnets = ["10.0.0.0/19", "10.0.32.0/19"] # Two private subnets with /19 CIDR for scalability
  public_subnets  = ["10.0.64.0/19", "10.0.96.0/19"] # Two public subnets with /19 CIDR for elasticity

  # Enable DNS support in the VPC for name resolution
  enable_dns_hostnames = true # Allows DNS hostnames for instances in the VPC
  enable_dns_support   = true # Enables DNS resolution within the VPC

  # Configure NAT gateway settings for outbound internet access for private subnets
  enable_nat_gateway     = true # Enable a NAT gateway to allow private subnets to access the internet
  single_nat_gateway     = true # Use a single NAT gateway for cost-efficiency
  one_nat_gateway_per_az = false # Avoid creating multiple NAT gateways in each AZ

  # Enable automatic public IP assignment for instances in public subnets
  map_public_ip_on_launch = true # Required for public-facing EKS nodes

  # Apply tags to private subnets for EKS cluster integration
  private_subnet_tags = {
    "kubernetes.io/role/internal-elb"               = 1 # Marks as private for internal load balancers
    "kubernetes.io/cluster/${var.eks_cluster_name}" = "owned" # Associates with the EKS cluster
  }

  # Apply tags to public subnets for EKS cluster integration
  public_subnet_tags = {
    "kubernetes.io/role/elb"                        = 1 # Marks as public for external load balancers
    "kubernetes.io/cluster/${var.eks_cluster_name}" = "owned" # Associates with the EKS cluster
  }
}
