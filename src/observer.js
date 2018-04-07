import Compiler from './compiler'
import Watcher from './watcher'
let vm

function Observer(_vm, obj) {
  vm = _vm
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i])
  }
}

function defineReactive(obj, key) {
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
      watcher.notify(vm.$options.el, vm._data)
    }
  })
}

export default Observer