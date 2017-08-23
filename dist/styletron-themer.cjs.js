'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));
var styletronUtils = require('styletron-utils');

/*!
 * is-primitive <https://github.com/jonschlinkert/is-primitive>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

// see http://jsperf.com/testing-value-is-primitive/7
var index$1 = function isPrimitive(value) {
  return value == null || (typeof value !== 'function' && typeof value !== 'object');
};

/*!
 * assign-symbols <https://github.com/jonschlinkert/assign-symbols>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var index$3 = function(receiver, objects) {
  if (receiver === null || typeof receiver === 'undefined') {
    throw new TypeError('expected first argument to be an object.');
  }

  if (typeof objects === 'undefined' || typeof Symbol === 'undefined') {
    return receiver;
  }

  if (typeof Object.getOwnPropertySymbols !== 'function') {
    return receiver;
  }

  var isEnumerable = Object.prototype.propertyIsEnumerable;
  var target = Object(receiver);
  var len = arguments.length, i = 0;

  while (++i < len) {
    var provider = Object(arguments[i]);
    var names = Object.getOwnPropertySymbols(provider);

    for (var j = 0; j < names.length; j++) {
      var key = names[j];

      if (isEnumerable.call(provider, key)) {
        target[key] = provider[key];
      }
    }
  }
  return target;
};

var toString = Object.prototype.toString;

/**
 * Get the native `typeof` a value.
 *
 * @param  {*} `val`
 * @return {*} Native javascript type
 */

var index$5 = function kindOf(val) {
  var type = typeof val;

  // primitivies
  if (type === 'undefined') {
    return 'undefined';
  }
  if (val === null) {
    return 'null';
  }
  if (val === true || val === false || val instanceof Boolean) {
    return 'boolean';
  }
  if (type === 'string' || val instanceof String) {
    return 'string';
  }
  if (type === 'number' || val instanceof Number) {
    return 'number';
  }

  // functions
  if (type === 'function' || val instanceof Function) {
    if (typeof val.constructor.name !== 'undefined' && val.constructor.name.slice(0, 9) === 'Generator') {
      return 'generatorfunction';
    }
    return 'function';
  }

  // array
  if (typeof Array.isArray !== 'undefined' && Array.isArray(val)) {
    return 'array';
  }

  // check for instances of RegExp and Date before calling `toString`
  if (val instanceof RegExp) {
    return 'regexp';
  }
  if (val instanceof Date) {
    return 'date';
  }

  // other objects
  type = toString.call(val);

  if (type === '[object RegExp]') {
    return 'regexp';
  }
  if (type === '[object Date]') {
    return 'date';
  }
  if (type === '[object Arguments]') {
    return 'arguments';
  }
  if (type === '[object Error]') {
    return 'error';
  }
  if (type === '[object Promise]') {
    return 'promise';
  }

  // buffer
  if (isBuffer(val)) {
    return 'buffer';
  }

  // es6: Map, WeakMap, Set, WeakSet
  if (type === '[object Set]') {
    return 'set';
  }
  if (type === '[object WeakSet]') {
    return 'weakset';
  }
  if (type === '[object Map]') {
    return 'map';
  }
  if (type === '[object WeakMap]') {
    return 'weakmap';
  }
  if (type === '[object Symbol]') {
    return 'symbol';
  }
  if (type === '[object Map Iterator]') {
    return 'mapiterator';
  }
  if (type === '[object Set Iterator]') {
    return 'setiterator';
  }

  // typed arrays
  if (type === '[object Int8Array]') {
    return 'int8array';
  }
  if (type === '[object Uint8Array]') {
    return 'uint8array';
  }
  if (type === '[object Uint8ClampedArray]') {
    return 'uint8clampedarray';
  }
  if (type === '[object Int16Array]') {
    return 'int16array';
  }
  if (type === '[object Uint16Array]') {
    return 'uint16array';
  }
  if (type === '[object Int32Array]') {
    return 'int32array';
  }
  if (type === '[object Uint32Array]') {
    return 'uint32array';
  }
  if (type === '[object Float32Array]') {
    return 'float32array';
  }
  if (type === '[object Float64Array]') {
    return 'float64array';
  }

  // must be a plain object
  return 'object';
};

/**
 * If you need to support Safari 5-7 (8-10 yr-old browser),
 * take a look at https://github.com/feross/is-buffer
 */

function isBuffer(val) {
  return val.constructor
    && typeof val.constructor.isBuffer === 'function'
    && val.constructor.isBuffer(val);
}

function assign(target/*, objects*/) {
  target = target || {};
  var len = arguments.length, i = 0;
  if (len === 1) {
    return target;
  }
  while (++i < len) {
    var val = arguments[i];
    if (index$1(target)) {
      target = val;
    }
    if (isObject(val)) {
      extend(target, val);
    }
  }
  return target;
}

/**
 * Shallow extend
 */

function extend(target, obj) {
  index$3(target, obj);

  for (var key in obj) {
    if (hasOwn(obj, key)) {
      var val = obj[key];
      if (isObject(val)) {
        if (index$5(target[key]) === 'undefined' && index$5(val) === 'function') {
          target[key] = val;
        }
        target[key] = assign(target[key] || {}, val);
      } else {
        target[key] = val;
      }
    }
  }
  return target;
}

/**
 * Returns true if the object is a plain object or a function.
 */

function isObject(obj) {
  return index$5(obj) === 'object' || index$5(obj) === 'function';
}

/**
 * Returns true if the given `key` is an own property of `obj`.
 */

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Expose `assign`
 */

var index = assign;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var _class;
var _temp;

var Styled = (_temp = _class = function (_Component) {
  inherits(Styled, _Component);

  // we pull context from above
  function Styled(props, context) {
    classCallCheck(this, Styled);

    var _this = possibleConstructorReturn(this, (Styled.__proto__ || Object.getPrototypeOf(Styled)).call(this, props, context));

    if (!context.themeProvider) {
      console.error('Styled components must be rendered inside a ThemeProvider.'); // eslint-disable-line
    }

    _this.componentName = props.themeName;

    // ensure that the component's static style is inserted into the master theme.
    // unnamed components are not installed into the theme; see getComponentTheme() below
    //
    if (_this.componentName) context.themeProvider.installComponent(_this.componentName, props.staticStyle || {});
    return _this;
  }

  /*
   every styled component can take two props which allow you to override
   the styles generated by the component directly:
    * className => if the user of a component passes a className prop explicitly,
     it is prepended to the list of styletron classes. use this to link to legacy or
     hard-coded classes in an external CSS file (e.g., "margined" or "select-multi")
    * style => the user can pass in a styletron object to override specific styles.
     this overloads React's "style" prop. it integrates with the styletron system,
     so the result of passing a style prop will actually be additional classes,
     not an inline style attribute
  */

  createClass(Styled, [{
    key: 'getComponentTheme',
    value: function getComponentTheme() {
      var theme = this.componentName ? this.context.themeProvider.theme[this.componentName] : this.props.staticStyle; // for unthemed (unnamed) components
      return theme || {};
    }

    // this is where the magic happens. here we figure out what styles need to be applied
    // to this instance of the component. returns an object of styletron attributes (not classes)
    //

  }, {
    key: 'getStyle',
    value: function getStyle() {
      var
      // the theme is stored on context
      masterTheme = this.context.themeProvider.theme,
          componentTheme = this.getComponentTheme(),
          styleObj = void 0;

      // use the component's dynamic styling function to adjust the styles for this instance
      // based on props
      //
      if (typeof this.props.dynamicStyle === 'function') {
        styleObj = this.props.dynamicStyle({

          // the base theme for this component
          componentTheme: componentTheme,

          // the global meta (for colors and other global attributes)
          globalMeta: masterTheme.meta,

          // last, but not least, the props
          props: this.props
        });
      } else styleObj = componentTheme;

      // all components accept a "style" prop for custom styletron attributes.
      // this overrides React's use of "style", as described above.
      //
      if (this.props.style) styleObj = index({}, styleObj, this.props.style);

      // middleware
      styleObj = this.context.themeProvider.applyMiddleware(styleObj);

      return styleObj;
    }
  }, {
    key: 'render',
    value: function render() {
      var styleProperties = this.getStyle(),
          _props = this.props,
          className = _props.className,
          children = _props.children,
          themeName = _props.themeName,
          staticStyle = _props.staticStyle,
          dynamicStyle = _props.dynamicStyle,
          style = _props.style,
          passThroughProps = objectWithoutProperties(_props, ['className', 'children', 'themeName', 'staticStyle', 'dynamicStyle', 'style']),
          _context = this.context,
          styletron = _context.styletron,
          theme = _context.themeProvider.theme,
          styletronClasses = styletronUtils.injectStylePrefixed(styletron, styleProperties),
          paramBlock = {
        // the base theme of your component
        componentTheme: this.getComponentTheme(),

        // the global meta (for colors, etc)
        globalMeta: theme.meta
      };

      // invoke the render callback with three params
      return children(

      // PARAM 1: className
      // (see above for comments on the use of the className prop for legacy CSS classes)
      (className ? className + ' ' : '') + styletronClasses,

      // PARAM 2: pass through props
      passThroughProps,

      // PARAM 3: everything else, wrapped up into an object
      paramBlock);
    }
  }]);
  return Styled;
}(React.Component), _class.contextTypes = {

  // from StyletronProvider (see styletron-react)
  styletron: PropTypes.object.isRequired,

  // from ThemeProvider
  themeProvider: PropTypes.shape({
    theme: PropTypes.object.isRequired,
    installComponent: PropTypes.func.isRequired,
    applyMiddleware: PropTypes.func.isRequired
  }).isRequired
}, _class.propTypes = {
  // basic props
  themeName: PropTypes.string, // unnamed components are not themeable; useful for one-offs
  staticStyle: PropTypes.object,
  dynamicStyle: PropTypes.func,

  // for per-instance styling
  className: PropTypes.string,
  style: PropTypes.object,

  // we only accept a render callback function for children
  children: PropTypes.func.isRequired
}, _temp);

function getDisplayName(Component$$1) {
  var name = Component$$1.displayName || Component$$1.name;
  if (name) return name;

  if (typeof Component$$1 === 'string') return Component$$1;

  if (typeof Component$$1.type === 'string') return Component$$1.type;

  if (typeof Component$$1.type === 'function') return getDisplayName(Component$$1.type);

  return 'Unknown';
}

function isObject$1(item) {
  return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === "object" && !Array.isArray(item) && item !== null;
}

/**
 * the classify decorator is used by APPLICATION authors more than component authors.
 * it provides a "classify" function as a prop. this can be used to put styles
 * directly into HTML elements or other components that were not created with <Styled>.
 * this is an escape hatch that library authors should do their best to make unnecessary.
 *
 * @example
 *| @classify
 *| class MyComponent extends Component {
 *|    render() {
 *|      return <h2 className={this.props.classify({color: 'red'})}>Red title</h2>
 *|    }
 *| }
 */

// can be used as a decorator or HoC
//
function classify(CustomComponent) {
  var _class, _temp2;

  var ClassifiedComponent = (_temp2 = _class = function (_Component) {
    inherits(ClassifiedComponent, _Component);

    function ClassifiedComponent() {
      var _ref;

      var _temp, _this, _ret;

      classCallCheck(this, ClassifiedComponent);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = ClassifiedComponent.__proto__ || Object.getPrototypeOf(ClassifiedComponent)).call.apply(_ref, [this].concat(args))), _this), _this.classifyStyles = function () {
        for (var _len2 = arguments.length, styletronObjects = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          styletronObjects[_key2] = arguments[_key2];
        }

        var allStyles = index.apply(undefined, [{}].concat(styletronObjects)),
            themeProvider = _this.context.themeProvider;

        if (themeProvider) allStyles = themeProvider.applyMiddleware(allStyles);
        return styletronUtils.injectStylePrefixed(_this.context.styletron, allStyles);
      }, _temp), possibleConstructorReturn(_this, _ret);
    }

    // we pull context from above


    createClass(ClassifiedComponent, [{
      key: 'render',
      value: function render() {
        return React__default.createElement(CustomComponent, _extends({}, this.props, {
          classify: this.classifyStyles
        }));
      }
    }]);
    return ClassifiedComponent;
  }(React.Component), _class.contextTypes = {

    // from StyletronProvider (see styletron-react)
    styletron: PropTypes.object.isRequired,

    // from ThemeProvider
    themeProvider: PropTypes.shape({
      applyMiddleware: PropTypes.func.isRequired
    })
  }, _class.displayName = 'Classify_' + getDisplayName(CustomComponent), _temp2);

  return ClassifiedComponent;
}

var libraryMeta = {};

function installLibraryMeta(t) {
  libraryMeta = t;
}

function getDefaultTheme() {
  return { meta: libraryMeta };
}

/*
  this module doesn't provide generic tools for middleware management.
  it simply provides a single middleware tool for color mapping.
*/

var fullTextSearch = ['background', 'border', 'outline'];
var contains = ['border', 'background', 'outline', 'hadow'];
var svgAttributes = ['stroke', 'fill'];

function isKeyColorRelated(key) {

  // we need to trap both "color" and "Color" in the attribute name. so we just
  // look for "olor", which is a safe search (i.e., there are no false positives)
  //
  if (key.indexOf('olor') > -1) return true;

  // some key names need to checked more thoroughly: "borderColorLeft", "boxShadow", etc
  if (contains.some(function (searchFor) {
    return key.indexOf(searchFor) !== -1;
  })) return true;

  // a few custom attributes that don't have "color" in their names
  //
  return svgAttributes.concat(fullTextSearch).indexOf(key) !== -1;
}

// mapping function should return undefined if no change
//
function colorValueMapper(theme, key, value) {
  var colorMap = theme.meta.colors;
  if (!colorMap || !value) return;

  // if the value is a simple match for an existing color, use it
  var outputColor = colorMap[value];
  if (outputColor) return outputColor;

  // otherwise, we have to do a full text search & replace. before we
  // do the expensive searches, make sure that the value has multiple words!
  //
  if (value.indexOf(' ') !== -1) {
    var anyChanges = false;
    outputColor = value;

    Object.keys(colorMap).forEach(function (oneColor) {

      var re = new RegExp('\\b' + oneColor + '\\b');

      outputColor = outputColor.replace(re, function () {
        anyChanges = true;
        return colorMap[oneColor];
      });
    });
    if (anyChanges) return outputColor;
  }
}

// the heavy lifting is done here. this function doesn't know anything about
// colors; the callbacks make this very reusable
// TODO: expose this
//
function styleDive(theme, styles, keyTester, valueMapper) {

  var clonedRoot = false,
      cloneNow = function cloneNow() {
    if (!clonedRoot) styles = index({}, styles);
    clonedRoot = true;
  };

  Object.keys(styles).forEach(function (key) {

    if (isObject$1(styles[key])) {
      var _styleDive = styleDive(theme, styles[key], keyTester, valueMapper),
          clonedChild = _styleDive.cloned,
          childStyles = _styleDive.styles;

      if (clonedChild) cloneNow();
      styles[key] = childStyles;
    } else if (keyTester(key)) {

      var originalValue = styles[key],
          mappedValue = valueMapper(key, originalValue);

      if (mappedValue !== undefined) {
        cloneNow();
        styles[key] = mappedValue;
      }
    }
  });

  return {
    styles: styles,
    cloned: clonedRoot
  };
}

// a convenience function that does key-based lookups into the global meta.
// if you use a key like "primary" or "blueGray" in any color-related style
// attribute, it will be converted to a CSS string. otherwise, your input is
// returned untouched.
//
function mapColorKeys(theme, styles) {
  return styleDive(theme, styles, isKeyColorRelated, colorValueMapper.bind(null, theme)).styles;
}

var availableMiddlewares = Object.freeze({
	mapColorKeys: mapColorKeys
});

var _class$1;
var _temp$1;

/**
 * Main wrapper component to enable theming of UI components.
 */
var ThemeProvider = (_temp$1 = _class$1 = function (_Component) {
  inherits(ThemeProvider, _Component);
  createClass(ThemeProvider, [{
    key: 'getChildContext',


    // pass these down on context
    value: function getChildContext() {
      return {
        themeProvider: {
          theme: this.theme,
          middlewares: this.middlewares,
          installComponent: this.installComponent,
          applyMiddleware: this.applyMiddleware
        }
      };
    }

    // we pull context from above (for nested themes)

  }]);

  function ThemeProvider(props, context) {
    classCallCheck(this, ThemeProvider);

    // do a deep merge with the library theme and the user's overrides. theming is
    // a one-shot deal; we do not currently support dynamic themes (i.e., if you
    // change the theme prop, nothing will change)
    //
    var _this = possibleConstructorReturn(this, (ThemeProvider.__proto__ || Object.getPrototypeOf(ThemeProvider)).call(this, props, context));

    _this.installComponent = function (componentName, componentTheme) {
      if (_this.installedComponents.indexOf(componentName) === -1) {
        _this.theme[componentName] = index({}, componentTheme, _this.theme[componentName]);
        _this.installedComponents.push(componentName);
      }
    };

    _this.applyMiddleware = function (styleObj) {
      return _this.middlewares.reduce(function (styleObj, mw) {
        return mw(_this.theme, styleObj);
      }, styleObj);
    };

    var _ref = (context || {}).themeProvider || {},
        parentTheme = _ref.theme;

    _this.theme = index({}, getDefaultTheme(), parentTheme, props.theme);
    _this.middlewares = props.middlewares || [mapColorKeys];
    _this.installedComponents = [];
    return _this;
  }

  // each styled component will be added to the master theme, with a key that
  // matches its name:
  //    fullTheme = {meta:{}, Button:{}, Icon:{} ... }
  //


  createClass(ThemeProvider, [{
    key: 'render',
    value: function render() {
      return React__default.Children.only(this.props.children);
    }
  }]);
  return ThemeProvider;
}(React.Component), _class$1.childContextTypes = {
  themeProvider: PropTypes.shape({
    theme: PropTypes.object.isRequired,
    middlewares: PropTypes.array,
    installComponent: PropTypes.func,
    applyMiddleware: PropTypes.func
  })
}, _class$1.contextTypes = {
  themeProvider: PropTypes.shape({
    theme: PropTypes.object.isRequired
  })
}, _temp$1);

ThemeProvider.propTypes = {
  theme: PropTypes.object,
  middlewares: PropTypes.arrayOf(PropTypes.func)
};

// provided as a convenient export for consumers. it is not
// used directly by this component.
//
ThemeProvider.middlewares = availableMiddlewares;

exports.Styled = Styled;
exports.classify = classify;
exports.ThemeProvider = ThemeProvider;
exports.installLibraryMeta = installLibraryMeta;
