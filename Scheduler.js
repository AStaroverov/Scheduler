(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Scheduler"] = factory();
	else
		root["Scheduler"] = factory();
})(this, function() {
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var raf = window.requestAnimationFrame;

var Scheduler = function () {
  function Scheduler(_ref) {
    var getTaskWrapperFunction = _ref.getTaskWrapperFunction,
        getFrameFunction = _ref.getFrameFunction,
        beforeFrame = _ref.beforeFrame,
        afterFrame = _ref.afterFrame;

    _classCallCheck(this, Scheduler);

    this.tasks = [];
    this.subscribesTasks = [];
    this.frameTasks = [];

    this._getTaskWrapperFunction = getTaskWrapperFunction || function () {
      return void 0;
    };
    this._getFrameFunction = getFrameFunction || function () {
      return raf;
    };
    this._beforeFrame = beforeFrame;
    this._afterFrame = afterFrame;

    this._runner = this._runner.bind(this);
    this._performTasks = this._performTasks.bind(this);
    this._startNextFrame = this._startNextFrame.bind(this);

    this._nextFrame = true;
    this._stopScheduler = false;
  }

  Scheduler.prototype.start = function start() {
    this._stopScheduler = false;
    this._runner();
  };

  Scheduler.prototype.stop = function stop() {
    this._stopScheduler = true;
  };

  Scheduler.prototype.clearFrameTasks = function clearFrameTasks() {
    this.frameTasks = [];
  };

  Scheduler.prototype.clearTasks = function clearTasks() {
    this.tasks = [];
  };

  Scheduler.prototype.clearSubscribesTasks = function clearSubscribesTasks() {
    this.subscribesTasks = [];
  };

  Scheduler.prototype.addTask = function addTask(task) {
    this.tasks.push(task);
  };

  Scheduler.prototype.subscribeTask = function subscribeTask(task) {
    this.subscribesTasks.push(task);
  };

  Scheduler.prototype.unsubscribeTask = function unsubscribeTask(fn) {
    var i = this.subscribesTasks.length;

    while (i--) {
      if (this.subscribesTasks[i].handler === fn) {
        this.subscribesTasks.splice(i, 1);
        break;
      }
    }
  };

  Scheduler.prototype._startNextFrame = function _startNextFrame() {
    if (this._afterFrame) {
      this._afterFrame.call(this);
    }

    this._nextFrame = true;
  };

  Scheduler.prototype._performTasks = function _performTasks() {
    var task = this.frameTasks.shift();

    if (!task) return this._runner();

    var fn = this._getTaskWrapperFunction(task);

    if (fn) {
      fn(task.handler);
    } else {
      task.handler();
    }

    this._performTasks();
  };

  Scheduler.prototype._runner = function _runner() {
    if (this._stopScheduler) return;

    var taskLength = this.tasks.length;
    var subscribesTasksLength = this.subscribesTasks.length;

    if (!this._nextFrame || taskLength + subscribesTasksLength === 0) {
      raf(this._runner);

      return;
    }

    if (taskLength) {
      this.frameTasks = this.frameTasks.concat(this.tasks);
      this.tasks = [];
    }

    if (subscribesTasksLength) {
      this.frameTasks = this.frameTasks.concat(this.subscribesTasks);
    }

    if (this._beforeFrame) {
      this._beforeFrame.call(this);
    }

    this._nextFrame = false;
    this._getFrameFunction(this.frameTasks)(this._startNextFrame);
    this._performTasks();
  };

  return Scheduler;
}();

/* harmony default export */ __webpack_exports__["default"] = (Scheduler);

/***/ })
/******/ ]);
});
