import tape from 'blue-tape';
import assignDeep from 'assign-deep';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Server as StyletronServer} from 'styletron-engine-atomic';
import {mount} from './spec-helpers/helpers';
import Styled from '../styled';
import {installLibraryMeta} from '../default-theme';

/*
  tests can peek into the style-maker, to track style properties (easy to assess correctness)
  instead of classes (impossible to interpret). this will only work for tracking the activities
  inside the makeStyles() function. to track external factors (like middleware & inline styles),
  we'll need to look at the final generated CSS code. see below.
*/
const anythingWatcher = {
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
  size:  PropTypes.oneOf(['small', 'large']),
  layer: PropTypes.number
};

const staticStyle = {
  fontSize:   '33px',
  zIndex:     '333',
  fontWeight: '700',
  color:      null,    // see below
  meta: {
    extras: {
      paddingTop: '99px'
    }
  }
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

  const allStyles = assignDeep({}, componentTheme, componentTheme.meta.extras, instanceStyles);
  anythingWatcher.invoke(allStyles, componentTheme);
  return allStyles;
}

function dynamicStyleWithNoStatic({props}) {
  const {size, layer} = props,
        instanceStyles = {};

  if (size === 'small')
    instanceStyles.fontSize = '11px';
  else if (size === 'large')
    instanceStyles.fontSize = '55px';

  if (layer !== undefined)
    instanceStyles.zIndex = layer;

  const allStyles = assignDeep({}, staticStyle, instanceStyles);
  anythingWatcher.invoke(allStyles, staticStyle);
  return allStyles;
}

class TestFunctionComponent extends Component {
  static propTypes = ourPropTypes;
  render() {
    return (
      <Styled
        themeName    = {this.constructor.name}
        staticStyle  = {staticStyle}
        dynamicStyle = {dynamicStyle}
        {...this.props}
      >
        {(className, props) => <div className={className} {...props}>Test</div>}
      </Styled>
    );
  }
}

// this component uses the render function, but does not tell us its name.
// that's fine, but it prevents the component from being registered for theming
//
class TestUnnamedFunctionComponent extends Component {
  static propTypes = ourPropTypes;
  render() {
    return (
      <Styled
        staticStyle  = {staticStyle}
        dynamicStyle = {dynamicStyle}
        {...this.props}
      >
        {(className, props) => <div className={className} {...props}>Test</div>}
      </Styled>
    );
  }
}

// what happens if the user doesn't provide a static style object? the component is
// not themable, but it should work properly
//
class TestDynamicStylesOnly extends Component {
  static propTypes = ourPropTypes;
  render() {
    return (
      <Styled
        dynamicStyle = {dynamicStyleWithNoStatic}
        {...this.props}
      >
        {(className, props) => <div className={className} {...props}>Test</div>}
      </Styled>
    );
  }
}

class TestStaticStylesOnly extends Component {
  static propTypes = ourPropTypes;
  render() {
    return (
      <Styled
        staticStyle = {staticStyle}
        {...this.props}
      >
        {(className, props) => <div className={className} {...props}>Test</div>}
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
  },
  dynamicOnly: {
    Component: TestDynamicStylesOnly,
    dynamicOnly: true
  },
  staticOnly: {
    Component: TestStaticStylesOnly,
    staticOnly: true
  }
};

// we run the entire basic test suite multiple times
//
function runTestSuite(componentType) {

  tape(t => {

    const {
            Component: ComponentUnderTest,
            name:      componentName,
            staticOnly  = true,
            dynamicOnly = true
          } = testSuites[componentType];

    const maybeTest = (condition, ...testArgs) => condition && t.test(...testArgs);

    //--------------

    t.test(`Styled component passes through custom attributes (type: ${componentType})`, t => {
      return mount(<ComponentUnderTest id="test-id" data-peanut-butter="crunchy" />)
        .then(comp => {
          let c = comp.getDOMNode();
          t.equal(c.getAttribute('id'), 'test-id', 'Styled component should pass through id attribute');
          t.equal(c.getAttribute('data-peanut-butter'), 'crunchy', 'Styled component should pass through data attributes');
        });
    });

    t.test(`Styled component processes default styles without a theme (type: ${componentType})`, t => {
      let localStyletron = new StyletronServer();

      return mount(<ComponentUnderTest />, null, {styletron: localStyletron})
        .then(() => {
          const styles     = localStyletron.getCss(),
                shouldFind = ['font-size:33px'];

          shouldFind.forEach(oneNeedle => {
            t.equal(styles.indexOf(oneNeedle) >= 0, true, 'default component styles should be applied');
          });
        });
    });

    maybeTest(!staticOnly, `Styled component adapts to props correctly (type: ${componentType})`, t => {
      let fontSize = null;

      anythingWatcher.start(allStyles => {fontSize = allStyles.fontSize;});

      return mount(<ComponentUnderTest size='small' />)
        .then(() => {
          t.equal(fontSize, '11px', 'makeStyles function should adapt styles to props');
          return mount(<ComponentUnderTest size='large' />);
        })
        .then(() => {
          t.equal(fontSize, '55px', 'makeStyles function should adapt styles to props');
          anythingWatcher.end();
        });
    });

    maybeTest(componentName, `Styled component lets the user override default styles in the theme (type: ${componentType})`, t => {
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

      anythingWatcher.start(allStyles => {
        fontSize = allStyles.fontSize;
        zIndex   = allStyles.zIndex;
        color    = allStyles.color;
      });
      return mount(<ComponentUnderTest />, theme)
        .then(() => {
          anythingWatcher.end();

          t.equal(fontSize, '99px', 'Styled component should use style values from the theme when applicable');
          t.equal(zIndex,   '999',  'Styled component should use style values from the theme when applicable');
          t.equal(color,    'red',  'Styled component should use style values from the theme when applicable');
        });
    });

    maybeTest(!dynamicOnly, `Styled component lets the user override default styles in a LOCAL theme (type: ${componentType})`, t => {
      let localStyletron = new StyletronServer(),
          theme = {
            fontSize: '811px',
            zIndex:   '118',
            color:    'lime'     // a new property, not in the component
          };

      return mount(<ComponentUnderTest localTheme={theme} />, null, {styletron: localStyletron})
        .then(() => {
          const styles     = localStyletron.getCss(),
                shouldFind = ['font-size:811px', 'z-index:118', 'color:lime'];

          shouldFind.forEach(oneNeedle => {
            if (styles.indexOf(oneNeedle) === -1)
              console.log('NOT found:', oneNeedle, JSON.stringify(styles, null, 2))
            t.equal(styles.indexOf(oneNeedle) >= 0, true, 'Styled component should use style values from the local theme when applicable');
          });
        });
    });

    maybeTest(componentName, `Styled component applies middleware correctly (type: ${componentType})`, t => {
      let localStyletron = new StyletronServer(),
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

      return mount(<ComponentUnderTest />, theme, {styletron: localStyletron})
        .then(() => {
          const styles     = localStyletron.getCss(),
                shouldFind = ['border-color:#654321', 'background-color:rgba(44,33,22,0.11)'];

          shouldFind.forEach(oneNeedle => {
            t.equal(styles.indexOf(oneNeedle) >= 0, true, 'middleware should be applied');
          });
        });
    });

    maybeTest(componentName, `Styled component lets the library install its own meta (type: ${componentType})`, t => {
      let localStyletron = new StyletronServer(),
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
      return mount(<ComponentUnderTest />, theme, {styletron: localStyletron})
        .then(() => {
          installLibraryMeta({});   // (there is no automatic cleanup for this feature)
          const styles        = localStyletron.getCss(),
                shouldFind    = ['border-color:usertheme-chilly', 'background-color:library-sweaty'],
                shouldNotFind = ['border-color:library-chilly', 'background-color:usertheme-sweaty'];

          shouldFind.forEach(oneNeedle => {
            t.equal(styles.indexOf(oneNeedle) >= 0, true, 'library meta should be applied before the user theme');
          });
          shouldNotFind.forEach(oneAbsentNeedle => {
            t.equal(styles.indexOf(oneAbsentNeedle) >= 0, false, 'user theme should override library meta');
          });
        });
    });

    t.test(`Styled component lets the user override default styles per component with inline styles (type: ${componentType})`, t => {
      let localStyletron = new StyletronServer(),
          customStyles = {
            fontSize: '88px',
            zIndex:   '888',
            color:    'lime'
          };

      return mount(<ComponentUnderTest style={customStyles} />, null, {styletron: localStyletron})
        .then(() => {
          const styles        = localStyletron.getCss(),
                shouldFind    = ['color:lime', 'font-size:88px', 'z-index:888', 'font-weight:700'],
                shouldNotFind = ['font-size:33px', 'z-index:333'];

          shouldFind.forEach(oneNeedle => {
            t.equal(styles.indexOf(oneNeedle) >= 0, true, 'inline styles should be applied');
          });
          shouldNotFind.forEach(oneAbsentNeedle => {
            t.equal(styles.indexOf(oneAbsentNeedle) >= 0, false, 'inline styles should override base styles');
          });
        });
    });

    t.end();
  });
}

Object.keys(testSuites).forEach(key => runTestSuite(key));


//--- other tests

class TestRenderCallbackProps extends Component {
  static propTypes = ourPropTypes;
  render() {
    return (
      <Styled
        themeName    = 'TestRenderCallbackProps'
        staticStyle  = {staticStyle}
        dynamicStyle = {dynamicStyle}
        {...this.props}
      >
        {(className, props, paramBlock) => {
          anythingWatcher.invoke(props, paramBlock);
          return <div className={className} {...this.props}>Test</div>;
        }}
      </Styled>
    );
  }
}

tape.test('Styled component passes all props to render callback', t => {

  let customProps = {
        id: '44',
        'data-things': 'bonzo'
      },
      receivedProps;
  anythingWatcher.start(props => {receivedProps = props;});
  return mount(<TestRenderCallbackProps {...customProps} />)
    .then(() => {
      anythingWatcher.end();

      t.equal(receivedProps.id, customProps.id, 'render callback should receive full props object');
      t.equal(receivedProps['data-things'], customProps['data-things'], 'render callback should receive full props object');
    });
});

tape.test('Styled component passes component theme to render callback (not overridden)', t => {

  let receivedTheme;
  anythingWatcher.start((props, paramBlock) => receivedTheme = paramBlock.componentTheme);
  return mount(<TestRenderCallbackProps />)
    .then(() => {
      anythingWatcher.end();

      t.equal(receivedTheme.fontSize, staticStyle.fontSize, 'render callback should receive static styles');
      t.equal(receivedTheme.zIndex, staticStyle.zIndex, 'render callback should receive static styles');
    });
});

tape.test('Styled component passes component theme to render callback (with overridden theme)', t => {

  let userTheme = {
        TestRenderCallbackProps: {
          fontSize: '99px',
          zIndex:   '999'
        }
      },
      receivedTheme;

  anythingWatcher.start((props, paramBlock) => receivedTheme = paramBlock.componentTheme);
  return mount(<TestRenderCallbackProps />, userTheme)
    .then(() => {
      anythingWatcher.end();

      t.equal(receivedTheme.fontSize, '99px', 'render callback should receive overridden theme styles');
      t.equal(receivedTheme.zIndex, '999', 'render callback should receive overridden theme styles');
    });
});

tape.test('Styled component passes global meta to render callback', t => {

  let userTheme = {
        TestRenderCallbackProps: {
          fontSize: '99px',
          zIndex:   '999'
        },
        meta: {
          ocean: '11',
          colors: {
            bluish: '#204899'
          }
        }
      },
      receivedMeta;

  anythingWatcher.start((props, paramBlock) => receivedMeta = paramBlock.globalMeta);
  return mount(<TestRenderCallbackProps />, userTheme)
    .then(() => {
      anythingWatcher.end();

      t.equal(receivedMeta.ocean, '11', 'render callback should receive global meta');
      t.equal(receivedMeta.colors.bluish, '#204899', 'render callback should receive global meta');
    });
});


class TestClassify extends Component {
  render() {
    return (
      <Styled>
        {(_className, _props, {classify}) => {
          const subcomponentClasses = classify({
            fontSize: '71px',
            zIndex:   48,
            color:    'guldan'   // gets middlewared below
          });
          anythingWatcher.invoke(subcomponentClasses);
          return null;
        }}
      </Styled>
    );
  }
}

tape.test('styled component offers "classify" method to assist with subcomponents', t => {

  let classes = null;

  anythingWatcher.start(subcomponentClasses => classes = subcomponentClasses);
  return mount(<TestClassify />)
    .then(() => {
      anythingWatcher.end();

      t.equal(typeof classes, 'string', 'classify should return a string');
      t.equal(classes.split(' ').length, 3, 'classify should return three classes, from three style attributes')
    });
});

tape.test('classify applies middleware correctly', t => {
  let localStyletron = new StyletronServer(),
      theme = { meta: { colors: { 'guldan': '#590499' } } };    // no actual components; just a meta is needed here

  return mount(<TestClassify />, theme, {styletron: localStyletron})
    .then(() => {
      const styles = localStyletron.getCss();

      t.equal(styles.indexOf('color:#590499') >= 0, true, 'middleware should be applied');
    });
});
