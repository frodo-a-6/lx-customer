import {Construct} from 'constructs';
import {Credentials, DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion} from 'aws-cdk-lib/aws-rds';
import {InstanceClass, InstanceSize, InstanceType, SubnetType, Vpc} from 'aws-cdk-lib/aws-ec2';
import {Secret} from 'aws-cdk-lib/aws-secretsmanager';
import {RemovalPolicy} from "aws-cdk-lib";

export class RdsConstruct extends Construct {
    constructor(scope: Construct, id: string, vpc: Vpc) {
        super(scope, id);

        const rdsSecret = new Secret(this, 'rds-master-secret', {
            secretName: 'rds-master-secret',
            description: "Database master user credentials",
            generateSecretString: {
                secretStringTemplate: JSON.stringify({ username: 'postgres' }),
                generateStringKey: 'password',
                passwordLength: 16,
                excludePunctuation: true,
            },
        });

        new DatabaseInstance(this, 'PostgresInstance', {
            engine: DatabaseInstanceEngine.postgres({
                version: PostgresEngineVersion.of('17.2', 'postgres17'),
            }),
            vpc,
            vpcSubnets: {subnetType: SubnetType.PRIVATE_WITH_EGRESS},
            instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
            allocatedStorage: 20,
            credentials: Credentials.fromSecret(rdsSecret),
            publiclyAccessible: false,
            multiAz: false,
            deletionProtection: false,
            removalPolicy: RemovalPolicy.DESTROY,
        });
    }
}

