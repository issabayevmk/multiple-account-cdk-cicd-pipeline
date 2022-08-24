import { Stack, StackProps, Construct, CfnOutput } from "@aws-cdk/core";
import { S3 } from "@aws-cdk/aws-s3";

export interface S3StackProps extends StackProps {
    /*env: {
        account: '118379544242',
        region: 'eu-central-1'
      },*/
      name: string
}

export class S3Stack extends Stack {
    constructor(scope: Construct, id: string, props?: S3StackProps) {
        super(scope, id, props);

        const bucket = new S3.Bucket(this, 'SecurePipelineBucket', {
            accessControl: S3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
            encryption: S3.BucketEncryption.S3_MANAGED,
            blockPublicAccess: S3.blockPublicAccess.BLOCK_ALL
        });

    }
}