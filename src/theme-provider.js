import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
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
    // a one-shot deal; we do not currently support dynamic themes, although that
    // would be easy to add in the future.
    //
    this.theme               = _.merge({}, getDefaultTheme(), props.theme);
    this.middlewares         = props.middlewares || [availableMiddlewares.mapColorKeys];
    this.installedComponents = [];
  }

  // each styled component will be added to the master theme, with a key that
  // matches its name:
  //    fullTheme = {meta:{}, Button:{}, Icon:{} ... }
  //
  installComponent = (componentName, componentTheme) => {
    if (this.installedComponents.indexOf(componentName) === -1) {
      this.theme[componentName] = _.merge({}, componentTheme, this.theme[componentName]);
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

  // TODO: add a componentWillReceiveProps hook, which will allow the user to
  // change the theme on the fly

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
  middlewares: PropTypes.array
};

// provided as a convenient export for consumers. it is not
// used directly by this component.
//
ThemeProvider.middlewares = availableMiddlewares;
