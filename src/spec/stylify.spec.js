import tape from 'blue-tape';
import _ from 'lodash';
import React from 'react';
import Styletron from 'styletron-server';   // we use the server package here
import {mount, getAttributesAsObject} from './spec-helpers/helpers';
import stylify, {createStyledElementComponent} from '../stylify';

/*
  tests can peek into the style-maker, to track style properties (easy to assess correctness)
  instead of classes (impossible to interpret). this will only work for tracking the activities
  inside the makeStyles() function. to track external factors (like middleware & inlineStyles),
  we'll need to look at the final generated CSS code. see below.
*/
const styleWatcher = {
  _watcher: null,
  start(f) {
    this._watcher = f;
  },
  end() {
    this._watcher = null;
  },
  invoke(...args) {
    if (this._watcher)
      this._watcher(...args);
  }
};

//----- component under test
//

const ourPropTypes = {
  size:  React.PropTypes.oneOf(['small', 'large']),
  layer: React.PropTypes.number
};

const defaultStyles = {
  fontSize: '33px',
  zIndex:   '333',
  color:    null    // see below
};

function makeStyles({componentTheme, props}) {
  const {size, layer} = props,
        instanceStyles = {};

  if (size === 'small')
    instanceStyles.fontSize = '11px';
  else if (size === 'large')
    instanceStyles.fontSize = '55px';

  if (layer !== undefined)
    instanceStyles.zIndex = layer;

  const allStyles = _.merge({}, componentTheme, instanceStyles);
  styleWatcher.invoke(allStyles, componentTheme);
  return allStyles;
}

class TestComponent extends React.Component {
  static propTypes = ourPropTypes;
  render() {
    const {className, stripProps} = this.props,
          otherProps = stripProps(this.props, ['size', 'layer']);
    return <div className={className} {...otherProps}>Test</div>;
  }
}

// one test component with the higher-order component
//
const TestHoC = createStyledElementComponent(TestComponent, defaultStyles, makeStyles);

// and another component with the decorator
//
@stylify(defaultStyles, makeStyles)
class TestDecorator extends React.Component {
  static propTypes = ourPropTypes;
  render() {
    const {className, stripProps} = this.props,
          otherProps = stripProps(this.props, ['size', 'layer']);
    return <div className={className} {...otherProps}>Test</div>;
  }
}

//------ end test setup

// we run the entire test suite twice; once for HoC, once for the decorator
//
function runTestSuite(ComponentUnderTest, componentType) {

  // the theme is organized by component name
  const componentName = (componentType === 'hoc' ? 'TestComponent' : 'TestDecorator');

  tape(t => {

    t.test(`stylify passes through custom attributes (type: ${componentType})`, t => {
      let c = mount(<ComponentUnderTest id="test-id" />).getDOMNode();
      t.plan(1);
      t.equal(c.getAttribute('id'), 'test-id', 'stylify should pass through id attribute');
    });

    t.test(`stylify processes default styles without a theme (type: ${componentType})`, t => {
      let fontSize = null;

      styleWatcher.start(allStyles => {fontSize = allStyles.fontSize;});
      mount(<ComponentUnderTest />);
      styleWatcher.end();

      t.plan(1);
      t.equal(fontSize, '33px', 'stylify should pass default attributes to the component');
    });

    t.test(`stylify adapts to props correctly (type: ${componentType})`, t => {
      let fontSize = null;

      styleWatcher.start(allStyles => {fontSize = allStyles.fontSize;});
      mount(<ComponentUnderTest size='small' />);

      t.plan(2);
      t.equal(fontSize, '11px', 'makeStyles function should adapt styles to props');

      mount(<ComponentUnderTest size='large' />);
      styleWatcher.end();

      t.equal(fontSize, '55px', 'makeStyles function should adapt styles to props');
    });

    t.test(`stylify lets the user override default styles in the theme (type: ${componentType})`, t => {
      let fontSize = null,
          zIndex   = null,
          color    = null,
          theme = {
            [componentName]: {
              fontSize: '99px',
              zIndex:   '999',
              color:    'red'     // a new property, not in the component
            }
          };

      styleWatcher.start(allStyles => {
        fontSize = allStyles.fontSize;
        zIndex   = allStyles.zIndex;
        color    = allStyles.color;
      });
      mount(<ComponentUnderTest />, theme);
      styleWatcher.end();

      t.plan(3);
      t.equal(fontSize, '99px', 'stylify should use style values from the theme when applicable');
      t.equal(zIndex,   '999',  'stylify should use style values from the theme when applicable');
      t.equal(color,    'red',  'stylify should use style values from the theme when applicable');
    });

    t.test(`stylify lets the user override default styles per component with inlineStyles (type: ${componentType})`, t => {
      let localStyletron = new Styletron(),
          customStyles = {
            fontSize: '88px',
            zIndex:   '888',
            color:    'lime'
          };

      mount(<ComponentUnderTest inlineStyles={customStyles} />, null, {styletron: localStyletron});

      const styles        = localStyletron.getCss(),
            shouldFind    = ['color:lime', 'font-size:88px', 'z-index:888'],
            shouldNotFind = ['font-size:3px', 'z-index:333'];

      t.plan(shouldFind.length + shouldNotFind.length);
      shouldFind.forEach(oneNeedle => {
        t.equal(styles.indexOf(oneNeedle) >= 0, true, 'inlineStyles should be applied');
      });
      shouldNotFind.forEach(oneAbsentNeedle => {
        t.equal(styles.indexOf(oneAbsentNeedle) >= 0, false, 'inlineStyles should override base styles');
      });
    });

    t.test(`stylify applies middleware correctly (type: ${componentType})`, t => {
      let localStyletron = new Styletron(),
          theme = {
            meta: {
              colors: {
                // custom named colors
                'crunchy':  '#654321',
                'kool-aid': 'rgba(44,33,22,0.11)'
              }
            },
            [componentName]: {
              borderColor:     'crunchy',
              backgroundColor: 'kool-aid'
            }
          };

      mount(<ComponentUnderTest />, theme, {useMiddleware: true, styletron: localStyletron});

      const styles     = localStyletron.getCss(),
            shouldFind = ['border-color:#654321', 'background-color:rgba(44,33,22,0.11)'];

      t.plan(shouldFind.length);
      shouldFind.forEach(oneNeedle => {
        t.equal(styles.indexOf(oneNeedle) >= 0, true, 'middleware should be applied');
      });
    });

    t.test(`stripProps cleans attribute list properly (type: ${componentType})`, t => {
      let component = (
            <ComponentUnderTest
              id    = "spillover"
              size  = "small"
              layer = {101}
              data-philosophy = "nihilism"
            />
          ),
          node = mount(component).getDOMNode(),
          attrs = getAttributesAsObject(node),
          attrKeys = Object.keys(attrs),
          nonDataKeys = attrKeys.filter(key => !/^data-/.test(key));

      t.plan(6);
      t.equal(nonDataKeys.length, 2, 'should have exactly two attributes that are not data- attributes');
      t.equal(nonDataKeys.indexOf('class') >= 0, true, 'should have a class attribute (applied by styletron)');
      t.equal(nonDataKeys.indexOf('id') >= 0, true, 'should have an ID attribute');

      t.equal(attrs.id, 'spillover', 'should have the given ID');
      t.equal(attrs['data-philosophy'], 'nihilism', 'should have the given data attribute');

      t.equal(attrs.class.length > 0, true, 'should have some classes applied');
    });

    t.end();
  });
}

runTestSuite(TestDecorator, 'decorator');
runTestSuite(TestHoC, 'hoc');
