const path = require("path")
const rspack = require("@rspack/core")

module.exports = {
	entry: {
		main: path.join(__dirname, "../src/main.tsx"),
	},
	output: {
		publicPath: "auto",
	},
	mode: "development",
	target: "web",
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: "asset",
			},
			{
				test: /\.(ts|tsx|js|jsx)$/,
				use: {
					loader: "builtin:swc-loader",
					options: {
						sourceMap: true,
						jsc: {
							parser: {
								syntax: "typescript",
								tsx: true,
							},
							transform: {
								react: {
									runtime: "automatic",
								},
							},
						},
					},
				},
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: [rspack.CssExtractRspackPlugin.loader, "css-loader", "postcss-loader"],
			},
		],
	},
	plugins: [
		new rspack.CssExtractRspackPlugin({
			filename: "[name].[contenthash].css",
		}),
		new rspack.HtmlRspackPlugin({
			template: path.join(__dirname, "../index.html"),
		}),
		new rspack.CopyRspackPlugin({
			patterns: [{ from: "manifest.json" }, { from: "./public/favicon.ico" }],
		})
	],
	resolve: {
		extensions: [".jsx", ".tsx", ".ts", ".js", ".json"],
	}
}
