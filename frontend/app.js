// /frontend/app.js
import { callAPI } from './components/api.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('user-input');
  const messages = document.getElementById('messages');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userText = input.value.trim();
    if (!userText) return;

    // Show user message
    const userBubble = document.createElement('div');
    userBubble.className = 'user';
    userBubble.textContent = userText;
    messages.appendChild(userBubble);

    input.value = '';

    try {
      const reply = await callAPI([{ role: "user", content: userText }]);
      const botBubble = document.createElement('div');
      botBubble.className = 'bot';
      botBubble.textContent = reply.content;
      messages.appendChild(botBubble);
    } catch (err) {
      const errorBubble = document.createElement('div');
      errorBubble.className = 'error';
      errorBubble.textContent = '⚠️ callAPI failed';
      messages.appendChild(errorBubble);
    }
  });
});
