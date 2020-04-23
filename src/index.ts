process.env.AWS_SDK_LOAD_CONFIG = "1";
import * as AWS from "aws-sdk";

export const templateTags = [
  {
    name: "cfoutput",
    displayName: "CF Output",
    description: "Get CloudFormation Outputs",
    args: [
      {
        displayName: "StackName",
        description: "Name of the CloudFormation stack",
        type: "string",
      },
      {
        displayName: "Output",
        description: "Name of the stack output",
        type: "string",
      },
      {
        displayName: "Region",
        description: "AWS Region",
        type: "string",
        defaultValue: "us-east-1",
      },
      {
        displayName: "Profile",
        description: "Name of the AWS CLI Profile to use",
        type: "string",
      },
    ],
    async run(
      context,
      StackName: string,
      output: string,
      region: string,
      profile: string
    ): Promise<string> {
      let credentials;

      if (profile) {
        credentials = new AWS.SharedIniFileCredentials({ profile });
      }

      const cf = new AWS.CloudFormation({ region: region, credentials });
      const stackDescriptions = await cf
        .describeStacks({
          StackName,
        })
        .promise();

      if (!stackDescriptions?.Stacks)
        throw new Error(`Error getting data for stack ${StackName}`);

      const resultOutput = stackDescriptions.Stacks.reduce(
        (outputs: AWS.CloudFormation.Outputs, stack) =>
          outputs.concat(stack.Outputs),
        []
      ).find((output) => output.OutputKey === output);

      if (!resultOutput?.OutputValue) {
        throw new Error(
          `Could not find output ${output} on stack ${StackName}`
        );
      }

      return resultOutput.OutputValue;
    },
  },
] as Array<Insomnia.TemplateTag>;
