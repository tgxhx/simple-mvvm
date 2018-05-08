function setProp(target, prop, value) {
  if (prop === 'className') {
    target.setAttribute('class', value)
  } else if (prop === 'style') {
    let cssText = ''
    for (let key in value) {
      cssText += `${key}:${value[key]};`
    }
    target.setAttribute(prop, cssText)
  } else {
    target.setAttribute(prop, value)
  }
}

function setProps($el, props) {
  Object.keys(props).forEach(prop => {
    setProp($el, prop, props[prop])
  })
}

function removeProps(target, prop) {
  if (prop === 'className') {
    target.removeAttribute('class')
  } else {
    target.removeAttribute(prop)
  }
}

function updateProps(target, newProps = {}, oldProps = {}) {
  const props = Object.assign({}, oldProps, newProps)
  Object.keys(props).forEach(prop => {
    const newProp = newProps[prop]
    const oldProp = oldProps[prop]
    if (!newProp) {
      removeProps(target, prop)
    } else if (!oldProp || newProp !== oldProp) {
      setProp(target, prop, newProp)
    }
  })
}

export {setProps, updateProps}