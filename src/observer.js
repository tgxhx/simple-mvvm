import Compiler from './compiler'
import Watcher from './watcher'

function Observer(_vm, obj) {
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    defineReactive(_vm, obj, keys[i])
  }
}

function defineReactive(vm, obj, key) {
  let value = obj[key]
  const watcher = new Watcher()
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      return value
    },
    set(newValue) {
      if (newValue === value) return
      value = newValue
      watcher.notify(vm, vm.vDoms)
    }
  })
}

export default Observer