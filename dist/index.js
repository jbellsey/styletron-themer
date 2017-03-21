'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installLibraryMeta = exports.ThemeProvider = exports.createStyledComponent = exports.stylify = exports.createStylableComponent = exports.stylable = exports.Styled = exports.Stylified = undefined;

var _stylable2 = require('./stylable');

Object.defineProperty(exports, 'createStylableComponent', {
  enumerable: true,
  get: function get() {
    return _stylable2.createStylableComponent;
  }
});

var _stylify2 = require('./stylify');

Object.defineProperty(exports, 'createStyledComponent', {
  enumerable: true,
  get: function get() {
    return _stylify2.createStyledComponent;
  }
});

var _defaultTheme = require('./default-theme');

Object.defineProperty(exports, 'installLibraryMeta', {
  enumerable: true,
  get: function get() {
    return _defaultTheme.installLibraryMeta;
  }
});

var _stylifyFunction = require('./stylify-function');

var _stylifyFunction2 = _interopRequireDefault(_stylifyFunction);

var _styled = require('./styled');

var _styled2 = _interopRequireDefault(_styled);

var _stylable3 = _interopRequireDefault(_stylable2);

var _stylify3 = _interopRequireDefault(_stylify2);

var _themeProvider = require('./theme-provider');

var _themeProvider2 = _interopRequireDefault(_themeProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Stylified = _stylifyFunction2.default; // deprecated

exports.Styled = _styled2.default;
exports.stylable = _stylable3.default;
exports.stylify = _stylify3.default;
exports.ThemeProvider = _themeProvider2.default;