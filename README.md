# TS JSON Schema Generator Webpack Plugin

Auto generate JSON schema after build or after file change in watching mode.

## Installation

```shell
npm install -D ts-json-schema-generator-webpack-plugin
```

## Configuration

Note: **Do not support tsconfig**

```typescript
export interface JSONSchemaGenerateWebpackPluginOptions extends Omit<Config, 'tsconfig'> {
  path: string;
  output: string;
}
```

More options see: <https://github.com/vega/ts-json-schema-generator#options>

## Example

```typescript
import JSONSchemaGenerateWebpackPlugin from 'ts-json-schema-generator-webpack-plugin';

module.exports = {
  // ...
  plugins: [
    // ...
    new JSONSchemaGenerateWebpackPlugin({
      type: 'Config',
      path: path.join(__dirname, './src/config/index.ts'),
      topRef: false,
      output: 'config.schema.json',
      additionalProperties: true,
    }),
  ],
};
```
