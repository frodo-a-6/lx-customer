import {Construct} from "constructs";
import {Bucket} from "aws-cdk-lib/aws-s3";
import {Distribution, ViewerProtocolPolicy} from "aws-cdk-lib/aws-cloudfront";
import {S3Origin} from "aws-cdk-lib/aws-cloudfront-origins";
import {CfnOutput} from "aws-cdk-lib";

export class CloudfrontConstruct extends Construct {
    constructor(scope: Construct, id: string, bucket: Bucket) {
        super(scope, id);

        const distribution = new Distribution(this, 'FrontendDistribution', {
            defaultRootObject: 'index.html',
            defaultBehavior: {
                origin: new S3Origin(bucket),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
        })

        const cloudFrontUrl = `https://${distribution.domainName}`;

        new CfnOutput(this, 'CloudFrontURL', {
            value: cloudFrontUrl,
            description: 'The URL of the CloudFront distribution',
            exportName: 'FrontendCloudFrontUrl',
        });
    }

}