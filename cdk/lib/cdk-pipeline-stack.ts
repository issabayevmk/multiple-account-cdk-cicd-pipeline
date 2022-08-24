import { Construct, Stage, StageProps, Stack, StackProps, Aws } from "@aws-cdk/core";
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep, Wave } from "@aws-cdk/pipelines";
import { S3Stack } from "./s3-stack";
//import { AccessAnalyzerStack } from "./access-analyzer-stack";
import { GraphqlApiStack } from "./api-stack";
import { VpcStack } from "./vpc-stack";
import { RDSStack } from "./rds-stack";
import { IDatabaseInstance } from "@aws-cdk/aws-rds";


export interface AppStageProps extends StageProps {
  //primaryRdsInstance?: IDatabaseInstance,
  //secretReplicationRegions?: string[]
}

class AppStage extends Stage {
  //public readonly apiStack: GraphqlApiStack;
  //public readonly rdsStack: RDSStack;

  constructor(scope: Construct, id: string, props?: AppStageProps) {
    super(scope, id, props);
    
    /*const vpcStack = new VpcStack(this, "VPCStack");

    this.rdsStack = new RDSStack(this, "RDSStack", {
      vpc: vpcStack.vpc,
      securityGroup: vpcStack.ingressSecurityGroup,
      stage: id,
      secretReplicationRegions: props?.secretReplicationRegions || [],
      primaryRdsInstance: props?.primaryRdsInstance
    });

    this.apiStack = new GraphqlApiStack(this, "APIStack", {
      vpc: vpcStack.vpc,
      inboundDbAccessSecurityGroup:
        this.rdsStack.postgresRDSInstance.connections.securityGroups[0].securityGroupId,
      rdsEndpoint: this.rdsStack.postgresRDSInstance.dbInstanceEndpointAddress,
      rdsDbUser: this.rdsStack.rdsDbUser,
      rdsDbName: this.rdsStack.rdsDbName,
      rdsPort: this.rdsStack.rdsPort,
      rdsPasswordSecretName: this.rdsStack.rdsDatabasePasswordSecretName.value,
    });*/

    const s3Stack = new S3Stack(this, "S3Stack");
    //const accessAnalyzerstack = new AccessAnalyzerStack(this, "AccessAnalyzerstack");
    
  }
}

export class CdkPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const githubOrg = process.env.GITHUB_ORG || "issabayevmk";
    const githubRepo = process.env.GITHUB_REPO || "multiple-account-cdk-cicd-pipeline";
    const githubBranch = process.env.GITHUB_BRANCH || "main";
    const devAccountId = process.env.DEV_ACCOUNT_ID || "603325786329";
    const stgAccountId = process.env.STG_ACCOUNT_ID || "066238426285";
    const prdAccountId = process.env.PRD_ACCOUNT_ID || "066238426285";
    const primaryRegion = process.env.PRIMARY_REGION || "eu-central-1";
    const secondaryRegion = process.env.SECONDARY_REGION || "eu-west-1";

    const pipeline = new CodePipeline(this, "Pipeline", {
      crossAccountKeys: true,
      pipelineName: "SecurePipeline",
      synth: new ShellStep("deploy", {
        input: CodePipelineSource.gitHub(`${githubOrg}/${githubRepo}`, githubBranch),
        commands: [ 
          "npm ci",
          "npm run build",
          "npx cdk synth"
        ]
      }),
    });
    
    const devWave = pipeline.addWave("Deployment");
    /*const dev = new AppStage(this, "dev", {
      env: { account: devAccountId, region: primaryRegion }
    });*/
    
    /*const qa = new AppStage(this, "qa", {
      env: { account: devAccountId, region: secondaryRegion }
    });*/

    const dev = new AppStage(this, "dev", {
      env: { account: devAccountId, region: primaryRegion }
    });

    const scratch = new AppStage(this, "scratch", {
      env: { account: stgAccountId, region: primaryRegion }
    });
    
    devWave.addStage(dev);
    devWave.addStage(scratch)
    //devQaWave.addStage(qa);

    /*const primaryRdsRegionWave = pipeline.addWave("Primary-DB-Region-Deployments", {
      pre: [new ManualApprovalStep("ProdManualApproval")]
    });*/
    /*const stgPrimary = new AppStage(this, "stg-primary", {
      env: { account: stgAccountId, region: primaryRegion },
      secretReplicationRegions: [secondaryRegion]
    });*/
    /*const prdPrimary = new AppStage(this, "prd-primary", {
      env: { account: prdAccountId, region: primaryRegion },
      secretReplicationRegions: [secondaryRegion]
    });*/
    //primaryRdsRegionWave.addStage(stgPrimary);
    //primaryRdsRegionWave.addStage(prdPrimary);
    
    //const secondaryRdsRegionWave = pipeline.addWave("Secondary-DB-Region-Deployments");
    /*const stgBackup = new AppStage(this, "stg-backup", {
      env: { account: stgAccountId, region: secondaryRegion },
      primaryRdsInstance: stgPrimary.rdsStack.postgresRDSInstance
    });*/
    /*const prdBackup = new AppStage(this, "prd-backup", {
      env: { account: prdAccountId, region: secondaryRegion },
      primaryRdsInstance: prdPrimary.rdsStack.postgresRDSInstance
    });*/
    //secondaryRdsRegionWave.addStage(stgBackup);
    //secondaryRdsRegionWave.addStage(prdBackup);
  }
}
