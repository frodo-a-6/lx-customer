import {Construct} from "constructs";
import {SubnetType, Vpc} from "aws-cdk-lib/aws-ec2";
import {Cluster, ContainerImage, FargateService} from "aws-cdk-lib/aws-ecs";
import {ApplicationLoadBalancedFargateService} from "aws-cdk-lib/aws-ecs-patterns";
import {Repository} from "aws-cdk-lib/aws-ecr";

export class EcsConstruct extends Construct {
    public readonly fargateService: FargateService
    constructor(scope: Construct, id: string, vpc: Vpc) {
        super(scope, id);

        const cluster = new Cluster(this, 'Cluster', { vpc });

        const ecrRepo = Repository.fromRepositoryName(
            this,
            'BackendRepo',
            'springboot-backend'
        );

        const fargate = new ApplicationLoadBalancedFargateService(this, 'FargateService', {
            cluster: cluster,
            cpu: 256,
            memoryLimitMiB: 512,
            desiredCount: 1,
            taskImageOptions: {
                image: ContainerImage.fromEcrRepository(ecrRepo, 'latest'),
                containerPort: 8080,
            },
            publicLoadBalancer: true,
            taskSubnets: {
                subnetType: SubnetType.PUBLIC,
            },
        });

        this.fargateService = fargate.service;
    }
}