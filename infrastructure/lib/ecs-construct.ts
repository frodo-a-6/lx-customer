import {Construct} from "constructs";
import {
    GatewayVpcEndpointAwsService,
    InterfaceVpcEndpointAwsService,
    Port,
    SecurityGroup,
    SubnetType,
    Vpc
} from "aws-cdk-lib/aws-ec2";
import {Cluster, ContainerImage, FargateService} from "aws-cdk-lib/aws-ecs";
import {ApplicationLoadBalancedFargateService} from "aws-cdk-lib/aws-ecs-patterns";
import {Repository} from "aws-cdk-lib/aws-ecr";
import {ManagedPolicy, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {CfnOutput, Duration} from "aws-cdk-lib";

export class EcsConstruct extends Construct {
    public readonly fargateService: FargateService

    constructor(scope: Construct, id: string, vpc: Vpc) {
        super(scope, id);

        const cluster = new Cluster(this, 'Cluster', {vpc});

        const ecrRepo = Repository.fromRepositoryName(
            this,
            'BackendRepo',
            'springboot-backend'
        );

        const executionRole = new Role(this, 'FargateExecutionRole', {
            assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'),
            ],
        });

        const fargate = new ApplicationLoadBalancedFargateService(this, 'FargateService', {
            cluster: cluster,
            cpu: 256,
            memoryLimitMiB: 512,
            desiredCount: 1,
            taskImageOptions: {
                image: ContainerImage.fromEcrRepository(ecrRepo, 'latest'),
                containerPort: 8080,
                executionRole,
            },
            publicLoadBalancer: true,
            assignPublicIp: true,
            taskSubnets: {
                subnetType: SubnetType.PUBLIC,
            },
            healthCheckGracePeriod: Duration.seconds(60),
        });

        fargate.targetGroup.configureHealthCheck({
            path: '/actuator/health',
            healthyHttpCodes: '200',
        });

        this.fargateService = fargate.service;

        const endpointSecGrp = new SecurityGroup(this, 'VpcEndpointSecurityGroup', {
            vpc,
            description: 'Security group for ECR + S3 interface endpoints',
            allowAllOutbound: true,
        });

        const fargateSecurityGroup = fargate.service.connections.securityGroups[0];

        endpointSecGrp.addIngressRule(
            fargateSecurityGroup,
            Port.tcp(443),
            'Allow HTTPS from Fargate tasks',
        );

        vpc.addInterfaceEndpoint('EcrApiEndpoint', {
            service: InterfaceVpcEndpointAwsService.ECS,
            privateDnsEnabled: true,
            subnets: {
                subnetType: SubnetType.PUBLIC,
            },
            securityGroups: [endpointSecGrp],
        });

        vpc.addInterfaceEndpoint('EcrDkrEndpoint', {
            service: InterfaceVpcEndpointAwsService.ECR_DOCKER,
            privateDnsEnabled: true,
            subnets: {
                subnetType: SubnetType.PUBLIC,
            },
            securityGroups: [endpointSecGrp],
        });

        vpc.addGatewayEndpoint('S3GatewayEndpoint', {
            service: GatewayVpcEndpointAwsService.S3,
            subnets: [
                {
                    subnetType: SubnetType.PUBLIC,
                }
            ]
        });

        vpc.addInterfaceEndpoint('CloudWatchLogsEndpoint', {
            service: InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
            privateDnsEnabled: true,
            subnets: {
                subnetType: SubnetType.PUBLIC,
            },
            securityGroups: [endpointSecGrp]
        });

        new CfnOutput(this, 'BackendURL', {
            value: 'http://' + fargate.loadBalancer.loadBalancerDnsName,
            description: 'The URL of the backend service',
            exportName: 'BackendURL',
        });
    }
}