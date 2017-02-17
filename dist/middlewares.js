'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _merge2 = require('lodash/merge');

var _merge3 = _interopRequireDefault(_merge2);

exports.mapColorKeys = mapColorKeys;

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  this module doesn't provide generic tools for middleware management.
  it simply provides a single middleware tool for color mapping.
*/

function isKeyColorRelated(key) {

  // we need to trap both "color" and "Color". no need to lowercase;
  // instead we just look for "olor", which is a safe search
  //
  if (key.indexOf('olor') > -1) return true;

  // svg properties are special cases
  //
  return key === 'stroke' || key === 'fill';
}

// the heavy lifting is done here. this function doesn't know anything about
// colors; the callbacks make this very reusable
//
function styleDive(theme, styles, keyTester, valueMapper) {

  var clonedRoot = false,
      cloneNow = function cloneNow() {
    if (!clonedRoot) styles = (0, _merge3.default)({}, styles);
    clonedRoot = true;
  };

  Object.keys(styles).forEach(function (key) {

    if ((0, _utils.isObject)(styles[key])) {
      var _styleDive = styleDive(theme, styles[key], keyTester, valueMapper),
          clonedChild = _styleDive.cloned,
          childStyles = _styleDive.styles;

      if (clonedChild) cloneNow();
      styles[key] = childStyles;
    } else if (keyTester(key)) {

      var originalValue = styles[key],
          mappedValue = valueMapper(originalValue);

      if (mappedValue !== undefined) {
        cloneNow();
        styles[key] = mappedValue;
      }
    }
  });

  return {
    styles: styles,
    cloned: clonedRoot
  };
}

// a convenience function that does key-based lookups into the global meta.
// if you use a key like "primary" or "blueGray" in any color-related style
// attribute, it will be converted to a CSS string. otherwise, your input is
// returned untouched.
//
function mapColorKeys(theme, styles) {
  return styleDive(theme, styles, isKeyColorRelated, function (color) {
    return theme.meta.colors[color];
  }).styles;
}