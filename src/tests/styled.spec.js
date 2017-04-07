import tape from 'blue-tape';
import _ from 'lodash';
import React from 'react';
import Styletron from 'styletron-server';   // we use the server package here
import {mount} from './spec-helpers/helpers';
import Styled from '../styled';
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

const staticStyle = {
  fontSize: '33px',
  zIndex:   '333',
  color:    null    // see below
};

function dynamicStyle({componentTheme, props}) {
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

class TestFunctionComponent extends React.Component {
  static propTypes = ourPropTypes;
  render() {
    return (
      <Styled
        name         = {this.constructor.name}
        staticStyle  = {staticStyle}
        dynamicStyle = {dynamicStyle}
        {...this.props}
      >
        {className => <div className={className} {...this.props}>Test</div>}
      </Styled>
    );
  }
}

// this component uses the render function, but does not tell us its name.
// that's fine, but it prevents the component from being registered for theming
//
class TestUnnamedFunctionComponent extends React.Component {
  static propTypes = ourPropTypes;
  render() {
    return (
      <Styled
        staticStyle  = {staticStyle}
        dynamicStyle = {dynamicStyle}
        {...this.props}
      >
        {({className}) => <div className={className} {...this.props}>Test</div>}
      </Styled>
    );
  }
}



//------ end test setup

const testSuites = {
  func: {
    Component: TestFunctionComponent,
    name:      'TestFunctionComponent'
  },
  unnamed: {
    Component: TestUnnamedFunctionComponent
  }
};

// we run the entire test suite multiple times
//
function runTestSuite(componentType) {

  const {
    Component: ComponentUnderTest,
    name:      componentName
  } = testSuites[componentType];

  tape(t => {

    t.test(`Styled component passes through custom attributes (type: ${componentType})`, t => {
      let c = mount(<ComponentUnderTest id="test-id" data-peanut-butter="crunchy" />).getDOMNode();
      t.plan(2);
      t.equal(c.getAttribute('id'), 'test-id', 'Styled component should pass through id attribute');
      t.equal(c.getAttribute('data-peanut-butter'), 'crunchy', 'Styled component should pass through data attributes');
    });

    t.test(`Styled component processes default styles without a theme (type: ${componentType})`, t => {
      let fontSize = null;

      styleWatcher.start(allStyles => {fontSize = allStyles.fontSize;});
      mount(<ComponentUnderTest />);
      styleWatcher.end();

      t.plan(1);
      t.equal(fontSize, '33px', 'Styled component should pass default attributes to the component');
    });

    t.test(`Styled component adapts to props correctly (type: ${componentType})`, t => {
      let fontSize = null;

      t.plan(2);
      styleWatcher.start(allStyles => {fontSize = allStyles.fontSize;});

      mount(<ComponentUnderTest size='small' />);
      t.equal(fontSize, '11px', 'makeStyles function should adapt styles to props');

      mount(<ComponentUnderTest size='large' />);
      t.equal(fontSize, '55px', 'makeStyles function should adapt styles to props');

      styleWatcher.end();
    });

    // these tests do not apply to unnamed components
    if (componentName) {
      t.test(`Styled component lets the user override default styles in the theme (type: ${componentType})`, t => {
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
        t.equal(fontSize, '99px', 'Styled component should use style values from the theme when applicable');
        t.equal(zIndex,   '999',  'Styled component should use style values from the theme when applicable');
        t.equal(color,    'red',  'Styled component should use style values from the theme when applicable');
      });

      t.test(`Styled component applies middleware correctly (type: ${componentType})`, t => {
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

      t.test(`Styled component lets the library install its own meta (type: ${componentType})`, t => {
        let localStyletron = new Styletron(),
            libraryMeta = {     // library meta overrides the default theme
              colors: {
                chilly: 'library-chilly',
                sweaty: 'library-sweaty'
              }
            },
            theme = {           // the user theme overrides the library meta when there are collisions
              meta: {
                colors: {
                  chilly: 'usertheme-chilly'
                }
              },
              [componentName]: {  // default theme
                borderColor:     'chilly',
                backgroundColor: 'sweaty'
              }
            };

        installLibraryMeta(libraryMeta);
        mount(<ComponentUnderTest />, theme, {useMiddleware: true, styletron: localStyletron});
        installLibraryMeta({});   // (there is no automatic cleanup for this feature)

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
    }

    t.test(`Styled component lets the user override default styles per component with inline styles (type: ${componentType})`, t => {
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

    t.end();
  });
}

Object.keys(testSuites).forEach(key => runTestSuite(key));