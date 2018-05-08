import createElement from './compiler'
import {updateProps} from './diff-props'

function changed(node1, node2) {
  return typeof node1 !== typeof node2 ||
    (typeof node1 === 'string' || typeof node1 === 'number') && node1 !== node2 ||
    node1.type !== node2.type
}

function updateElement(vm, $parent, newNode, oldNode, index = 0) {
  if (!oldNode) {
    $parent.appendChild(
      createElement(newNode, vm)
    )
  } else if (!newNode) {
    $parent.removeChild(
      $parent.childNodes[index]
    )
  } else if (changed(newNode, oldNode)) {
    $parent.replaceChild(
      createElement(newNode, vm),
      $parent.childNodes[index]
    )
  } else if (newNode.type) {
    const target = $parent.children[index]
    updateProps(
      target,
      newNode.props,
      oldNode.props
    )
    
    const newLength = newNode.children.length
    const oldLength = oldNode.children.length
    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement(
        vm,
        // 作为外层父元素的时候，childNodes会获取到空白节点，所以使用children
        target,
        newNode.children[i],
        oldNode.children[i],
        i
      )
    }
  }
}

export default updateElement