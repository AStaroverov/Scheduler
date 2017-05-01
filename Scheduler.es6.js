var raf = window.requestAnimationFrame

export default class Scheduler {
  constructor ({
    getTaskWrapperFunction,
    getFrameFunction,
    beforeFrame,
    afterFrame
  }) {
    this.tasks = []
    this.subscribesTasks = []
    this.frameTasks = []

    this._getTaskWrapperFunction = getTaskWrapperFunction
    this._getFrameFunction = getFrameFunction || (() => raf)
    this._beforeFrame = beforeFrame
    this._afterFrame = afterFrame

    this._runner = this._runner.bind(this)
    this._performTasks = this._performTasks.bind(this)
    this._startNextFrame = this._startNextFrame.bind(this)

    this._nextFrame = true
    this._stopScheduler = false
  }

  start () {
    this._stopScheduler = false
    this._runner()
  }

  stop () {
    this._stopScheduler = true
  }

  clearFrameTasks () {
    this.frameTasks = []
  }

  clearTasks () {
    this.tasks = []
  }

  clearSubscribesTasks () {
    this.subscribesTasks = []
  }

  addTask (task) {
    this.tasks.push(task)
  }

  subscribeTask (task) {
    this.subscribesTasks.push(task)
  }

  unsubscribeTask (fn) {
    var i = this.subscribesTasks.length

    while (i--) {
      if (this.subscribesTasks[i].handler === fn) {
        this.subscribesTasks.splice(i, 1)
        break
      }
    }
  }

  _startNextFrame () {
    if (this._afterFrame) {
      this._afterFrame.call(this)
    }

    this._nextFrame = true
  }

  _performTasks () {
    var task = this.frameTasks.shift()

    if (!task) return this._runner()

    var fn = this._getTaskWrapperFunction(task)

    if (fn) {
      fn(task.handler)
    } else {
      task.handler()
    }

    this._performTasks()
  }

  _runner () {
    if (this._stopScheduler) return

    var taskLength = this.tasks.length
    var subscribesTasksLength = this.subscribesTasks.length

    if (!this._nextFrame || taskLength + subscribesTasksLength === 0) {
      raf(this._runner)

      return
    }

    if (taskLength) {
      this.frameTasks = this.frameTasks.concat(this.tasks)
      this.tasks = []
    }

    if (subscribesTasksLength) {
      this.frameTasks = this.frameTasks.concat(this.subscribesTasks)
    }

    if (this._beforeFrame) {
      this._beforeFrame.call(this)
    }

    this._nextFrame = false
    this._getFrameFunction(this.frameTasks)(this._startNextFrame)
    this._performTasks()
  }
}
