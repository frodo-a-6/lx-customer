import { Construct } from 'constructs';
import {SubnetType, Vpc} from 'aws-cdk-lib/aws-ec2';

export class VpcConstruct extends Construct {
    public readonly vpc: Vpc;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.vpc = new Vpc(this, 'Vpc', {
            maxAzs: 2,
            natGateways: 0,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'public-subnet',
                    subnetType: SubnetType.PUBLIC,
                },
            ],
        });
    }
}