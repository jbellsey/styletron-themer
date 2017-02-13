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
exports.createStyledElementComponent = createStyledElementComponent;

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

//this is preferred over the HoC below.
function stylify(defaultStyle, makeStyles) {
  return function (component) {
    return createStyledElementComponent(component, defaultStyle, makeStyles);
  };
}

// utility for components, so they can pass down props without littering. if you need
// to pass through props to an HTML element -- <div {...otherProps}></div> -- then you
// have to use this to avoid setting values that the div doesn't understand.
// this function is passed down as a prop to all components.
//
function stripProps(propsObject, propsToStrip) {
  return (0, _omit3.default)(propsObject, ['children', 'className', 'inlineStyles', 'stripProps', 'componentTheme', 'globalMeta'], propsToStrip);
}

/*
 * standard HoC:
 * @example
 * class MyComponent {...}
 * export createStyledElementComponent(MyComponent, {color: 'red'}, 'Button')
 */
function createStyledElementComponent(CustomComponent, defaultStyle, makeStyles) {
  var _class, _temp;

  var StyledComponent = (_temp = _class = function (_Component) {
    _inherits(StyledComponent, _Component);

    function StyledComponent(props, context) {
      _classCallCheck(this, StyledComponent);

      var _this = _possibleConstructorReturn(this, (StyledComponent.__proto__ || Object.getPrototypeOf(StyledComponent)).call(this, props, context));

      if (!context.installComponent) {
        // TODO: throw or console.error
      }
      context.installComponent((0, _utils.getDisplayName)(CustomComponent), defaultStyle);
      return _this;
    }

    // this is where the magic happens. here we figure out what styles need to be
    // applied to this instance of the component. returns an object of styletron properties.
    //


    // every styled component can take two props, which allow you to override
    // the styles generated by the component directly:
    //  * className => this is prepended to the list of styletron classes. use this to link to
    //                 hard-coded classes in your CSS file (e.g., "bold" or "margined")
    //  * inlineStyles => pass in a styletron object to override specific styles. this is preferred
    //                 over the use of React's "style" prop, simply because it integrates with the
    //                 styletron system
    //


    // we pull context from above


    _createClass(StyledComponent, [{
      key: 'getStyle',
      value: function getStyle() {
        var // the theme is stored on context. this is our default theme, plus the user's overrides
        masterTheme = this.context.theme,


        // the theme for this component only
        componentTheme = masterTheme[(0, _utils.getDisplayName)(CustomComponent)] || defaultStyle,
            styleObj = void 0;

        // use the component's "makeStyles" function to adjust the styles for this instance
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
        } else styleObj = componentTheme;

        // all components accept an "inlineStyles" prop for custom styletron attributes
        //
        styleObj = (0, _merge3.default)({}, styleObj, this.props.inlineStyles);
        return this.context.applyMiddleware(styleObj);
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
            theme = _context.theme,
            styletronClasses = (0, _styletronUtils.injectStylePrefixed)(styletron, styleProperties);


        return _react2.default.createElement(CustomComponent

        // every component also accepts custom classes on the className props. use for global or legacy
        , _extends({ className: (className ? className + ' ' : '') + styletronClasses

          // use this utility method if you need to pass {...rest} down the chain. see comments above
          , stripProps: stripProps

          // the base theme of your component
          , componentTheme: theme[(0, _utils.getDisplayName)(CustomComponent)]

          // the global meta (for colors, etc)
          , globalMeta: theme.meta

          // if you really need a ref to a component, you should do it another way. e.g., expose
          // a "stashRef" prop in the component, that lets the owner retrieve the ref directly.
          // unfortunately, HoCs make it hard to use refs the normal way

          // everything else. the caller can pass ID, data attributes, keys, whatever
        }, otherProps));
      }
    }]);

    return StyledComponent;
  }(_react.Component), _class.contextTypes = {
    styletron: _react.PropTypes.object,
    theme: _react.PropTypes.object.isRequired,
    installComponent: _react.PropTypes.func.isRequired,
    applyMiddleware: _react.PropTypes.func.isRequired
  }, _class.displayName = 'Styled_' + (0, _utils.getDisplayName)(CustomComponent), _class.propTypes = {
    className: _react.PropTypes.string,
    inlineStyles: _react.PropTypes.object,
    children: _react.PropTypes.any
  }, _temp);

  return StyledComponent;
}