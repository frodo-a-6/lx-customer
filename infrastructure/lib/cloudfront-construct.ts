import {Construct} from "constructs";
import {Bucket} from "aws-cdk-lib/aws-s3";
import {
    AllowedMethods,
    CachePolicy,
    CfnDistribution,
    CfnOriginAccessControl,
    Distribution, OriginProtocolPolicy, OriginRequestPolicy, ViewerProtocolPolicy
} from "aws-cdk-lib/aws-cloudfront";
import {CfnOutput} from "aws-cdk-lib";
import {PolicyStatement, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {HttpOrigin} from "aws-cdk-lib/aws-cloudfront-origins";

export class CloudfrontConstruct extends Construct {
    constructor(scope: Construct, id: string, bucket: Bucket, account: string, albDnsName: string) {
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
        const frontendDistribution = new CfnDistribution(this, 'FrontendDistribution', {
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

        frontendDistribution.addPropertyOverride('DistributionConfig.Origins.0.OriginAccessControlId', oac.attrId);

        bucket.addToResourcePolicy(new PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [bucket.arnForObjects('*')],
            principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
            conditions: {
                StringEquals: {
                    'AWS:SourceArn': `arn:aws:cloudfront::${account}:distribution/${frontendDistribution.attrId}`,
                },
            },
        }));

        const cloudFrontUrl = `https://${frontendDistribution.attrDomainName}`;

        new CfnOutput(this, 'CloudFrontURL', {
            value: cloudFrontUrl,
            description: 'The URL of the CloudFront distribution',
            exportName: 'FrontendCloudFrontUrl',
        });

        const backendDistribution = new Distribution(this, 'BackendDistribution', {
            defaultBehavior: {
                origin: new HttpOrigin(albDnsName, {
                    protocolPolicy: OriginProtocolPolicy.HTTP_ONLY, // ALB ist nur HTTP erreichbar
                }),
                cachePolicy: CachePolicy.CACHING_DISABLED,
                allowedMethods: AllowedMethods.ALLOW_ALL,
                originRequestPolicy: OriginRequestPolicy.ALL_VIEWER,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
        });

        new CfnOutput(this, 'BackendCloudFrontUrl', {
            value: `https://${backendDistribution.domainName}`,
            description: 'Public HTTPS URL to access backend via CloudFront',
            exportName: 'BackendCloudFrontUrl',
        });
    }

}