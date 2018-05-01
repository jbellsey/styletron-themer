import React, {Component} from 'react';
import PropTypes from 'prop-types';
import assignDeep from 'assign-deep';
import getDefaultTheme from './default-theme';
import * as availableMiddlewares from './middlewares';
import {asConsumer} from './consumer';
import {ThemeContext} from './contexts';


/**
 * Main wrapper component to enable theming of UI components.
 */
class ThemeProvider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      theme:            assignDeep({}, getDefaultTheme(), this.getParentThemeContext().theme, this.props.theme),
      middlewares:      this.props.middlewares || [availableMiddlewares.mapColorKeys],
      installComponent: this.installComponent,
      applyMiddleware:  this.applyMiddleware,
      isReady:          this.isReady
    };
    this.readyComponents = [];
    this.wip = {};
  }

  isReady = componentName => {
    return this.readyComponents.indexOf(componentName) !== -1;
  }

  setReady = componentName => {
    this.readyComponents.push(componentName);
  }

  getParentThemeContext() {
    return this.props.themeContext || {};
  }

  // each styled component will be added to the master theme, with a key that
  // matches its name:
  //    fullTheme = {meta:{}, Button:{}, Icon:{} ... }
  //
  installComponent = (componentName, componentTheme) => {

    if (this.isReady(componentName))
      return Promise.resolve();

    // if we're in the middle of an installation of another instance of this component...
    if (this.wip[componentName])
      return this.wip[componentName];

    return this.wip[componentName] = new Promise(resolve => {
      this.setState(prevState => ({
        theme: {
          ...prevState.theme,
          [componentName]: assignDeep({}, componentTheme, prevState.theme[componentName])
        }
      }), () => {
        this.setReady(componentName);
        this.wip[componentName] = null;
        resolve();
      });
    });
  }

  applyMiddleware = styleObj => {
    return this.state.middlewares
      .reduce(
        (styleObj, mw) => mw(this.state.theme, styleObj),
        styleObj
      );
  }

  render() {
    return (
      <ThemeContext.Provider value={this.state}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

/**
 * propTypes
 * @property {object} theme - Theme object in json format. Used instead of css.
 * @property {array}  middlewares - Array of methods to manipulate the style object before it's passed to styletron.
 */
ThemeProvider.propTypes = {
  themeContext: PropTypes.object,
  theme:        PropTypes.object,
  middlewares:  PropTypes.arrayOf(PropTypes.func),
  children:     PropTypes.node
};

// a Root theme provider must be used as the outermost wrapper.
// nested providers use the default export
//
export {ThemeProvider as RootThemeProvider};

const NestedThemeProvider = asConsumer(ThemeProvider);
export default NestedThemeProvider;

// provided as a convenient export for consumers. it is not
// used directly by this component.
//
NestedThemeProvider.middlewares = ThemeProvider.middlewares = availableMiddlewares;
