import fs from 'fs';
import path from 'path';
import { Config, createGenerator } from 'ts-json-schema-generator';
import { Compiler, WebpackPluginInstance } from 'webpack';

export interface JSONSchemaGenerateWebpackPluginOptions extends Omit<Config, 'tsconfig'> {
  path: string;
  output: string;
}

export default class JSONSchemaGenerateWebpackPlugin implements WebpackPluginInstance {
  private options: JSONSchemaGenerateWebpackPluginOptions;
  private changed: boolean = true;

  constructor(options: JSONSchemaGenerateWebpackPluginOptions) {
    this.options = options;
  }

  public apply(compiler: Compiler) {
    compiler.hooks.watchRun.tapAsync(
      { name: 'JSONSchemaGeneratePlugin' },
      (compilation, callback) => {
        if (compilation.modifiedFiles?.has(this.options.path)) {
          this.changed = true;
        }
        callback();
      });

    compiler.hooks.afterEmit.tapAsync(
      { name: 'JSONSchemaGeneratePlugin' },
      async (compilation, callback) => {
        if (!this.changed) {
          callback();
          return;
        }
        const generator = createGenerator({ ...this.options });
        const schema = generator.createSchema(this.options.type);
        const json = this.options.minify ? JSON.stringify(schema) : JSON.stringify(schema, null, 2);
        await fs.promises.writeFile(path.join(compiler.outputPath, this.options.output), json, 'utf-8');
        this.changed = false;
        callback();
      },
    );
  }

}
