import {Server as StyletronServer} from 'styletron-engine-atomic';

export function countStyletronClasses(styleObj) {
  const styletron = new StyletronServer(),
        classString = styletron.renderStyle(styleObj),
        classes = classString.split(' ').filter(cls => cls.length < 3);

  return classes.length;
}
