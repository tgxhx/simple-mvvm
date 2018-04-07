import Observer from './observer'
import Compiler from './compiler'

class Mvvm {
  constructor(options) {
    let data = options.data
    this._data = data
    this.$options = options
    this.initData(data)
    Compiler(options.el, data)
  }
  
  initData(data) {
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      Proxy(this, '_data', keys[i])
    }
    new Observer(this, data)
  }
}

const defineOptions = {
  enumerable: true,
  configurable: true,
}

function Proxy(target, sourceKey, key) {
  defineOptions.get = function () {
    return this[sourceKey][key]
  }
  defineOptions.set = function (newVal) {
    this[sourceKey][key] = newVal
  }
  Object.defineProperty(target, key, defineOptions)
}
export default Mvvm