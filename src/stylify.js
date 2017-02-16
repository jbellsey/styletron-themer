import React, {PropTypes, Component} from 'react';
import _ from 'lodash';
import {injectStylePrefixed} from 'styletron-utils';
import {getDisplayName} from './utils';


/**
 * @mixin stylify
 * the stylify decorator does all of the styletron magic, and more.
 *
 * @param {object} defaultStyle - An object with all default style attributes.
 * @param {function} makeStyles - An optional function to dynamically adjust styles based on props. see below.
 *
 * The "makeStyles" callback is used to create dynamic styles from props. It takes a single
 * parameter, which is an object with the following keys:
 *
 * props:           as passed to the component
 * componentTheme:  this is the default component theme, merged with the user's overrides
 * globalMeta:      this contains the global meta, such as brand colors (see default-theme.js)
 *
 * @example
 *| // with default styles only; nothing dynamic
 *| @stylify({color: 'red'})
 *| class MyComponent ...

 * @example
 *| // with a single dynamic prop
 *| @stylify({color: 'red'}, ({props}) => props.disabled ? {color: 'gray'} : null)
 *| class MyComponent ...
 */

// this is preferred over the HoC below.
export default function stylify(defaultStyle, makeStyles) {
  return component => createStyledComponent(component, defaultStyle, makeStyles);
}

// utility for components, so they can pass down props without littering. if you need
// to pass through props to an HTML element -- <div {...otherProps}></div> -- then you
// have to use this to avoid setting values that the div doesn't understand.
// this function is passed down as a prop to all components.
//
function stripProps(propsObject, propsToStrip) {
  return _.omit(
    propsObject,
    ['children', 'className', 'style', 'stripProps', 'componentTheme', 'globalMeta'],
    propsToStrip
  );
}

/*
 * standard HoC:
 * @example
 * class MyComponent {...}
 * export createStyledComponent(MyComponent, {color: 'red'}, 'Button')
 */
export function createStyledComponent(CustomComponent, defaultStyle, makeStyles) {

  class StyledComponent extends Component {

    // we pull context from above
    static contextTypes = {

      // from StyletronProvider (see styletron-react)
      styletron:        PropTypes.object.isRequired,

      // from ThemeProvider
      theme:            PropTypes.object.isRequired,
      installComponent: PropTypes.func.isRequired,
      applyMiddleware:  PropTypes.func.isRequired
    };
    static displayName = `Styled_${getDisplayName(CustomComponent)}`;

    // every styled component can take two props, which allow you to override
    // the styles generated by the component directly:
    //  * className => this is prepended to the list of styletron classes. use this to link to
    //                 hard-coded classes in your CSS file (e.g., "bold" or "margined")
    //  * style => pass in a styletron object to override specific styles. this overloads
    //                 React's "style" prop. it integrates with the styletron system
    //
    static propTypes = {
      className: PropTypes.string,
      style:     PropTypes.object,
      children:  PropTypes.any
    }

    constructor(props, context) {
      super(props, context);
      if (!context.installComponent) {
        // TODO: throw or console.error
      }
      context.installComponent(getDisplayName(CustomComponent), defaultStyle);
    }

    // this is where the magic happens. here we figure out what styles need to be
    // applied to this instance of the component. returns an object of styletron properties.
    //
    getStyle() {
      let // the theme is stored on context. this is our default theme, plus the user's overrides
          masterTheme    = this.context.theme,

          // the theme for this component only
          componentTheme = masterTheme[getDisplayName(CustomComponent)] || defaultStyle,
          styleObj;

      // use the component's "makeStyles" function to adjust the styles for this instance
      // based on props
      //
      if (typeof makeStyles === 'function') {
        styleObj = makeStyles({

          // the base theme for this component
          componentTheme,

          // the global meta (for colors and other global attributes)
          globalMeta: masterTheme.meta,

          // last, but not least, the props
          props:      this.props
        });
      }
      else
        styleObj = componentTheme;

      // all components accept a "style" prop for custom styletron attributes.
      // this overrides React's use of "style", by design.
      //
      styleObj = _.merge({}, styleObj, this.props.style);
      return this.context.applyMiddleware(styleObj);
    }

    render() {
      const styleProperties  = this.getStyle(),
            {className, ...otherProps} = this.props,
            {styletron, theme} = this.context,

            // finally, convert the style properties into a set of classes. this is where
            // we let styletron do its magic
            styletronClasses = injectStylePrefixed(styletron, styleProperties);

      return (
        <CustomComponent

          // every component also accepts custom classes on the className props. use for global or legacy
          className      = {(className ? className + ' ' : '') + styletronClasses}

          // use this utility method if you need to pass {...rest} down the chain. see comments above
          stripProps     = {stripProps.bind(null, this.props)}

          // the base theme of your component
          componentTheme = {theme[getDisplayName(CustomComponent)]}

          // the global meta (for colors, etc)
          globalMeta     = {theme.meta}

          // if you really need a ref to a component, you should do it another way. e.g., expose
          // a "stashRef" prop in the component, that lets the owner retrieve the ref directly.
          // unfortunately, HoCs make it hard to use refs the normal way

          // everything else. the caller can pass ID, data attributes, keys, whatever
          {...otherProps}
        />
      );
    }
  }
  return StyledComponent;
}
