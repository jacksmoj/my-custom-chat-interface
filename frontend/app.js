import { callAPI } from './components/api.js'

// === Layout setup ===
const body = document.body
body.style.margin = '0'
body.style.display = 'flex'
body.style.flexDirection = 'column'
body.style.height = '100vh'

// === Message area ===
const chatLog = document.createElement('div')
chatLog.id = 'chat-log'
chatLog.style.flex = '1'
chatLog.style.overflowY = 'auto'
chatLog.style.padding = '1rem'
chatLog.style.display = 'flex'
chatLog.style.flexDirection = 'column'
chatLog.style.gap = '1rem'
chatLog.style.background = '#f6f6f6'
body.appendChild(chatLog)

// === Prompt composer ===
const composer = document.createElement('div')
composer.style.display = 'flex'
composer.style.padding = '1rem'
composer.style.gap = '0.5rem'
composer.style.borderTop = '1px solid #ccc'
composer.style.background = '#fff'
composer.style.position = 'sticky'
composer.style.bottom = '0'
composer.style.zIndex = '10'

const textarea = document.createElement('textarea')
textarea.style.flex = '1'
textarea.style.height = '60px'
textarea.placeholder = 'Type a message...'

const button = document.createElement('button')
button.innerText = 'Go'

button.onclick = async () => {
  const text = textarea.value.trim()
  if (!text) return
  textarea.value = ''

  // === Prompt bubble ===
  const userMsg = document.createElement('div')
  userMsg.innerText = text
  userMsg.style.alignSelf = 'flex-end'
  userMsg.style.background = '#228B22' // forest green
  userMsg.style.color = '#ccffcc'      // pale light green
  userMsg.style.padding = '0.75rem'
  userMsg.style.borderRadius = '10px'
  userMsg.style.whiteSpace = 'pre-wrap'
  chatLog.appendChild(userMsg)

  // === AI placeholder bubble ===
  const aiMsg = document.createElement('div')
  aiMsg.innerText = '⏳ Thinking...'
  aiMsg.style.alignSelf = 'flex-start'
  aiMsg.style.background = '#ffc0cb' // pink
  aiMsg.style.color = '#900'         // red
  aiMsg.style.padding = '0.75rem'
  aiMsg.style.borderRadius = '10px'
  aiMsg.style.whiteSpace = 'pre-wrap'
  aiMsg.style.display = 'flex'
  aiMsg.style.flexDirection = 'column'
  chatLog.appendChild(aiMsg)

  chatLog.scrollTop = chatLog.scrollHeight

  try {
    const reply = await callAPI(text)
    const replyText = reply.result || '⚠️ No response'
    aiMsg.innerText = ''

    // === Extract python code block (if any) ===
    const codeMatch = replyText.match(/```python\s*([\s\S]*?)```/)
    const displayText = codeMatch ? replyText.replace(codeMatch[0], '').trim() : replyText

    if (displayText) {
      const textBubble = document.createElement('div')
      textBubble.innerText = displayText
      aiMsg.appendChild(textBubble)
    }

    if (codeMatch) {
      const code = codeMatch[1].trim()

      const codeBox = document.createElement('pre')
      codeBox.innerText = code
      codeBox.style.background = '#111'
      codeBox.style.color = '#0f0'
      codeBox.style.padding = '0.5rem'
      codeBox.style.borderRadius = '6px'
      codeBox.style.whiteSpace = 'pre-wrap'

      const runBtn = document.createElement('button')
      runBtn.innerText = '▶ Run Code'
      runBtn.style.marginTop = '0.5rem'

      const outputBox = document.createElement('pre')
      outputBox.style.marginTop = '0.5rem'
      outputBox.style.padding = '0.5rem'
      outputBox.style.background = '#000'
      outputBox.style.color = '#0f0'
      outputBox.style.borderRadius = '6px'
      outputBox.style.whiteSpace = 'pre-wrap'

      runBtn.onclick = async () => {
        try {
          const resp = await fetch('http://localhost:5051/run-python', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          })
          const result = await resp.json()
          outputBox.innerText = result.output || '⚠️ No output'
        } catch (err) {
          outputBox.innerText = '❌ Error: ' + err.message
        }
      }

      aiMsg.appendChild(codeBox)
      aiMsg.appendChild(runBtn)
      aiMsg.appendChild(outputBox)
    }
  } catch (err) {
    aiMsg.innerText = '❌ ' + err.message
    aiMsg.style.background = '#fdd'
  }

  chatLog.scrollTop = chatLog.scrollHeight
}

composer.appendChild(textarea)
composer.appendChild(button)
body.appendChild(composer)
