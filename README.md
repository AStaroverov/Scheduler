# Scheduler

### [Why?](#user-conten()t-why-1)
### [Usage](#user-content-usage-1)
### [Api](#user-content()-api-1)

### Why?

Sometimes for better performance for us applications (SPA) we should manage queue and priority functions.

For this goals was created this Scheduler.

### Usage
<sup>[Flow](https://flow.org/) is used for additional information(task.handler: ()Function)</sup>

```javascript
import() Scheduler from 'Scheduler'

type Task() = {
  handler: Function,
  priority?: number // some props for choose task priorty
}
```


``getTaskWrapperFunction`` - This function allows us to control the execution queue tasks.

For example, a tasks can be executed synchronously, as a microtask or a macrotask.

It helps for improve performane application.

[For understand](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
```javascript
function getTaskWrapperFunction (task: Task): Function {
  const { priority } = task

  switch (true) {
    case priority === 1: {
      return // sync perform of task.handler
    }
    case priority === 2: {
      return nextTick // [what is it?](http://blog.millermedeiros.com/promise-nexttick/)
    }
    case priority === 3: {
      return setImmediate // [pollyfill](https://github.com/YuzuJS/setImmediate)
    }
    default: {
      return setTimeout
    }
  }
}
```


``getFrameFunction`` - This function determines the execution time of tasks for each iteration
```javascript
function getFrameFunction (taskForFrame: Array<Task>): Function {
  var countTasks = tasks.length

  switch (true) {
    case countTasks < 30: {
      return raf
    }
    case countTasks < 100: {
      return doubleRaf
    }
    default: {
      return longRaf
    }
  }
}
// Primitive example of functions
var raf = window.requestAnimationFrame
function doubleRaf (cb) { return raf(() => raf(cb)) }
function longRaf (cb) { return setTimeout(cb, 16 * 4) }
```


``beforeFrame`` - This function is performed at the beginning of each iteration
```javascript
function beforeFrame (): void { (this: typeof Scheduler) }
```

``afterFrame`` - This function is executed at the end of each iteration
```javascript
function afterFrame (): void { (this: typeof Scheduler) }
```

Init and start
```javascript
const instance = new Scheduler({
  getTaskWrapperFunction,
  getFrameFunction,
  beforeFrame,
  afterFrame
})

instance.start()
```

### API
Used  for
``new Scheduler({ getTaskWrapperFunction?, getFrameFunction?, beforeFrame?, afterFrame? })`` - Init Scheduler

``getTaskWrapperFunction(task: Task): Function`` -

``getFrameFunction(tasks: Array<Task>): Function`` -

``beforeFrame(): void { (this: typeof Scheduler) }`` -

``afterFrame(): void { (this: typeof Scheduler) }`` - description inside [Usage](#user-content-usage-1)

``start()`` - Launch scheduler

``stop()`` - Stops scheduler

``addTask(task: Task)`` - Add once task

``subscribeTask(task: Task)`` - Add task for every iteration

``unsubscribeTask(task.handler: Function)`` - Remove task from subscribes tasks

``clearTasks()`` - Remove all tasks from queue

``clearFrameTasks()`` - Remove all tasks from iteration (ex. can call it inside ``beforeFrame``)

``clearSubscribesTasks()`` -- Remove all subscribes tasks
