import {Construct} from "constructs";
import {Bucket} from "aws-cdk-lib/aws-s3";
import {CfnDistribution, CfnOriginAccessControl} from "aws-cdk-lib/aws-cloudfront";
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
        const distribution = new CfnDistribution(this, 'FrontendDistribution', {
            distributionConfig: {
                defaultRootObject: 'index.html',
                enabled: true,
                origins: [
                    {
                        id: 'S3Origin',
                        domainName: bucket.bucketRegionalDomainName,
                        originAccessControlId: oac.attrId,
                        s3OriginConfig: {}, // ← leer bedeutet: keine OAI
                    }
                ],
                defaultCacheBehavior: {
                    targetOriginId: 'S3Origin',
                    viewerProtocolPolicy: 'redirect-to-https',
                    allowedMethods: ['GET', 'HEAD'],
                    cachedMethods: ['GET', 'HEAD'],
                    forwardedValues: {
                        queryString: false,
                        cookies: { forward: 'none' },
                    },
                }
            }
        });

        distribution.addPropertyOverride('DistributionConfig.Origins.0.OriginAccessControlId', oac.attrId);

        bucket.addToResourcePolicy(new PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [bucket.arnForObjects('*')],
            principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
            conditions: {
                StringEquals: {
                    'AWS:SourceArn': `arn:aws:cloudfront::${account}:distribution/${distribution.attrId}`,
                },
            },
        }));

        const cloudFrontUrl = `https://${distribution.attrDomainName}`;

        new CfnOutput(this, 'CloudFrontURL', {
            value: cloudFrontUrl,
            description: 'The URL of the CloudFront distribution',
            exportName: 'FrontendCloudFrontUrl',
        });
    }

}