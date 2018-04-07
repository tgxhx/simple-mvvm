import Compiler from './compiler'

class Watcher {
  constructor() {}
  
  notify(el, data) {
    Compiler(el, data)
  }
}

export default Watcher