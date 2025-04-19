import {Construct} from 'constructs';
import {Credentials, DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion} from 'aws-cdk-lib/aws-rds';
import {InstanceClass, InstanceSize, InstanceType, Peer, Port, SubnetType, Vpc} from 'aws-cdk-lib/aws-ec2';
import {Secret} from 'aws-cdk-lib/aws-secretsmanager';
import {RemovalPolicy} from "aws-cdk-lib";
import {FargateService} from "aws-cdk-lib/aws-ecs";
import {Effect, PolicyStatement} from "aws-cdk-lib/aws-iam";

export class RdsConstruct extends Construct {
    public readonly secret: Secret;

    constructor(scope: Construct, id: string, vpc: Vpc, fargateService: FargateService) {
        super(scope, id);

        this.secret = new Secret(this, 'rds-master-secret', {
            secretName: 'rds-master-secret',
            description: "Database master user credentials",
            generateSecretString: {
                secretStringTemplate: JSON.stringify({username: 'postgres', port: '5432'}),
                generateStringKey: 'password',
                passwordLength: 16,
                excludePunctuation: true,
            },
        });
        const instance = new DatabaseInstance(this, 'PostgresInstance', {
            engine: DatabaseInstanceEngine.postgres({
                version: PostgresEngineVersion.of('17.2', 'postgres17'),
            }),
            vpc,
            vpcSubnets: {subnetType: SubnetType.PUBLIC},
            publiclyAccessible: true,
            instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
            allocatedStorage: 20,
            credentials: Credentials.fromSecret(this.secret),
            multiAz: false,
            deletionProtection: false,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        instance.connections.allowFrom(
            Peer.ipv4('0.0.0.0/0'), // temporarily allow all IPs
            Port.tcp(5432),
        )

        instance.connections.allowDefaultPortFrom(fargateService, 'Allow ECS to connect to RDS');

        fargateService.taskDefinition.taskRole.addToPrincipalPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['secretsmanager:GetSecretValue'],
                resources: [this.secret.secretArn]
            })
        )
    }
}

