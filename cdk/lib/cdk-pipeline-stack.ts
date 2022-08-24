import { Construct, Stage, StageProps, Stack, StackProps, Aws } from "@aws-cdk/core";
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep, Wave } from "@aws-cdk/pipelines";
import { S3Stack } from "./s3-stack";


export interface AppStageProps extends StageProps {
}

class AppStage extends Stage {

  constructor(scope: Construct, id: string, props?: AppStageProps) {
    super(scope, id, props);

    const s3Stack = new S3Stack(this, "S3Stack");
    
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

    /*
    const pipeline = new CodePipeline(this, "Pipeline", {
      crossAccountKeys: true,
      pipelineName: "SecurePipeline",
      synth: new ShellStep("deploy", {
        input: CodePipelineSource.s3('secdoc-poc', 'secdk-poc.zip'),
        commands: [
          "npm ci",
          "npm run build",
          "npx cdk synth"
        ]
      }),
    });
    */
    
    const devWave = pipeline.addWave("Deployment");
  
    const dev = new AppStage(this, "dev", {
      env: { account: devAccountId, region: primaryRegion }
    });

    const stgWave = pipeline.addWave("Staging", {
      pre: [new ManualApprovalStep("StagingManualApproval")]
    });

    const scratch = new AppStage(this, "scratch", {
      env: { account: stgAccountId, region: primaryRegion }
    });

    devWave.addStage(dev);
    stgWave.addStage(scratch);
  }
}
