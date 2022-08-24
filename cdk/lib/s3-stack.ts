import { Stack, StackProps, Construct, CfnOutput } from "@aws-cdk/core";
import { Bucket } from "aws-cdk/aws-s3";

export interface S3StackProps extends StackProps {
    env: {
        account: '118379544242',
        region: 'eu-central-1'
      },
}

export class S3Stack extends Stack {
    constructor(scope: Construct, id: string, props: S3StackProps) {
        super(scope, id, props);

        const bucket = new Bucket.Bucket(this, 'SecurePipelineBucket', {
            encryption: Bucket.BucketEncryption.S3_MANAGED,
            blockPublicAccess: Bucket.blockPublicAccess.BLOCK_ALL
        });

    }
}