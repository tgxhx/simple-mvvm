import Mvvm from './src/index.js'

window.mvvm = new Mvvm({
  el: '#dark',
  data: {
   message: 'hello world!'
  }
})

document.querySelector('#input').addEventListener('input', (e) => {
  mvvm.artist = e.target.value
})