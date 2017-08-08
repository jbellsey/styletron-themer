import React, {Component} from 'react';
import PropTypes from 'prop-types';
import assignDeep from 'assign-deep';

import getDefaultTheme from './default-theme';
import * as availableMiddlewares from './middlewares';


/**
 * Main wrapper component to enable theming of UI components.
 */
export default class ThemeProvider extends Component {

  // pass these down on context
  static childContextTypes = {
    themeProvider: PropTypes.shape({
      theme:            PropTypes.object.isRequired,
      middlewares:      PropTypes.array,
      installComponent: PropTypes.func,
      applyMiddleware:  PropTypes.func
    })
  };

  // we pull context from above (for nested themes)
  static contextTypes = {
    themeProvider: PropTypes.shape({
      theme: PropTypes.object.isRequired
    })
  };

  getChildContext() {
    return {
      themeProvider: {
        theme:            this.theme,
        middlewares:      this.middlewares,
        installComponent: this.installComponent,
        applyMiddleware:  this.applyMiddleware
      }
    };
  }

  constructor(props, context) {
    super(props, context);

    // do a deep merge with the library theme and the user's overrides. theming is
    // a one-shot deal; we do not currently support dynamic themes (i.e., if you
    // change the theme prop, nothing will change)
    //
    const {theme: parentTheme} = (context || {}).themeProvider || {};
    this.theme               = assignDeep({}, getDefaultTheme(), parentTheme, props.theme);
    this.middlewares         = props.middlewares || [availableMiddlewares.mapColorKeys];
    this.installedComponents = [];
  }

  // each styled component will be added to the master theme, with a key that
  // matches its name:
  //    fullTheme = {meta:{}, Button:{}, Icon:{} ... }
  //
  installComponent = (componentName, componentTheme) => {
    if (this.installedComponents.indexOf(componentName) === -1) {
      this.theme[componentName] = assignDeep({}, componentTheme, this.theme[componentName]);
      this.installedComponents.push(componentName);
    }
  }

  applyMiddleware = styleObj => {
    return this.middlewares
      .reduce(
        (styleObj, mw) => mw(this.theme, styleObj),
        styleObj
      );
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

/**
 * propTypes
 * @property {object} theme - Theme object in json format. Used instead of css.
 * @property {array}  middlewares - Array of methods to manipulate the style object before it's passed to styletron.
 */
ThemeProvider.propTypes = {
  theme:       PropTypes.object,
  middlewares: PropTypes.arrayOf(PropTypes.func)
};

// provided as a convenient export for consumers. it is not
// used directly by this component.
//
ThemeProvider.middlewares = availableMiddlewares;
