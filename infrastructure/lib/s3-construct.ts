import {Construct} from "constructs";
import {BlockPublicAccess, Bucket} from "aws-cdk-lib/aws-s3";
import {RemovalPolicy} from "aws-cdk-lib";

export class S3Construct extends Construct {
    public readonly bucket: Bucket;
    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.bucket = new Bucket(this, 'FrontendHostingBucket', {
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        });


    }
}