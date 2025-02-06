export const configuration = {
  mode: "production",
  entry: "/index.js", // Entry should be the in-memory file path
  output: {
    path: "/dist", // Output directory in the in-memory filesystem
    filename: "bundle.js",
    library: {
      type: "commonjs2", // Export as CommonJS
    },
  },
  // Enable webpack-like configuration for memfs
  resolve: {
    extensions: [".js"],
  },
};
