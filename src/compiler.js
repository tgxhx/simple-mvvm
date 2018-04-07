let tpl

function Compiler(selector, data) {
  const el = document.querySelector(selector)
  if (el === null) return
  
  tpl = tpl || el.outerHTML
  let html = tpl.replace(/{{(.*)}}/g, (match, key) => data.hasOwnProperty(key) ? data[key] : '')
  el.outerHTML = html
}

export default Compiler