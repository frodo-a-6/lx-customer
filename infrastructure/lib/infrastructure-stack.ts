import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {VpcConstruct} from "./vpc-construct";
import {RdsConstruct} from "./rds-construct";
import {EcsConstruct} from "./ecs-construct";
import {S3Construct} from "./s3-construct";
import {CloudfrontConstruct} from "./cloudfront-construct";

export class InfrastructureStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpc = new VpcConstruct(this, 'VPC');
        const cluster = new EcsConstruct(this, 'ECS', vpc.vpc);
        new RdsConstruct(this, 'RDS', vpc.vpc, cluster.fargateService);
        const bucket = new S3Construct(this, 'FrontendS3');
        new CloudfrontConstruct(this, 'CloudFront', bucket.bucket, this.account);

    }
}
