import _ from 'lodash';
import {isObject} from './utils';

/*
  this module doesn't provide generic tools for middleware management.
  it simply provides a single middleware tool for color mapping.
*/

function isKeyColorRelated(key) {

  // we need to trap both "color" and "Color". no need to lowercase;
  // instead we just look for "olor", which is a safe search
  //
  if (key.indexOf('olor') > -1)
    return true;

  // svg properties are special cases
  //
  return key === 'stroke' || key === 'fill';
}

// the heavy lifting is done here. this function doesn't know anything about
// colors; the callbacks make this very reusable
//
function styleDive(theme, styles, keyTester, valueMapper) {

  let clonedRoot = false,
      cloneNow = () => {
        if (!clonedRoot)
          styles = _.merge({}, styles);
        clonedRoot = true;
      };

  Object.keys(styles).forEach(key => {

    if (isObject(styles[key])) {
      let {cloned: clonedChild, styles: childStyles} = styleDive(theme, styles[key], keyTester, valueMapper);
      if (clonedChild)
        cloneNow();
      styles[key] = childStyles;
    }
    else if (keyTester(key)) {

      const originalValue = styles[key],
            mappedValue   = valueMapper(originalValue);

      if (mappedValue !== undefined) {
        cloneNow();
        styles[key] = mappedValue;
      }
    }
  });

  return {
    styles,
    cloned: clonedRoot
  };
}

// a convenience function that does key-based lookups into the global meta.
// if you use a key like "primary" or "blueGray" in any color-related style
// attribute, it will be converted to a CSS string. otherwise, your input is
// returned untouched.
//
export function mapColorKeys(theme, styles) {
  return styleDive(
    theme,
    styles,
    isKeyColorRelated,
    color => theme.meta.colors[color]
  ).styles;
}
