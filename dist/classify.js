'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _merge2 = require('lodash/merge');

var _merge3 = _interopRequireDefault(_merge2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.classifyComponent = classifyComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styletronUtils = require('styletron-utils');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * the classify decorator is used by APPLICATION authors more than component authors.
 * it provides a "classify" function as a prop. this can be used to put styles
 * directly into HTML elements or other components that were not created with <Styled>
 *
 * @example
 *| @classify
 *| class MyComponent extends Component {
 *|    render() {
 *|      return <h2 className={this.props.classify({color: 'red'})}>Red title</h2>
 *|    }
 *| }
 */

// decorator. this is preferred over the HoC below.
// example above.
//
var classify = classifyComponent;
exports.default = classify;

// standard HoC:
//  class MyComponent {...}
//  export classifyComponent(MyComponent)
//

function classifyComponent(CustomComponent) {
  var _class, _temp2;

  var ClassifiedComponent = (_temp2 = _class = function (_Component) {
    _inherits(ClassifiedComponent, _Component);

    function ClassifiedComponent() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, ClassifiedComponent);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ClassifiedComponent.__proto__ || Object.getPrototypeOf(ClassifiedComponent)).call.apply(_ref, [this].concat(args))), _this), _this.classifyStyles = function () {
        for (var _len2 = arguments.length, styletronObjects = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          styletronObjects[_key2] = arguments[_key2];
        }

        var allStyles = _merge3.default.apply(undefined, [{}].concat(styletronObjects)),
            themeProvider = _this.context.themeProvider;

        if (themeProvider) allStyles = themeProvider.applyMiddleware(allStyles);
        return (0, _styletronUtils.injectStylePrefixed)(_this.context.styletron, allStyles);
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    // we pull context from above


    _createClass(ClassifiedComponent, [{
      key: 'render',
      value: function render() {
        return _react2.default.createElement(CustomComponent, _extends({}, this.props, {
          classify: this.classifyStyles
        }));
      }
    }]);

    return ClassifiedComponent;
  }(_react.Component), _class.contextTypes = {

    // from StyletronProvider (see styletron-react)
    styletron: _propTypes2.default.object.isRequired,

    // from ThemeProvider
    themeProvider: _propTypes2.default.shape({
      applyMiddleware: _propTypes2.default.func.isRequired
    })
  }, _class.displayName = 'Classify_' + (0, _utils.getDisplayName)(CustomComponent), _temp2);

  return ClassifiedComponent;
}