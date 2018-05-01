'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));
var styletronEngineAtomic = require('styletron-engine-atomic');

/*!
 * is-primitive <https://github.com/jonschlinkert/is-primitive>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

// see http://jsperf.com/testing-value-is-primitive/7
var isPrimitive = function isPrimitive(value) {
  return value == null || (typeof value !== 'function' && typeof value !== 'object');
};

var isPrimitive$1 = /*#__PURE__*/Object.freeze({
  default: isPrimitive,
  __moduleExports: isPrimitive
});

/*!
 * assign-symbols <https://github.com/jonschlinkert/assign-symbols>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var assignSymbols = function(receiver, objects) {
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

var assignSymbols$1 = /*#__PURE__*/Object.freeze({
  default: assignSymbols,
  __moduleExports: assignSymbols
});

var toString = Object.prototype.toString;

/**
 * Get the native `typeof` a value.
 *
 * @param  {*} `val`
 * @return {*} Native javascript type
 */

var kindOf = function kindOf(val) {
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

var kindOf$1 = /*#__PURE__*/Object.freeze({
  default: kindOf,
  __moduleExports: kindOf
});

var isPrimitive$2 = ( isPrimitive$1 && isPrimitive ) || isPrimitive$1;

var assignSymbols$2 = ( assignSymbols$1 && assignSymbols ) || assignSymbols$1;

var typeOf = ( kindOf$1 && kindOf ) || kindOf$1;

function assign(target/*, objects*/) {
  target = target || {};
  var len = arguments.length, i = 0;
  if (len === 1) {
    return target;
  }
  while (++i < len) {
    var val = arguments[i];
    if (isPrimitive$2(target)) {
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
  assignSymbols$2(target, obj);

  for (var key in obj) {
    if (hasOwn(obj, key)) {
      var val = obj[key];
      if (isObject(val)) {
        if (typeOf(target[key]) === 'undefined' && typeOf(val) === 'function') {
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
  return typeOf(obj) === 'object' || typeOf(obj) === 'function';
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

var assignDeep = assign;

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

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

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

function getDisplayName(Component) {
  var name = Component.displayName || Component.name;
  if (name) return name;

  if (typeof Component === 'string') return Component;

  if (typeof Component.type === 'string') return Component.type;

  if (Component.type === React__default.Fragment) return 'Fragment';

  if (typeof Component.type === 'function') return getDisplayName(Component.type);

  return 'Unknown';
}

function isObject$1(item) {
  return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === "object" && !Array.isArray(item) && item !== null;
}

var ThemeContext = React.createContext();
var StyletronContext = React.createContext();

var emptyThemeContext = {
  applyMiddleware: function applyMiddleware() {},
  theme: {
    meta: {
      globalMeta: {}
    }
  }
};

function asConsumer(RootComponent) {
  function Consumer(props) {
    return React__default.createElement(
      ThemeContext.Consumer,
      null,
      function (themeContext) {
        return React__default.createElement(
          StyletronContext.Consumer,
          null,
          function (styletron) {
            return React__default.createElement(RootComponent, _extends({}, props, {
              themeContext: themeContext || emptyThemeContext,
              styletron: styletron || {}
            }));
          }
        );
      }
    );
  }

  Consumer.displayName = 'Consumer_' + getDisplayName(RootComponent);
  return Consumer;
}

var _class, _class2, _temp;

var Styled = asConsumer(_class = (_temp = _class2 = function (_Component) {
  inherits(Styled, _Component);

  /*
   every styled component can take several props which allow you to override
   the styles generated by the component directly:
    * className => if the user of a component passes a className prop explicitly,
     it is prepended to the list of styletron classes. use this to link to legacy or
     hard-coded classes in an external CSS file (e.g., "margined" or "select-multi")
    * style => the user can pass in a styletron object to override specific styles.
     this overloads React's "style" prop. it integrates with the styletron system,
     so the result of passing a style prop will actually be additional classes,
     not an inline style attribute
    * localTheme => allows the user to override the entire theme object for a component.
     this includes the component's meta, as well as its base styles (the meta cannot
     be overridden using the "style" prop). the local theme is for this component only,
     not the entire subtree
  */

  function Styled(props) {
    classCallCheck(this, Styled);

    var _this = possibleConstructorReturn(this, (Styled.__proto__ || Object.getPrototypeOf(Styled)).call(this, props));

    _this.state = { ready: false };

    _this.classify = function (styletronObject) {

      if (!_this.state.ready) return '';

      try {
        return _this.props.styletron.renderStyle(_this.props.themeContext.applyMiddleware(styletronObject));
      } catch (e) {
        return '';
      }
    };

    var componentName = _this.componentName = props.themeName;

    if (componentName && props.themeContext && props.themeContext.installComponent && !props.themeContext.isReady(componentName)) {
      _this.props.themeContext.installComponent(componentName, props.staticStyle || {}).then(function () {
        _this.setState({ ready: true });
      });
    } else {
      _this.state = { ready: true };
    }
    return _this;
  }

  createClass(Styled, [{
    key: 'getRootTheme',
    value: function getRootTheme() {
      if (this.componentName && this.props.themeContext) return this.props.themeContext.theme[this.componentName];
      return this.props.staticStyle; // for unthemed (unnamed) components
    }
  }, {
    key: 'getComponentTheme',
    value: function getComponentTheme() {
      var theme = this.getRootTheme();
      if (this.props.localTheme) theme = assignDeep({}, theme, this.props.localTheme);
      return theme || {};
    }

    // this is where the magic happens. here we figure out what styles need to be applied
    // to this instance of the component. returns an object of styletron attributes (not classes)
    //

  }, {
    key: 'getStyle',
    value: function getStyle() {
      var themeContext = this.props.themeContext,
          componentTheme = this.getComponentTheme(),
          styleObj = void 0;

      // use the component's dynamic styling function to adjust the styles for this instance
      // based on props
      //
      if (typeof this.props.dynamicStyle === 'function' && this.state.ready) {
        styleObj = this.props.dynamicStyle({

          // the base theme for this component
          componentTheme: componentTheme,

          // the global meta (for colors and other global attributes)
          globalMeta: themeContext.theme.meta,

          // last, but not least, the props
          props: this.props
        });
      } else styleObj = componentTheme;

      // all components accept a "style" prop for custom styletron attributes.
      // this overrides React's use of "style", as described above.
      //
      if (this.props.style) styleObj = assignDeep({}, styleObj, this.props.style);

      return styleObj;
    }

    // passed to the user to render sub-components. pass in any styletron object, and
    // we'll convert it to classes for you
    //

  }, {
    key: 'render',
    value: function render() {
      if (!this.state.ready) return null;

      var styleProperties = this.getStyle(),
          _props = this.props,
          className = _props.className,
          children = _props.children,
          themeContext = _props.themeContext,
          styletron = _props.styletron,
          themeName = _props.themeName,
          staticStyle = _props.staticStyle,
          dynamicStyle = _props.dynamicStyle,
          localTheme = _props.localTheme,
          style = _props.style,
          passThroughProps = objectWithoutProperties(_props, ['className', 'children', 'themeContext', 'styletron', 'themeName', 'staticStyle', 'dynamicStyle', 'localTheme', 'style']),
          styletronClasses = this.classify(styleProperties),
          paramBlock = {
        // the base theme of your component
        componentTheme: this.getComponentTheme(),

        // the global meta (for colors, etc)
        globalMeta: themeContext.theme.meta,

        // easy access to "classify", for building classes for sub-components
        classify: this.classify
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
}(React.Component), _class2.propTypes = {
  // basic props
  themeName: PropTypes.string, // unnamed components are not themeable; useful for one-offs
  staticStyle: PropTypes.object,
  dynamicStyle: PropTypes.func,

  // for per-instance styling
  className: PropTypes.string,
  style: PropTypes.object,
  localTheme: PropTypes.object,

  // from context wrappers
  themeContext: PropTypes.object,
  styletron: PropTypes.object,

  // we only accept a render callback function for children
  children: PropTypes.func.isRequired
}, _temp)) || _class;

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

var fullTextSearch = ['background', 'border', 'outline'],
    contains = ['border', 'background', 'outline', 'hadow'],
    svgAttributes = ['stroke', 'fill'];

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
  if (!colorMap || !value || typeof value !== 'string') return;

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
    if (!clonedRoot) styles = assignDeep({}, styles);
    clonedRoot = true;
  };

  Object.keys(styles).forEach(function (key) {

    if (key === 'meta') return;

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

var availableMiddlewares = /*#__PURE__*/Object.freeze({
  mapColorKeys: mapColorKeys
});

/**
 * Main wrapper component to enable theming of UI components.
 */

var ThemeProvider = function (_Component) {
  inherits(ThemeProvider, _Component);

  function ThemeProvider(props) {
    classCallCheck(this, ThemeProvider);

    var _this = possibleConstructorReturn(this, (ThemeProvider.__proto__ || Object.getPrototypeOf(ThemeProvider)).call(this, props));

    _this.isReady = function (componentName) {
      return _this.readyComponents.indexOf(componentName) !== -1;
    };

    _this.setReady = function (componentName) {
      _this.readyComponents.push(componentName);
    };

    _this.installComponent = function (componentName, componentTheme) {

      if (_this.isReady(componentName)) return Promise.resolve();

      // if we're in the middle of an installation of another instance of this component...
      if (_this.wip[componentName]) return _this.wip[componentName];

      return _this.wip[componentName] = new Promise(function (resolve) {
        _this.setState(function (prevState) {
          return {
            theme: _extends({}, prevState.theme, defineProperty({}, componentName, assignDeep({}, componentTheme, prevState.theme[componentName])))
          };
        }, function () {
          _this.setReady(componentName);
          _this.wip[componentName] = null;
          resolve();
        });
      });
    };

    _this.applyMiddleware = function (styleObj) {
      return _this.state.middlewares.reduce(function (styleObj, mw) {
        return mw(_this.state.theme, styleObj);
      }, styleObj);
    };

    _this.state = {
      theme: assignDeep({}, getDefaultTheme(), _this.getParentThemeContext().theme, _this.props.theme),
      middlewares: _this.props.middlewares || [mapColorKeys],
      installComponent: _this.installComponent,
      applyMiddleware: _this.applyMiddleware,
      isReady: _this.isReady
    };
    _this.readyComponents = [];
    _this.wip = {};
    return _this;
  }

  createClass(ThemeProvider, [{
    key: 'getParentThemeContext',
    value: function getParentThemeContext() {
      return this.props.themeContext || {};
    }

    // each styled component will be added to the master theme, with a key that
    // matches its name:
    //    fullTheme = {meta:{}, Button:{}, Icon:{} ... }
    //

  }, {
    key: 'render',
    value: function render() {
      return React__default.createElement(
        ThemeContext.Provider,
        { value: this.state },
        this.props.children
      );
    }
  }]);
  return ThemeProvider;
}(React.Component);

/**
 * propTypes
 * @property {object} theme - Theme object in json format. Used instead of css.
 * @property {array}  middlewares - Array of methods to manipulate the style object before it's passed to styletron.
 */


ThemeProvider.propTypes = {
  themeContext: PropTypes.object,
  theme: PropTypes.object,
  middlewares: PropTypes.arrayOf(PropTypes.func),
  children: PropTypes.node
};

var NestedThemeProvider = asConsumer(ThemeProvider);

// provided as a convenient export for consumers. it is not
// used directly by this component.
//
NestedThemeProvider.middlewares = ThemeProvider.middlewares = availableMiddlewares;

var StyletronProvider = function (_Component) {
  inherits(StyletronProvider, _Component);

  function StyletronProvider() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, StyletronProvider);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = StyletronProvider.__proto__ || Object.getPrototypeOf(StyletronProvider)).call.apply(_ref, [this].concat(args))), _this), _this.state = { styletron: null }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(StyletronProvider, [{
    key: 'render',
    value: function render() {
      return React__default.createElement(
        StyletronContext.Provider,
        { value: this.state.styletron },
        this.props.children
      );
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(_ref2) {
      var styletron = _ref2.styletron;

      if (styletron) return { styletron: styletron };
    }
  }]);
  return StyletronProvider;
}(React.Component);


StyletronProvider.propTypes = {
  styletron: PropTypes.object,
  children: PropTypes.node
};

function LibraryProvider(props) {
  var _ref = props || {},
      theme = _ref.theme,
      middlewares = _ref.middlewares,
      children = _ref.children,
      _ref$styletron = _ref.styletron,
      styletron = _ref$styletron === undefined ? new styletronEngineAtomic.Client() : _ref$styletron;

  var mw = middlewares ? [NestedThemeProvider.middlewares.mapColorKeys].concat(middlewares) : null;
  return React__default.createElement(
    ThemeProvider,
    { theme: theme, middlewares: mw },
    React__default.createElement(
      StyletronProvider,
      { styletron: styletron },
      children
    )
  );
}

LibraryProvider.propTypes = {
  theme: PropTypes.object,
  styletron: PropTypes.object,
  middlewares: PropTypes.array
};

/* eslint-disable react/prop-types */

/**
 * HoC for styling a Styled component (or any component
 *   that intelligently response to a "style" prop)
 *
 * usage:
 *   const PinkButton = withStyle({color: 'pink'})(Button);
 *   <PinkButton />
 *
 */

var withStyle = function withStyle(style) {
  return function (RootComponent) {
    var _class, _temp;

    var WithStyleHoC = (_temp = _class = function (_React$Component) {
      inherits(WithStyleHoC, _React$Component);

      function WithStyleHoC() {
        classCallCheck(this, WithStyleHoC);
        return possibleConstructorReturn(this, (WithStyleHoC.__proto__ || Object.getPrototypeOf(WithStyleHoC)).apply(this, arguments));
      }

      createClass(WithStyleHoC, [{
        key: 'render',
        value: function render() {
          var _props = this.props,
              userStyle = _props.style,
              props = objectWithoutProperties(_props, ['style']),
              mergedStyle = userStyle ? assignDeep({}, style, userStyle) : style;

          return React__default.createElement(RootComponent, _extends({ style: mergedStyle }, props));
        }
      }]);
      return WithStyleHoC;
    }(React__default.Component), _class.displayName = 'WithStyle_' + getDisplayName(RootComponent), _temp);

    return WithStyleHoC;
  };
};

exports.Styled = Styled;
exports.ThemeProvider = NestedThemeProvider;
exports.StyletronProvider = StyletronProvider;
exports.LibraryProvider = LibraryProvider;
exports.RootThemeProvider = ThemeProvider;
exports.installLibraryMeta = installLibraryMeta;
exports.withStyle = withStyle;
