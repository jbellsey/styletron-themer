'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _merge2 = require('lodash/merge');

var _merge3 = _interopRequireDefault(_merge2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _defaultTheme = require('./default-theme');

var _defaultTheme2 = _interopRequireDefault(_defaultTheme);

var _middlewares = require('./middlewares');

var availableMiddlewares = _interopRequireWildcard(_middlewares);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Main wrapper component to enable theming of UI components.
 */
var ThemeProvider = (_temp = _class = function (_Component) {
  _inherits(ThemeProvider, _Component);

  _createClass(ThemeProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        theme: this.theme,
        middlewares: this.middlewares,
        installComponent: this.installComponent,
        applyMiddleware: this.applyMiddleware
      };
    }

    // pass these down on context

  }]);

  function ThemeProvider(props, context) {
    _classCallCheck(this, ThemeProvider);

    // do a deep merge with the library theme and the user's overrides. theming is
    // a one-shot deal; we do not currently support dynamic themes, although that
    // would be easy to add in the future.
    //
    var _this = _possibleConstructorReturn(this, (ThemeProvider.__proto__ || Object.getPrototypeOf(ThemeProvider)).call(this, props, context));

    _this.installComponent = function (componentName, componentTheme) {
      if (_this.installedComponents.indexOf(componentName) === -1) {
        _this.theme[componentName] = (0, _merge3.default)({}, componentTheme, _this.theme[componentName]);
        _this.installedComponents.push(componentName);
      }
    };

    _this.applyMiddleware = function (styleObj) {
      return _this.middlewares.reduce(function (styleObj, mw) {
        return mw(_this.theme, styleObj);
      }, styleObj);
    };

    _this.theme = (0, _merge3.default)({}, (0, _defaultTheme2.default)(), props.theme);
    _this.middlewares = props.middlewares || [];
    _this.installedComponents = [];
    return _this;
  }

  // each styled component will be added to the master theme, with a key that
  // matches its name:
  //    fullTheme = {meta:{}, Button:{}, Icon:{} ... }
  //


  _createClass(ThemeProvider, [{
    key: 'render',
    value: function render() {
      return _react2.default.Children.only(this.props.children);
    }
  }]);

  return ThemeProvider;
}(_react.Component), _class.childContextTypes = {
  theme: _react.PropTypes.object.isRequired,
  middlewares: _react.PropTypes.array,
  installComponent: _react.PropTypes.func,
  applyMiddleware: _react.PropTypes.func
}, _temp);

/**
 * propTypes
 * @property {object} theme - Theme object in json format. Used instead of css.
 * @property {array}  middlewares - Array of methods to manipulate the style object before it's passed to styletron.
 */

exports.default = ThemeProvider;
ThemeProvider.propTypes = {
  theme: _react.PropTypes.object,
  middlewares: _react.PropTypes.array
};

// provided as a convenient export for consumers. it is not
// used directly by this component.
//
ThemeProvider.middlewares = availableMiddlewares;