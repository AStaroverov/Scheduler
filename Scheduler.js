(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Scheduler = factory());
}(this, (function () { 'use strict';

var raf = window.requestAnimationFrame;

var Scheduler = function Scheduler (ref) {
  var getTaskWrapperFunction = ref.getTaskWrapperFunction;
  var getFrameFunction = ref.getFrameFunction;
  var beforeFrame = ref.beforeFrame;
  var afterFrame = ref.afterFrame;

  this.tasks = [];
  this.subscribesTasks = [];
  this.frameTasks = [];

  this._getTaskWrapperFunction = getTaskWrapperFunction || (function () { return void 0; });
  this._getFrameFunction = getFrameFunction || (function () { return raf; });
  this._beforeFrame = beforeFrame;
  this._afterFrame = afterFrame;

  this._runner = this._runner.bind(this);
  this._performTasks = this._performTasks.bind(this);
  this._startNextFrame = this._startNextFrame.bind(this);

  this._stopScheduler = false;
};

Scheduler.prototype.start = function start () {
  this._stopScheduler = false;
  this._runner();
};

Scheduler.prototype.stop = function stop () {
  this._stopScheduler = true;
};

Scheduler.prototype.clearFrameTasks = function clearFrameTasks () {
  this.frameTasks = [];
};

Scheduler.prototype.clearTasks = function clearTasks () {
  this.tasks = [];
};

Scheduler.prototype.clearSubscribesTasks = function clearSubscribesTasks () {
  this.subscribesTasks = [];
};

Scheduler.prototype.addTask = function addTask (task) {
  this.tasks.push(task);
};

Scheduler.prototype.subscribeTask = function subscribeTask (task) {
  this.subscribesTasks.push(task);
};

Scheduler.prototype.unsubscribeTask = function unsubscribeTask (fn) {
    var this$1 = this;

  var i = this.subscribesTasks.length;

  while (i--) {
    if (this$1.subscribesTasks[i].handler === fn) {
      this$1.subscribesTasks.splice(i, 1);
      break
    }
  }
};

Scheduler.prototype._startNextFrame = function _startNextFrame () {
  if (this._afterFrame) {
    this._afterFrame.call(this);
  }

  this._runner();
};

Scheduler.prototype._performTasks = function _performTasks () {
    var this$1 = this;

  var length = this.frameTasks.length;
  var i = 0;

  while (++i <= length) {
    var task = this$1.frameTasks[i - 1];
    var fn = this$1._getTaskWrapperFunction(task);

    if (fn) {
      fn(task.handler);
    } else {
      task.handler();
    }
  }
};

Scheduler.prototype._runner = function _runner () {
  if (this._stopScheduler) { return }

  var taskLength = this.tasks.length;
  var subscribesTasksLength = this.subscribesTasks.length;

  if (taskLength + subscribesTasksLength === 0) {
    raf(this._runner);

    return
  }

  this.frameTasks = [];

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

  this._getFrameFunction(this.frameTasks)(this._startNextFrame);
  this._performTasks();
};

return Scheduler;

})));
