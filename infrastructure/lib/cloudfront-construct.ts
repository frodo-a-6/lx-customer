import {Construct} from "constructs";
import {Bucket} from "aws-cdk-lib/aws-s3";
import {
    CfnDistribution,
    CfnOriginAccessControl,
    Distribution,
    OriginAccessIdentity,
    ViewerProtocolPolicy
} from "aws-cdk-lib/aws-cloudfront";
import {S3Origin} from "aws-cdk-lib/aws-cloudfront-origins";
import {CfnOutput} from "aws-cdk-lib";
import {PolicyStatement, ServicePrincipal} from "aws-cdk-lib/aws-iam";

export class CloudfrontConstruct extends Construct {
    constructor(scope: Construct, id: string, bucket: Bucket, account: string) {
        super(scope, id);

        const oac = new CfnOriginAccessControl(this, 'FrontendOAC', {
            originAccessControlConfig: {
                name: 'FrontendOAC',
                originAccessControlOriginType: 's3',
                signingBehavior: 'always',
                signingProtocol: 'sigv4',
                description: 'OAC for frontend S3 access',
            },
        });

        const distribution = new Distribution(this, 'FrontendDistribution', {
            defaultRootObject: 'index.html',
            defaultBehavior: {
                origin: new S3Origin(bucket),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
        })

        const cfnDistribution = distribution.node.defaultChild  as CfnDistribution;
        cfnDistribution.addPropertyOverride('DistributionConfig.Origins.0.OriginAccessControlId', oac.attrId);

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