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
        console.info(`Loading profile "${profile}"`);
        credentials = new AWS.SharedIniFileCredentials({ profile });
      }

      const cf = new AWS.CloudFormation({ region: region, credentials });

      console.info(`Getting stack description for ${StackName}`);
      const stackDescriptions = await cf
        .describeStacks({
          StackName,
        })
        .promise();

      if (!stackDescriptions?.Stacks)
        throw new Error(`Error getting data for stack ${StackName}`);

      console.info(
        `Got CF Data for stack ${StackName}: ${JSON.stringify(
          stackDescriptions.Stacks,
          null,
          2
        )}`
      );

      const resultOutput = stackDescriptions.Stacks.reduce(
        (outputs: AWS.CloudFormation.Outputs, stack) =>
          outputs.concat(stack.Outputs),
        []
      ).find((output) => output.OutputKey === output);

      if (!resultOutput?.OutputValue) {
        throw new Error(
          `Could not find output ${output} on stack ${StackName}, results: ${JSON.stringify(
            stackDescriptions.Stacks,
            null,
            2
          )}`
        );
      }

      return resultOutput.OutputValue;
    },
  },
] as Array<Insomnia.TemplateTag>;
