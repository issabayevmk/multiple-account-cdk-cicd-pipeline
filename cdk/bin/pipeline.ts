#!/usr/bin/env node
import { App } from '@aws-cdk/core';
import { CdkPipelineStack } from '../lib/cdk-pipeline-stack';

const app = new App();

new CdkPipelineStack(app, 'CdkPipelineStack', {
  //env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  account: '118379544242',
  region: 'eu-central-1'
});

app.synth();
