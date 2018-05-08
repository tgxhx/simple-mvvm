import Observer from './observer'
import updateElement from './diff'

class Mvvm {
  constructor(options) {
    this.vDoms = {
      old: null,
      new: null
    }
    this.init(options)
  }
  
  init(options) {
    this.state = options.state
    this.initState(options.state)
    this.initEvent(options.methods)
    this.root = document.querySelector(options.el)
    this.render = options.render
    this.vDoms.new = this.render()
    this.initElement(this.root, this.vDoms.new)
  }
  
  initState(data) {
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      Proxy(this, 'state', keys[i])
    }
    new Observer(this, data)
  }
  
  initEvent(methods = {}) {
    Object.keys(methods).forEach(method => {
      this[method] = methods[method]
    })
  }
  
  initElement(root, initNode) {
    updateElement(this, root, initNode)
  }
  
  static createElement(type, props = {}, ...children) {
    return {type, props, children};
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