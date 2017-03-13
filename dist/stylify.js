'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _merge2 = require('lodash/merge');

var _merge3 = _interopRequireDefault(_merge2);

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = stylify;
exports.createStyledComponent = createStyledComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styletronUtils = require('styletron-utils');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

/*
  this is preferred over the HoC below. can be used as a class decorator:
    @stylify(...)
    class MyComponent...

  or to wrap a stateless functional component:
    export stylify(...)(MyStatelessComponent);
*/
function stylify(defaultStyle, makeStyles) {
  return function (component) {
    return createStyledComponent(component, defaultStyle, makeStyles);
  };
}

/*
  utility for components, so they can pass down props without littering. if you need
  to pass through props to an HTML element -- <div {...otherProps}></div> -- then you
  have to use this to avoid setting attributes that the div doesn't understand. React
  will warn you if you pass a component prop to an HTML element; e.g., <div buttonType="primary"></div>

  this function is passed down as a prop to all components.
*/
function stripProps(propsObject, propsToStrip) {
  return (0, _omit3.default)(propsObject, ['children', 'className', 'style', 'stripProps', 'componentTheme', 'globalMeta', 'injectStyles'], propsToStrip);
}

/*
 * standard HoC:
 * @example
 * class MyComponent {...}
 * export createStyledComponent(MyComponent, {color: 'red'}, 'Button')
 */
function createStyledComponent(CustomComponent, defaultStyle, makeStyles) {
  var _class, _temp;

  var StyledComponent = (_temp = _class = function (_Component) {
    _inherits(StyledComponent, _Component);

    function StyledComponent(props, context) {
      _classCallCheck(this, StyledComponent);

      var _this = _possibleConstructorReturn(this, (StyledComponent.__proto__ || Object.getPrototypeOf(StyledComponent)).call(this, props, context));

      if (!context.themeProvider) {}
      // TODO: throw or console.error


      // ensure that the component's default styles are inserted into the master theme
      context.themeProvider.installComponent((0, _utils.getDisplayName)(CustomComponent), defaultStyle);
      return _this;
    }

    // this is where the magic happens. here we figure out what styles need to be applied
    // to this instance of the component. returns an object of styletron attributes (not classes)
    //


    /*
      every stylified component can take two props which allow you to override
      the styles generated by the component directly:
         * className => if the user of a component passes a className prop explicitly,
            it is prepended to the list of styletron classes. use this to link to
            hard-coded classes in an external CSS file (e.g., "margined" or "select-multi")
         * style => the user can pass in a styletron object to override specific styles.
            this overloads React's "style" prop. it integrates with the styletron system,
            so the result of passing a style prop will actually be additional classes,
            not an inline style attribute
    */


    // we pull context from above


    _createClass(StyledComponent, [{
      key: 'getStyle',
      value: function getStyle() {
        var // the theme is stored on context. this is our default theme, plus the user's overrides
        masterTheme = this.context.themeProvider.theme,


        // the theme for this component only. the fallback was used when we didn't require
        // a ThemeProvider as an ancestor, and should not be needed any more
        componentTheme = masterTheme[(0, _utils.getDisplayName)(CustomComponent)] || defaultStyle,


        // if the user doesn't give us a dynamic styling function, use the default styles
        styleObj = componentTheme;

        // use the component's dynamic styling function to adjust the styles for this instance
        // based on props
        //
        if (typeof makeStyles === 'function') {
          styleObj = makeStyles({

            // the base theme for this component
            componentTheme: componentTheme,

            // the global meta (for colors and other global attributes)
            globalMeta: masterTheme.meta,

            // last, but not least, the props
            props: this.props
          });
        }

        // all components accept a "style" prop for custom styletron attributes.
        // this overrides React's use of "style", as described above.
        //
        styleObj = (0, _merge3.default)({}, styleObj, this.props.style);

        // lastly, middleware
        return this.context.themeProvider.applyMiddleware(styleObj);
      }
    }, {
      key: 'render',
      value: function render() {
        var styleProperties = this.getStyle(),
            _props = this.props,
            className = _props.className,
            otherProps = _objectWithoutProperties(_props, ['className']),
            _context = this.context,
            styletron = _context.styletron,
            theme = _context.themeProvider.theme,
            styletronClasses = (0, _styletronUtils.injectStylePrefixed)(styletron, styleProperties);

        /*
          a quick note on refs: if your component needs to expose a ref, you have to do it
          yourself. e.g., expose a "stashRef" prop in the component that lets the owner
          retrieve the ref directly. unfortunately, HoCs make it hard to make a pass-through
          ref to get access to the underlying component.
        */

        return _react2.default.createElement(CustomComponent

        // see above for comments on the use of the className prop for legacy CSS classes
        , _extends({ className: (className ? className + ' ' : '') + styletronClasses

          // use this utility method if you need to pass {...rest} down the chain. see comments above
          , stripProps: stripProps

          // the base theme of your component
          , componentTheme: theme[(0, _utils.getDisplayName)(CustomComponent)]

          // the global meta (for colors, etc)
          , globalMeta: theme.meta

          // everything else. the caller can pass ID, data attributes, keys, whatever
        }, otherProps));
      }
    }]);

    return StyledComponent;
  }(_react.Component), _class.contextTypes = {

    // from StyletronProvider (see styletron-react)
    styletron: _react.PropTypes.object.isRequired,

    // from ThemeProvider
    themeProvider: _react.PropTypes.shape({
      theme: _react.PropTypes.object.isRequired,
      installComponent: _react.PropTypes.func.isRequired,
      applyMiddleware: _react.PropTypes.func.isRequired
    }).isRequired
  }, _class.displayName = 'Styled_' + (0, _utils.getDisplayName)(CustomComponent), _class.propTypes = {
    className: _react.PropTypes.string,
    style: _react.PropTypes.object,
    children: _react.PropTypes.any
  }, _temp);

  return StyledComponent;
}