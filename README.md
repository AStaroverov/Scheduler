# Scheduler

### Why? 
TODO

### Usage

```
import Scheduler from 'Scheduler'

type Task = {
  handler: Function,
  priority?: number - some props for choose task priorty
}

function getTaskWrapperFunction (task: Task): Function {
  const { priority } = task
  
  
}
function getFrameFunction () { ... }
function beforeFrame () { ... }
function afterFrame () { ... }

const instance = new Scheduler({
  getTaskWrapperFunction,
  getFrameFunction,
  beforeFrame,
  afterFrame
})



