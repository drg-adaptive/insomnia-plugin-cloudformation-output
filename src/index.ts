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
    ],
    async run(context, StackName, output, region): Promise<string> {
      const cf = new AWS.CloudFormation({ region: region });
      const stackDescriptions = await cf
        .describeStacks({
          StackName,
        })
        .promise();

      console.info(
        `cfoutput found the following information: ${JSON.stringify(
          stackDescriptions.Stacks
        )}`
      );
      return "Test Value";
    },
  },
] as Array<Insomnia.TemplateTag>;
