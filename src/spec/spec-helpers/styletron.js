import Styletron from 'styletron-server';
import {injectStyle} from 'styletron-utils';

export function countStyletronClasses(styleObj) {
  const styletron = new Styletron(),
        classString = injectStyle(styletron, styleObj),
        classes = classString.split(' ').filter(cls => cls.length < 3);

  return classes.length;
}

// attribute name must be CSS, not styletron (i.e., "font-size", not "fontSize")
//
export function styletronHasRule(styleObj, attribute, value) {
  const styletron = new Styletron();
  injectStyle(styletron, styleObj);

  return styletron.getCss().indexOf(`${attribute}:${value}`) >= 0;
}
