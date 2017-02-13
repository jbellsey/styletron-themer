
import _ from 'lodash';
import {isObject} from './utils';

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

// a convenience function that does key-based lookups into the global meta.
// if you use a key like "primary" or "blueGray" in any color-related style
// attribute, it will be converted to a CSS string. otherwise, your input is
// returned untouched.
//
export function mapColorKeys(theme, styles) {

  let cloned = false;

  Object.keys(styles).forEach(key => {

    if (isObject(styles[key])) {
      styles[key] = mapColorKeys(theme, styles[key]);
    }
    else if (isKeyColorRelated(key)) {

      const col         = styles[key],
            mappedColor = theme.meta.colors[col];

      if (mappedColor !== undefined) {
        if (!cloned) {
          styles = _.merge({}, styles);
          cloned = true;
        }
        styles[key] = mappedColor;
      }
    }
  });

  return styles;
}
