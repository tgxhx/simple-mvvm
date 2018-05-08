function addEvents(vm, target, props) {
  Object.keys(props).forEach(prop => {
    // 以on开头的是事件监听
    if (/^on/.test(prop)) {
      const type = prop.slice(2).toLowerCase()
      target.addEventListener(type, props[prop].bind(vm), false)
      target.removeAttribute(prop.toLowerCase())
    }
  })
}

export default addEvents