import { Stack, StackProps, Construct, CfnOutput } from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";

export interface S3StackProps extends StackProps {
      name: string
}

export class S3Stack extends Stack {
    constructor(scope: Construct, id: string, props?: S3StackProps) {
        super(scope, id, props);

        const bucket = new s3.Bucket(this, 'SecurePipelineBucket', {
            accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
            encryption: s3.BucketEncryption.S3_MANAGED,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
        });

    }
}