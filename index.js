import Mvvm from './src/index.js'

window.mvvm = new Mvvm({
  el: '#app',
  data: {
   message: 'hello world!'
  },
  render() {
    return (
      <div>{this.state.message}</div>
    )
  }
})