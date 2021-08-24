const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

exports.cleanBuildDirectory = () => {
  return {
    plugins: [new CleanWebpackPlugin()],
  };
};

exports.devServer = ({ host, port } = {}) => {
  return {
    devServer: {
      historyApiFallback: true,
      stats: 'errors-only',
      host,
      port,
      overlay: {
        errors: true,
        warnings: true,
      },
    },
  };
};

exports.loadCss = ({ include, exclude } = {}) => {
  return {
    module: {
      rules: [
        {
          test: /\.(css|scss)$/,
          include,
          exclude,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
  };
};

exports.extractCss = ({ include, exclude } = {}) => {
  return {
    module: {
      rules: [
        {
          test: /\.(css|scss)$/,
          include,
          exclude,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [new OptimizeCssAssetsPlugin({})],
    },
  };
};

exports.loadImages = ({ include, exclude, options } = {}) => {
  return {
    module: {
      rules: [
        {
          test: /\.(png|jpg|gif|svg)$/,
          include,
          exclude,
          use: [
            {
              loader: 'url-loader',
              options,
            },
          ],
        },
      ],
    },
  };
};

exports.loadFonts = ({ include, exclude, options } = {}) => {
  return {
    module: {
      rules: [
        {
          test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          include,
          exclude,
          use: {
            loader: 'url-loader',
            options,
          },
        },
      ],
    },
  };
};

exports.loadBabel = ({ include, exclude, options } = {}) => {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude,
          include,
          options,
        },
      ],
    },
  };
};

exports.minifyJavaScript = () => {
  return {
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
        }),
      ],
    },
  };
};

exports.lintJavaScript = (options) => {
  return {
    plugins: [new ESLintPlugin(options)],
  };
};
