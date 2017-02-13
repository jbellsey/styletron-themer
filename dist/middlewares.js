'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _merge2 = require('lodash/merge');

var _merge3 = _interopRequireDefault(_merge2);

exports.mapColorKeys = mapColorKeys;

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isKeyColorRelated(key) {

  // we need to trap both "color" and "Color". no need to lowercase;
  // instead we just look for "olor", which is a safe search
  //
  if (key.indexOf('olor') > -1) return true;

  // svg properties are special cases
  //
  return key === 'stroke' || key === 'fill';
}

// a convenience function that does key-based lookups into the global meta.
// if you use a key like "primary" or "blueGray" in any color-related style
// attribute, it will be converted to a CSS string. otherwise, your input is
// returned untouched.
//
function mapColorKeys(theme, styles) {

  var cloned = false;

  Object.keys(styles).forEach(function (key) {

    if ((0, _utils.isObject)(styles[key])) {
      styles[key] = mapColorKeys(theme, styles[key]);
    } else if (isKeyColorRelated(key)) {

      var col = styles[key],
          mappedColor = theme.meta.colors[col];

      if (mappedColor !== undefined) {
        if (!cloned) {
          styles = (0, _merge3.default)({}, styles);
          cloned = true;
        }
        styles[key] = mappedColor;
      }
    }
  });

  return styles;
}