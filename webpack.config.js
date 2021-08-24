const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebackPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');

const {
  devServer,
  loadCss,
  cleanBuildDirectory,
  extractCss,
  loadImages,
  loadFonts,
  loadBabel,
  minifyJavaScript,
  lintJavaScript,
} = require('./webpack.parts');

const DEV = 'development';

const srcFolder = 'src';
const distFolder = 'dist';

const PATHS = {
  src: path.join(__dirname, srcFolder),
  dist: path.join(__dirname, distFolder),
};

const htmlFileNames = fs.readdirSync(PATHS.src).filter((fileName) => {
  return /\.html$/.test(fileName);
});

if (htmlFileNames.length < 1) {
  throw new Error(
    `The ${srcFolder} directory requires at least one .html file.`,
  );
}

module.exports = (_, argv) => {
  const mode = argv.mode;
  // first parameter of merge function is the
  // basis of what you may find in the webpack.config.js file
  const commonConfig = merge(
    {
      entry: {
        app: path.join(PATHS.src, 'js', 'index.js'),
      },
      output: {
        filename: `app${mode === DEV ? '' : '.[contenthash]'}.js`,
        path: PATHS.dist,
        publicPath: '',
      },
      plugins: [
        // yeah I know file name
        // two words!!! it's fileName, camelcased
        ...htmlFileNames.map((fileName) => {
          return new HtmlWebpackPlugin({
            template: path.join(PATHS.src, fileName),
            inject: 'body',
            chunks: ['app'],
            filename: fileName,
            favicon: 'favicon.ico',
          });
        }),
        new CopyWebackPlugin({
          patterns: [
            {
              from: 'favicon.ico',
              to: 'favicon.ico',
            },
          ],
        }),
      ],
    },
    loadFonts({
      options: {
        name: 'fonts/[name].[ext]',
        limit: 4096,
      },
    }),
    lintJavaScript(),
    loadBabel({
      exclude: /(node_modules)/,
      options: {
        presets: ['@babel/preset-env'],
      },
    }),
  );

  const developmentConfig = merge(
    {
      devtool: 'source-map',
    },
    devServer({
      port: process.env.PORT || 8000,
    }),
    loadCss(),
    loadImages({
      options: {
        name: '[path][name].[ext]?hash=[hash:20]',
        limit: 8192,
      },
    }),
  );

  const productionConfig = merge(
    cleanBuildDirectory(distFolder),
    extractCss(),
    loadImages({
      options: {
        name: 'images/[name].[hash:20].[ext]',
        limit: 8192,
      },
    }),
    minifyJavaScript(),
  );

  return merge(
    commonConfig,
    mode === DEV ? developmentConfig : productionConfig,
  );
};
