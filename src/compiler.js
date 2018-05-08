import {setProps} from './diff-props'
import addEvents from './events'
let _vm
function Compiler(node, vm) {
  if (typeof vm !== 'number') {
    _vm = vm
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return document.createTextNode(node);
  }
  const $el = document.createElement(node.type)
  const props = node.props || {}
  setProps($el, props)
  addEvents(_vm, $el, props)
  node.children
    .map(Compiler)
    .forEach($el.appendChild.bind($el))
  return $el
}

export default Compiler