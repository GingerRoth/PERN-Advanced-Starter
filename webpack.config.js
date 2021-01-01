const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const outputDirectory = "dist";

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|jpg)$/,
        use: "url-loader?limit=100000"
      },
      {
        test: /\.(txt|md)$/,
        use: 'raw-loader',
      },
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    fallback: {
      // "fs": false,
      // "tls": false,
      // "net": false,
      "path": false,
      // "zlib": false,
      // "http": false,
      // "https": false,
      // "stream": false,
      // "crypto": false,
      // "crypto-browserify": false,
    }
  },
  devServer: {
    port: 3001,
    // open: true,
    stats: 'minimal',
    historyApiFallback: true,
    proxy: {
      "/api": "http://localhost:3000"
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico"
    })
  ]
};
