const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv");

module.exports = (env) => {
  const plugins = [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "public/index.html",
      inject: "body",
      chunks: ["index"],
    }),
  ];
  const babelLoaderOptions = {
    presets: ["@babel/preset-env"],
  };
  if (env.production) {
    babelLoaderOptions.plugins = ["babel-plugin-jsx-remove-data-test-id"];
  } else {
    Dotenv.config();
  }
  return {
    entry: { index: "./src/index.tsx" },
    resolve: {
      extensions: [".js", ".ts", ".tsx"],
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      environment: {
        arrowFunction: false,
      },
      clean: true,
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.(js|tsx|ts)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: babelLoaderOptions,
          },
        },
        {
          test: /\.(css|scss)$/i,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
        {
          test: /\.mp3$/i,
          type: "asset/resource",
        },
      ],
    },
    devServer: {
      compress: true,
      port: 9090,
      hot: true,
    },
  };
};
