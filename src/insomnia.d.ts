declare module Insomnia {
  export interface TemplateTag {
    name: string;
    displayName: string;
    disablePreview?: () => boolean;
    description?: string;
    deprecated?: boolean;
    liveDisplayName?: (args) => string | undefined;
    validate?: (value: any) => string | undefined;
    priority?: number;
    args: Array<{
      displayName: string;
      description?: string;
      defaultValue: string | number | boolean;
      type: "string" | "number" | "enum" | "model";

      // Only type === 'string'
      placeholder?: string;

      // Only type === 'model'
      modelType: string;

      // Only type === 'enum'
      options: Array<{
        displayName: string;
        value: string;
        description?: string;
        placeholder?: string;
      }>;
    }>;
    run: () => Promise<any>;
  }
}
