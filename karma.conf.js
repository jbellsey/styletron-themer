let path      = require('path'),
    testEnv   = process.env.TEST_ENV,
    webpack   = require('webpack'),
    isCI      = (testEnv === 'ci'),
    testFiles = './test-files.js';

module.exports = function(config) {
  config.set({
    basePath:   '',
    frameworks: ['tap'],
    reporters:  ['tap-pretty'],
    tapReporter: {
      prettify: require('faucet'),
      separator: '-----'},
    browsers:   ['PhantomJS'],
    client:     {captureConsole: false},    // suppress phantomjs log messages
    colors:     true,
    files:      [testFiles],
    preprocessors: {
      [testFiles]: ['webpack']
    },
    singleRun: isCI,
    webpack: {
      devtool:   'inline-source-map',
      plugins:   [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('TEST')
          }
        })
      ],
      resolve:   {
        extensions: ['.js']
      },
      entry: './src',
      module:    {
        loaders: [{
          test:    /\.jsx?$/,
          exclude: path.resolve('node_modules/'),
          loader:  'babel-loader'
        }, {
          test:   /\.json$/,
          loader: 'json-loader'
        }]
      },
      externals: {
        'cheerio':                        'window',
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext':         true
      },
      node: {fs: 'empty'}
    },
    webpackServer: {
      noInfo: true
    }
  });
};
