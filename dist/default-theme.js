'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _merge2 = require('lodash/merge');

var _merge3 = _interopRequireDefault(_merge2);

exports.installLibraryMeta = installLibraryMeta;
exports.default = getDefaultTheme;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var baseTheme = {

  // the default styles for each component are in the component's `styles.js` file.
  // meta can have whatever you like.
  //
  meta: {
    colors: {
      // functional colors
      primary: '#00c653',

      // "what it says on the tin" named colors
      gray0: '#000',
      gray6: '#666f74',
      grayE: '#e4eaed'
    },

    // other shared constants
    hover: {
      transitionSpeed: '150ms'
    }
  }
};

var libraryMeta = {};

function installLibraryMeta(t) {
  libraryMeta = t;
}

function getDefaultTheme() {
  return (0, _merge3.default)({}, baseTheme, { meta: libraryMeta });
}