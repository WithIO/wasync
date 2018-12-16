(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("wasync", [], factory);
	else if(typeof exports === 'object')
		exports["wasync"] = factory();
	else
		root["wasync"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/debounce.js":
/*!*************************!*\
  !*** ./src/debounce.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Debounce = Debounce;
exports.ObjectDebounce = ObjectDebounce;
var DEFAULT_WAIT = 300;
var DEFAULT_PROP = '$wasyncDebounce';
var INACTIVE = 1;
var WAITING = 2;
var RUNNING = 3;
/**
 * Implements the Async Debounce pattern.
 *
 * It helps you call asynchronous functions only once at a time.
 *
 * See the README
 *
 * @param wait {number} Milliseconds to wait before running
 * @constructor
 */

function Debounce() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$wait = _ref.wait,
      wait = _ref$wait === void 0 ? DEFAULT_WAIT : _ref$wait;

  var self = this;
  self.state = INACTIVE;
  self.next = undefined;
  self.timeout = null;
  /**
   * Generates an asynchronously debounced function
   *
   * @param validate {function} Validation function. If the return value is
   *                            false-ish then the operation is canceled,
   *                            otherwise the return value is passed as first
   *                            parameter of run()
   * @param prepare {function} Immediately invoked in order to prepare the
   *                           UI for the imminent load (like enable the
   *                           loader)
   * @param run {function} The function that does the action. It can return
   *                       a promise. It will be called with the output of
   *                       validate() after wait milliseconds
   * @param success {function} Called with the value returned/resolved by
   *                           run() in case of success
   * @param failure {function} Called with the exception/rejection value
   *                           raised by run()
   * @param cleanup {function} Does the opposite of prepare(), when all
   *                           is finished
   * @returns {Function} Returned function is a composition of all provided
   *                     hooks, in such a way that each of the hook is called
   *                     exactly when it should be (according to the logic
   *                     explained in the README).
   */

  self.func = function (_ref2) {
    var validate = _ref2.validate,
        prepare = _ref2.prepare,
        run = _ref2.run,
        success = _ref2.success,
        failure = _ref2.failure,
        cleanup = _ref2.cleanup;

    if (!run) {
      throw new Error('"run" function is not defined! That is the point of this ' + 'Debounce class, so you probably are doing something wrong');
    }

    return function () {
      var stack = {
        this: this,
        args: arguments,
        hooks: {
          validate: validate,
          prepare: prepare,
          run: run,
          success: success,
          failure: failure,
          cleanup: cleanup
        }
      };
      stack.params = self.validate(stack);

      if (!stack.params) {
        return;
      }

      if (self.state === INACTIVE) {
        self.prepare(stack);
      }

      self.next = stack;

      if (self.state !== RUNNING) {
        self.wait();
      }
    };
  };
  /**
   * Runs the validation hook. If no hook is provided then just return an
   * empty object.
   *
   * @private
   * @param validate {function|undefined} Validation hook
   * @param this_ {object} Object to bind the validation hook to
   * @param args {array} Arguments to call the function with
   */


  self.validate = function (_ref3) {
    var validate = _ref3.hooks.validate,
        this_ = _ref3.this,
        args = _ref3.args;
    var v = {};

    if (validate) {
      v = validate.apply(this_, args);
    }

    return v;
  };
  /**
   * Runs the prepare hook, if defined
   *
   * @private
   * @param prepare {function|undefined} Prepare hook
   * @param this_ {object} Object to bind the prepare hook to
   */


  self.prepare = function (_ref4) {
    var prepare = _ref4.hooks.prepare,
        this_ = _ref4.this;

    if (prepare) {
      prepare.apply(this_);
    }
  };
  /**
   * Go into waiting state and call the run function after the given amount
   * of time. If a timeout was already running, cancel it.
   *
   * @private
   */


  self.wait = function () {
    self.state = WAITING;
    clearTimeout(self.timeout);
    self.timeout = setTimeout(function () {
      self.run();
    }, wait);
  };
  /**
   * Runs the run hook, wait for the result and then trigger the finishing
   * sequence (re-run if new run available, otherwise success/failure hooks
   * then cleanup).
   *
   * It is expected that the run hook might not always return a Promise, or
   * might just return a Promise-like but with not the exact API we need. For
   * this reason, it passes through Promise.resolve()/Promise.reject().
   *
   * @private
   */


  self.run = function () {
    self.state = RUNNING;
    var stack = this.next;
    var this_ = stack.this,
        params = stack.params,
        _stack$hooks = stack.hooks,
        run = _stack$hooks.run,
        success = _stack$hooks.success,
        failure = _stack$hooks.failure,
        cleanup = _stack$hooks.cleanup;
    var prom;

    try {
      prom = Promise.resolve(run.call(this_, params));
    } catch (e) {
      prom = Promise.reject(e);
    }

    prom.then(function () {
      if (self.next === stack && success) {
        success.apply(this_, arguments);
      }
    }).catch(function () {
      if (self.next === stack && failure) {
        failure.apply(this_, arguments);
      }
    }).finally(function () {
      if (self.next === stack) {
        try {
          if (cleanup) {
            cleanup.apply(this_);
          }
        } finally {
          self.state = INACTIVE;
        }
      } else {
        setTimeout(function () {
          return self.run();
        }, 0);
      }
    });
  };
}
/**
 * Independently of how you define your "classes" in JS ('cause you got a hell
 * lot of options there), if you use Debounce.func() directly you'll only get
 * one instance of Debounce. Which means that if you have two instances of your
 * "object" at once then they are going to conflict and this is going to cause
 * trouble.
 *
 * This is then a convenience class that will automatically create a new
 * instance every time the calling "this" changes. The instance will be added
 * as a property to "this" so it can be retrieved by further calls.
 *
 * @param wait {number} Milliseconds to wait before running
 * @param prop {string} Name of the property to store the Debounce instance
 *                      into
 * @constructor
 */


function ObjectDebounce() {
  var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref5$wait = _ref5.wait,
      wait = _ref5$wait === void 0 ? DEFAULT_WAIT : _ref5$wait,
      _ref5$prop = _ref5.prop,
      prop = _ref5$prop === void 0 ? DEFAULT_PROP : _ref5$prop;

  var self = this;
  /**
   * Wrapper around Debounce.func() that will automatically handle Debounce
   * instances.
   *
   * @param validate {function}
   * @param prepare {function}
   * @param run {function}
   * @param success {function}
   * @param failure {function}
   * @param cleanup {function}
   * @returns {function(): *}
   */

  self.func = function (_ref6) {
    var validate = _ref6.validate,
        prepare = _ref6.prepare,
        run = _ref6.run,
        success = _ref6.success,
        failure = _ref6.failure,
        cleanup = _ref6.cleanup;
    return function () {
      if (!this[prop]) {
        this[prop] = new Debounce({
          wait: wait
        });
      }

      var deb = this[prop];
      var func = deb.func({
        validate: validate,
        prepare: prepare,
        run: run,
        success: success,
        failure: failure,
        cleanup: cleanup
      });
      return func.apply(this, arguments);
    };
  };
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Debounce", {
  enumerable: true,
  get: function get() {
    return _debounce.Debounce;
  }
});
Object.defineProperty(exports, "ObjectDebounce", {
  enumerable: true,
  get: function get() {
    return _debounce.ObjectDebounce;
  }
});

var _debounce = __webpack_require__(/*! ./debounce.js */ "./src/debounce.js");

/***/ })

/******/ });
});
//# sourceMappingURL=wasync.js.map