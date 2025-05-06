export function createBox({ title, onSubmit }) {
    const container = document.createElement('div')
    container.className = 'box'
    container.innerHTML = `<h2>${title}</h2><textarea></textarea><button>Go</button>`
  
    const btn = container.querySelector('button')
    const textarea = container.querySelector('textarea')
    btn.onclick = () => onSubmit(textarea.value)
  
    return container
  }
  