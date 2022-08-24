import * as accessanalyzer from '@aws-cdk/aws-accessanalyzer';
import { Construct, Stack, StackProps } from '@aws-cdk/core';

export interface CfnAnalyzerProps extends StackProps {
    name: string
}
/*
export class AccessAnalyzerStack extends Stack {
    constructor(scope: Construct, id: string, props?: CfnAnalyzerProps) {
        super(scope, id);

        
        const Analyzer = new accessanalyzer.CfnAnalyzer(this, 'PipelineAccessAnalyzer', {
            type: 'ACCOUNT',
            analyzerName: 'PipelineAnalyzer'
        });
    }
}
*/
//new CfnAnalyzer(scope: Construct, id: string, props?:CfnAnalyzerProps)