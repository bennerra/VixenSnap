export const CracoAlias = require("craco-alias");

module.exports = {
  devServer: {
    port: 443,
  },
  plugins: [
    {
      plugin: CracoAlias,
      baseUrl: ".",
      options: {
        source: "tsconfig",
        tsConfigPath: "./tsconfig.extend.json",
      },
    },
  ],
};
