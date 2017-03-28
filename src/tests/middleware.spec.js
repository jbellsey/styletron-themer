import tape from 'blue-tape';
import {mapColorKeys} from '../middlewares';

const theme = {
  meta: {
    colors: {
      prawn:  '111',
      basil:  '222',
      tofu:   '333',
      papaya: '444'
    }
  }
};

tape('color mapper maps keys correctly', t => {

  const inputStyles = {
          color:           'prawn',
          backgroundColor: 'noop',
          borderColor:     'tofu transparent transparent',
          background:      '30 basil things',
          outline:         '3px dotted papaya',
          stroke:          'papaya',
          fontColor:       'tofu'
        },
        expectedStyles = {
          color:           '111',
          backgroundColor: 'noop',
          borderColor:     '333 transparent transparent',
          background:      '30 222 things',
          outline:         '3px dotted 444',
          stroke:          '444',
          fontColor:       '333'
        },
        actualStyles = mapColorKeys(theme, inputStyles);

  t.plan(1);
  t.equal(JSON.stringify(actualStyles), JSON.stringify(expectedStyles), 'output should map (or not) correctly');
});

tape('color mapper maps sub-keys correctly', t => {

  const inputStyles = {
          color:    'prawn',
          ':hover': {
            fontColor: 'tofu',
            neverHappenDeeperKey: {
              backgroundColor: 'basil'
            }
          }
        },
        expectedStyles = {
          color:    '111',
          ':hover': {
            fontColor: '333',
            neverHappenDeeperKey: {
              backgroundColor: '222'
            }
          }
        },
        actualStyles = mapColorKeys(theme, inputStyles);

  t.plan(1);
  t.equal(JSON.stringify(actualStyles), JSON.stringify(expectedStyles), 'should map inside deep nests');
});

tape('color mapper is pure: if no changes, no cloning', t => {

  const inputStyles = {
          color:           '444',
          backgroundColor: '333',
          margin:          '222',
          fontColor:       '111'
        },
        actualStyles = mapColorKeys(theme, inputStyles);

  t.plan(1);
  t.equal(actualStyles, inputStyles, 'the input object should not be copied or modified');
});

tape('color mapper is pure: if any changes, we get a different object', t => {

  const inputStyles = {
          color:           'prawn',
          backgroundColor: 'noop',
          background:      '30 222 things',
          fontColor:       'tofu'
        },
        actualStyles = mapColorKeys(theme, inputStyles);

  t.plan(1);
  t.notEqual(actualStyles, inputStyles, 'the input object should be copied when colors are mapped');
});

tape('color mapper is pure: if any changes in nested objects, we get a different object', t => {

  const inputStyles = {
          color:    '111',
          ':hover': {
            fontColor: '222',
            deeperKey: {
              backgroundColor: 'basil'
            }
          }
        },
        actualStyles = mapColorKeys(theme, inputStyles);

  t.plan(1);
  t.notEqual(actualStyles, inputStyles, 'the input object should be copied when colors are mapped in nested objects');
});
