(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Mvvm = factory());
}(this, (function () { 'use strict';

  function setProp(target, prop, value) {
    if (prop === 'className') {
      target.setAttribute('class', value);
    } else if (prop === 'style') {
      let cssText = '';
      for (let key in value) {
        cssText += `${key}:${value[key]};`;
      }
      target.setAttribute(prop, cssText);
    } else {
      target.setAttribute(prop, value);
    }
  }

  function setProps($el, props) {
    Object.keys(props).forEach(prop => {
      setProp($el, prop, props[prop]);
    });
  }

  function removeProps(target, prop) {
    if (prop === 'className') {
      target.removeAttribute('class');
    } else {
      target.removeAttribute(prop);
    }
  }

  function updateProps(target, newProps = {}, oldProps = {}) {
    const props = Object.assign({}, oldProps, newProps);
    Object.keys(props).forEach(prop => {
      const newProp = newProps[prop];
      const oldProp = oldProps[prop];
      if (!newProp) {
        removeProps(target, prop);
      } else if (!oldProp || newProp !== oldProp) {
        setProp(target, prop, newProp);
      }
    });
  }

  function addEvents(vm, target, props) {
    Object.keys(props).forEach(prop => {
      // 以on开头的是事件监听
      if (/^on/.test(prop)) {
        const type = prop.slice(2).toLowerCase();
        target.addEventListener(type, props[prop].bind(vm), false);
        target.removeAttribute(prop.toLowerCase());
      }
    });
  }

  let _vm;
  function Compiler(node, vm) {
    if (typeof vm !== 'number') {
      _vm = vm;
    }
    if (typeof node === 'string' || typeof node === 'number') {
      return document.createTextNode(node);
    }
    const $el = document.createElement(node.type);
    const props = node.props || {};
    setProps($el, props);
    addEvents(_vm, $el, props);
    node.children
      .map(Compiler)
      .forEach($el.appendChild.bind($el));
    return $el
  }

  function changed(node1, node2) {
    return typeof node1 !== typeof node2 ||
      (typeof node1 === 'string' || typeof node1 === 'number') && node1 !== node2 ||
      node1.type !== node2.type
  }

  function updateElement(vm, $parent, newNode, oldNode, index = 0) {
    if (!oldNode) {
      $parent.appendChild(
        Compiler(newNode, vm)
      );
    } else if (!newNode) {
      $parent.removeChild(
        $parent.childNodes[index]
      );
    } else if (changed(newNode, oldNode)) {
      $parent.replaceChild(
        Compiler(newNode, vm),
        $parent.childNodes[index]
      );
    } else if (newNode.type) {
      const target = $parent.children[index];
      updateProps(
        target,
        newNode.props,
        oldNode.props
      );
      
      const newLength = newNode.children.length;
      const oldLength = oldNode.children.length;
      for (let i = 0; i < newLength || i < oldLength; i++) {
        updateElement(
          vm,
          // 作为外层父元素的时候，childNodes会获取到空白节点，所以使用children
          target,
          newNode.children[i],
          oldNode.children[i],
          i
        );
      }
    }
  }

  class Watcher {
    constructor() {}
    
    notify(vm, vDoms) {
      vDoms.old = vDoms.new;
      vDoms.new = vm.render();
      updateElement(vm, vm.root, vDoms.new, vDoms.old);
      // Compiler(el, data)
    }
  }

  function Observer(_vm, obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(_vm, obj, keys[i]);
    }
  }

  function defineReactive(vm, obj, key) {
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
        watcher.notify(vm, vm.vDoms);
      }
    });
  }

  class Mvvm {
    constructor(options) {
      this.vDoms = {
        old: null,
        new: null
      };
      this.init(options);
    }
    
    init(options) {
      this.state = options.state;
      this.initState(options.state);
      this.initEvent(options.methods);
      this.root = document.querySelector(options.el);
      this.render = options.render;
      this.vDoms.new = this.render();
      this.initElement(this.root, this.vDoms.new);
    }
    
    initState(data) {
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        Proxy(this, 'state', keys[i]);
      }
      new Observer(this, data);
    }
    
    initEvent(methods = {}) {
      Object.keys(methods).forEach(method => {
        this[method] = methods[method];
      });
    }
    
    initElement(root, initNode) {
      updateElement(this, root, initNode);
    }
    
    static createElement(type, props = {}, ...children) {
      return {type, props, children};
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
