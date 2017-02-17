import tape from 'blue-tape';
import _ from 'lodash';
import React from 'react';
import Styletron from 'styletron-server';   // we use the server package here
import {mount, getAttributesAsObject} from './spec-helpers/helpers';
import stylify, {createStyledComponent} from '../stylify';
import {installLibraryMeta} from '../default-theme';

/*
  tests can peek into the style-maker, to track style properties (easy to assess correctness)
  instead of classes (impossible to interpret). this will only work for tracking the activities
  inside the makeStyles() function. to track external factors (like middleware & inline styles),
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
const TestHoC = createStyledComponent(TestComponent, defaultStyles, makeStyles);

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

// one more as stateless functional component
//
function Stateless({className, stripProps}) {
  const otherProps = stripProps(this.props, ['size', 'layer']);
  return <div className={className} {...otherProps}>Test</div>;
}
const TestStateless = stylify(defaultStyles, makeStyles)(Stateless);

//------ end test setup

const testSuites = {
  hoc: {
    Component: TestHoC,
    name:      'TestComponent'
  },
  decorator: {
    Component: TestDecorator,
    name:      'TestDecorator'
  },
  stateless: {
    Component: TestStateless,
    name:      'Stateless'
  }
};

// we run the entire test suite multiple times
//
function runTestSuite(componentType) {

  const {Component: ComponentUnderTest, name: componentName} = testSuites[componentType];

  tape(t => {

    t.test(`stylify passes through custom attributes (type: ${componentType})`, t => {
      let c = mount(<ComponentUnderTest id="test-id" data-peanut-butter="crunchy" />).getDOMNode();
      t.plan(2);
      t.equal(c.getAttribute('id'), 'test-id', 'stylify should pass through id attribute');
      t.equal(c.getAttribute('data-peanut-butter'), 'crunchy', 'stylify should pass through data attributes');
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

      t.plan(2);
      styleWatcher.start(allStyles => {fontSize = allStyles.fontSize;});

      mount(<ComponentUnderTest size='small' />);
      t.equal(fontSize, '11px', 'makeStyles function should adapt styles to props');

      mount(<ComponentUnderTest size='large' />);
      t.equal(fontSize, '55px', 'makeStyles function should adapt styles to props');

      styleWatcher.end();
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

    t.test(`stylify lets the user override default styles per component with inline styles (type: ${componentType})`, t => {
      let localStyletron = new Styletron(),
          customStyles = {
            fontSize: '88px',
            zIndex:   '888',
            color:    'lime'
          };

      mount(<ComponentUnderTest style={customStyles} />, null, {styletron: localStyletron});

      const styles        = localStyletron.getCss(),
            shouldFind    = ['color:lime', 'font-size:88px', 'z-index:888'],
            shouldNotFind = ['font-size:33px', 'z-index:333'];

      t.plan(shouldFind.length + shouldNotFind.length);
      shouldFind.forEach(oneNeedle => {
        t.equal(styles.indexOf(oneNeedle) >= 0, true, 'inline styles should be applied');
      });
      shouldNotFind.forEach(oneAbsentNeedle => {
        t.equal(styles.indexOf(oneAbsentNeedle) >= 0, false, 'inline styles should override base styles');
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

    t.test(`stylify lets the library install its own meta (type: ${componentType})`, t => {
      let localStyletron = new Styletron(),
          libraryMeta = {     // library meta should override the default theme
            colors: {
              // fake colors are easier to read
              chilly: 'library-chilly',
              sweaty: 'library-sweaty'
            }
          },
          theme = {           // the user theme should override the library meta
            meta: {
              colors: {
                chilly: 'usertheme-chilly'
              }
            },
            [componentName]: {
              borderColor:     'chilly',
              backgroundColor: 'sweaty'
            }
          };

      installLibraryMeta(libraryMeta);
      mount(<ComponentUnderTest />, theme, {useMiddleware: true, styletron: localStyletron});
      installLibraryMeta({});   // clean up (there is no automatic cleanup for this feature)

      const styles        = localStyletron.getCss(),
            shouldFind    = ['border-color:usertheme-chilly', 'background-color:library-sweaty'],
            shouldNotFind = ['border-color:library-chilly', 'background-color:usertheme-sweaty'];

      t.plan(shouldFind.length + shouldNotFind.length);
      shouldFind.forEach(oneNeedle => {
        t.equal(styles.indexOf(oneNeedle) >= 0, true, 'library meta should be applied before the user theme');
      });
      shouldNotFind.forEach(oneAbsentNeedle => {
        t.equal(styles.indexOf(oneAbsentNeedle) >= 0, false, 'user theme should override library meta');
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
      t.equal(nonDataKeys.indexOf('id') >= 0, true, 'should have an ID attribute (entered manually)');

      t.equal(attrs.id, 'spillover', 'should have the given ID');
      t.equal(attrs['data-philosophy'], 'nihilism', 'should have the given data attribute');

      t.equal(attrs.class.length > 0, true, 'should have some classes applied');
    });

    t.end();
  });
}

Object.keys(testSuites).forEach(key => runTestSuite(key));
