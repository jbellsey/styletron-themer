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

var fullTextSearch = ['background', 'border', 'outline'],
    svgAttributes = ['stroke', 'fill'];

function isKeyColorRelated(key) {

  // we need to trap both "color" and "Color" in the attribute name. so we just
  // look for "olor", which is a safe search (i.e., there are no false positives)
  //
  if (key.indexOf('olor') > -1) return true;

  // a few custom attributes that don't have "color" in their names
  //
  return svgAttributes.concat(fullTextSearch).indexOf(key) !== -1;
}

function valueMapper(theme, key, value) {
  // if the value is a simple match for an existing color, use it
  var outputColor = theme.meta.colors[value];
  if (outputColor) return outputColor;

  // for shorthand properties ("background"), we have to do a full text search & replace
  if (fullTextSearch.indexOf(key) > -1) {
    var anyChanges = false;
    outputColor = value;

    Object.keys(theme.meta.colors).forEach(function (oneColor) {

      var re = new RegExp('\\b' + oneColor + '\\b');

      outputColor = outputColor.replace(re, function () {
        anyChanges = true;
        return theme.meta.colors[oneColor];
      });
    });
    if (anyChanges) return outputColor;
  }
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
          mappedValue = valueMapper(key, originalValue);

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
  return styleDive(theme, styles, isKeyColorRelated, valueMapper.bind(null, theme)).styles;
}