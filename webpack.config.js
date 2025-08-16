const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "tiny-notify.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "TinyNotify",
      type: "umd",
      export: "default",
    },
    clean: true,
    globalObject: "this",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "/"),
    },
    port: 5173,
  },
};
