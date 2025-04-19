import {Construct} from "constructs";
import {Bucket} from "aws-cdk-lib/aws-s3";
import {Distribution, ViewerProtocolPolicy} from "aws-cdk-lib/aws-cloudfront";
import {S3Origin} from "aws-cdk-lib/aws-cloudfront-origins";
import {CfnOutput} from "aws-cdk-lib";
import {PolicyStatement, ServicePrincipal} from "aws-cdk-lib/aws-iam";

export class CloudfrontConstruct extends Construct {
    constructor(scope: Construct, id: string, bucket: Bucket, account: string) {
        super(scope, id);

        const distribution = new Distribution(this, 'FrontendDistribution', {
            defaultRootObject: 'index.html',
            defaultBehavior: {
                origin: new S3Origin(bucket),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
        })

        bucket.addToResourcePolicy(new PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [bucket.arnForObjects('*')],
            principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
            conditions: {
                StringEquals: {
                    'AWS:SourceArn': `arn:aws:cloudfront::${account}:distribution/${distribution.distributionId}`,
                },
            },
        }));

        const cloudFrontUrl = `https://${distribution.domainName}`;

        new CfnOutput(this, 'CloudFrontURL', {
            value: cloudFrontUrl,
            description: 'The URL of the CloudFront distribution',
            exportName: 'FrontendCloudFrontUrl',
        });
    }

}