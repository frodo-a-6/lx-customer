import {Construct} from "constructs";
import {Vpc} from "aws-cdk-lib/aws-ec2";
import {Cluster, ContainerImage, FargateService} from "aws-cdk-lib/aws-ecs";
import {ApplicationLoadBalancedFargateService} from "aws-cdk-lib/aws-ecs-patterns";
import {Repository} from "aws-cdk-lib/aws-ecr";
import {Stack} from "aws-cdk-lib";

export class EcsConstruct extends Construct {
    public readonly fargateService: FargateService
    constructor(scope: Construct, id: string, vpc: Vpc) {
        super(scope, id);

        const cluster = new Cluster(this, 'Cluster', { vpc });

        new Repository(this, 'BackendRepo', {
            repositoryName: 'springboot-backend',
        });

        const account = Stack.of(this).account;
        const region = Stack.of(this).region;
        const fargate = new ApplicationLoadBalancedFargateService(this, 'FargateService', {
            cluster: cluster,
            cpu: 256,
            memoryLimitMiB: 512,
            desiredCount: 1,
            taskImageOptions: {
                // image: ContainerImage.fromRegistry(`${account}.dkr.ecr.${region}.amazonaws.com/springboot-backend:latest`),
                image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                containerPort: 8080,
            },
            publicLoadBalancer: true,
        });

        this.fargateService = fargate.service;
    }
}