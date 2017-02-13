let path      = require('path'),
    testEnv   = process.env.TEST_ENV,
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
      plugins:   [],
      resolve:   {
        extensions: ['.js'],
        alias: {
          sinon: 'sinon/pkg/sinon.js'   // see below
        }
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
        }, {
          // sinon magic from here: https://github.com/webpack/webpack/issues/304#issuecomment-172723408
          // otherwise it breaks webpack requires
          //
          test:   /sinon\/pkg\/sinon\.js/,
          loader: 'imports?define=>false,require=>false'
        }]
      },
      externals: {
        'cheerio':                        'window',
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext':         true,
        'react/addons':                   true
      },
      node: {fs: 'empty'},
      watch: false // !isCI
    },
    webpackServer: {
      noInfo: true
    }
  });
};
