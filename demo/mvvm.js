(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Mvvm = factory());
}(this, (function () { 'use strict';

  let tpl;

  function Compiler(selector, data) {
    const el = document.querySelector(selector);
    if (el === null) return
    
    tpl = tpl || el.outerHTML;
    let html = tpl.replace(/{{(.*)}}/g, (match, key) => data.hasOwnProperty(key) ? data[key] : '');
    el.outerHTML = html;
  }

  class Watcher {
    constructor() {}
    
    notify(el, data) {
      Compiler(el, data);
    }
  }

  let vm;

  function Observer(_vm, obj) {
    vm = _vm;
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  }

  function defineReactive(obj, key) {
    let value = obj[key];
    const watcher = new Watcher();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        return value
      },
      set(newValue) {
        if (newValue === value) return
        value = newValue;
        watcher.notify(vm.$options.el, vm._data);
      }
    });
  }

  class Mvvm {
    constructor(options) {
      let data = options.data;
      this._data = data;
      this.$options = options;
      this.initData(data);
      Compiler(options.el, data);
    }
    
    initData(data) {
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        Proxy(this, '_data', keys[i]);
      }
      new Observer(this, data);
    }
  }

  const defineOptions = {
    enumerable: true,
    configurable: true,
  };

  function Proxy(target, sourceKey, key) {
    defineOptions.get = function () {
      return this[sourceKey][key]
    };
    defineOptions.set = function (newVal) {
      this[sourceKey][key] = newVal;
    };
    Object.defineProperty(target, key, defineOptions);
  }

  return Mvvm;

})));
