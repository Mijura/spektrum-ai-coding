import { createFsFromVolume, Volume } from "memfs";
import { webpack } from "webpack";
import * as fs from "fs";
import { ufs } from "unionfs";

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const TerserPlugin = require("terser-webpack-plugin");

export const buildSourceCode = async (files: any, projectId:string) => {

  const memoryVolume = Volume.fromJSON(files);

  const memfs = createFsFromVolume(memoryVolume);

  ufs.use(fs).use(memfs as any);

  console.log("📂 Virtual Filesystem Structure:", ufs.readdirSync(__dirname));

  const compiler = webpack({
    entry: {
      index: "./src/index.tsx",
    },
    mode: "production",
    target: "web",
    module: {
      rules: [
        {
          test: /\.(tsx|ts|js)$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                ["@babel/preset-react", { runtime: "automatic" }],
                "@babel/preset-typescript",
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: "./public/favicon.ico" }],
      }),
      new Dotenv({
        path: "./.env", // Path to .env file (this is the default)
        safe: true, // load .env.example (defaults to "false" which does not use dotenv-safe)
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html", // Path to your HTML file
        filename: "index.html", // Output file name
      }),
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
    },

    output: {
      path: path.join(__dirname, projectId),
      filename: "[name].[contenthash].js",
      clean: true
    },
  });

  compiler.inputFileSystem = ufs as any;
  compiler.outputFileSystem = fs as any;

  await compiler.run((err, stats) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stats?.toString({ colors: true }));

    console.log(fs.readdirSync(`./${projectId}`))

    compiler.close(() => {
      console.log("Compiler closed.");
    });

    return stats?.toString({ colors: true });
  });
};
