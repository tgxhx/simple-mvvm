import Compiler from './compiler'
import updateElement from './diff'

class Watcher {
  constructor() {}
  
  notify(vm, vDoms) {
    vDoms.old = vDoms.new
    vDoms.new = vm.render()
    updateElement(vm, vm.root, vDoms.new, vDoms.old)
    // Compiler(el, data)
  }
}

export default Watcher