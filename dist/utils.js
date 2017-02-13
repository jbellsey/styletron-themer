'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getDisplayName = getDisplayName;
exports.isObject = isObject;
function getDisplayName(Component) {
  return Component.displayName || Component.name || (typeof Component === 'string' ? Component : 'Component');
}

var hasDocument = (typeof document === 'undefined' ? 'undefined' : _typeof(document)) === 'object' && document !== null,
    hasWindow = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window !== null && window.self === window,
    isBrowser = hasDocument && hasWindow;

exports.isBrowser = isBrowser;
function isObject(item) {
  return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === "object" && !Array.isArray(item) && item !== null;
}