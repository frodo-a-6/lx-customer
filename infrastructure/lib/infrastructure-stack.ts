import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {VpcConstruct} from "./vpc-construct";
import {RdsConstruct} from "./rds-construct";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new VpcConstruct(this, 'VPC');
    new RdsConstruct(this, 'RDS', vpc.vpc);
  }
}
