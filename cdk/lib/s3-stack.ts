import { Stack, StackProps, Construct, CfnOutput } from "@aws-cdk/core";
import { Bucket } from "aws-cdk/s3";

export class S3Stack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const bucket = new Bucket.Bucket(this, 'SecurePipelineBucket', {
            encryption: Bucket.BucketEncryption.S3_MANAGED,
            blockPublicAccess: Bucket.blockPublicAccess.BLOCK_ALL
        });

    }
}