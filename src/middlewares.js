import assignDeep from 'assign-deep';
import {isObject} from './utils';

/*
  this module doesn't provide generic tools for middleware management.
  it simply provides a single middleware tool for color mapping.
*/

const fullTextSearch = ['background', 'border', 'outline'],
      contains       = ['border', 'background', 'outline', 'hadow'],
      svgAttributes  = ['stroke', 'fill'];

function isKeyColorRelated(key) {

  // we need to trap both "color" and "Color" in the attribute name. so we just
  // look for "olor", which is a safe search (i.e., there are no false positives)
  //
  if (key.indexOf('olor') > -1)
    return true;

  // some key names need to checked more thoroughly: "borderColorLeft", "boxShadow", etc
  if (contains.some(searchFor => key.indexOf(searchFor) !== -1))
    return true;

  // a few custom attributes that don't have "color" in their names
  //
  return svgAttributes.concat(fullTextSearch).indexOf(key) !== -1;
}

// mapping function should return undefined if no change
//
function colorValueMapper(theme, key, value) {
  const colorMap = theme.meta.colors;
  if (!colorMap || !value || typeof value !== 'string')
    return;

  // if the value is a simple match for an existing color, use it
  let outputColor = colorMap[value];
  if (outputColor)
    return outputColor;

  // otherwise, we have to do a full text search & replace. before we
  // do the expensive searches, make sure that the value has multiple words!
  //
  if (value.indexOf(' ') !== -1) {
    let anyChanges = false;
    outputColor = value;

    Object.keys(colorMap).forEach(oneColor => {

      const re = new RegExp(`\\b${oneColor}\\b`);

      outputColor = outputColor.replace(re, () => {
        anyChanges = true;
        return colorMap[oneColor];
      });
    });
    if (anyChanges)
      return outputColor;
  }
}

// the heavy lifting is done here. this function doesn't know anything about
// colors; the callbacks make this very reusable
// TODO: expose this
//
function styleDive(theme, styles, keyTester, valueMapper) {

  let clonedRoot = false,
      cloneNow = () => {
        if (!clonedRoot)
          styles = assignDeep({}, styles);
        clonedRoot = true;
      };

  Object.keys(styles).forEach(key => {

    if (key === 'meta')
      return;

    if (isObject(styles[key])) {
      let {cloned: clonedChild, styles: childStyles} = styleDive(theme, styles[key], keyTester, valueMapper);
      if (clonedChild)
        cloneNow();
      styles[key] = childStyles;
    }
    else if (keyTester(key)) {

      const originalValue = styles[key],
            mappedValue   = valueMapper(key, originalValue);

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
    colorValueMapper.bind(null, theme)
  ).styles;
}
