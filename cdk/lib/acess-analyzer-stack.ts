import { Construck, Stack } from "@aws-cdk/core";
import { AccessAnalyzer } from "@aws-cdk/aws-accessanalyzer";

export class AccessAnalyzerStack extends Stack {
    readonly AccessAnalyzer: AccessAnalyzer;
    readonly CfnAnalyzer: AccessAnalyzer.CfnAnalyzer;
    
    constructor(scope: Construck, id: string) {
        super(scope, id)
    
    
    this.CfnAnalyzer = new AccessAnalyzer.CfnAnalyzer(this, 'MyCfnAnalyzer', {
        type: 'ACCOUNT',
        analyzerName: 'PipelineAccessAnalyzer',
      });
  }
}
