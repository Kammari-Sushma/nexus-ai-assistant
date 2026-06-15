document.getElementById('send-btn').addEventListener('click', () => sendMessage());

// Also send message on 'Enter' key, but not if using shift+Enter
document.getElementById('user-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const funcSelect = document.getElementById('func-select');
    const chatDisplay = document.getElementById('chat-display');
    
    const message = inputField.value.trim();
    if (!message) return;
    
    // 1. Display user message
    chatDisplay.innerHTML += `<div class="message user">${message}</div>`;
    inputField.value = '';
    scrollToBottom(chatDisplay);

    // Add a simple "loading" message
    const loadingMessageId = 'loading-' + Date.now();
    chatDisplay.innerHTML += `<div class="message system" id="${loadingMessageId}"><i class="fas fa-spinner fa-spin"></i> Nexus is thinking...</div>`;
    scrollToBottom(chatDisplay);

    // 2. Fetch from backend API
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: funcSelect.value, message: message })
        });
        const data = await response.json();
        
        // Remove loading message
        document.getElementById(loadingMessageId).remove();

        // 3. Display AI response with feedback options
        chatDisplay.innerHTML += `
            <div class="message ai">
                ${data.response}
                <div class="feedback-buttons">
                    <button onclick="sendFeedback(this, 'helpful')">Helpful?</button>
                </div>
            </div>`;
    } catch (error) {
        // Remove loading message
        document.getElementById(loadingMessageId).remove();
        chatDisplay.innerHTML += `<div class="message system error"><i class="fas fa-exclamation-triangle"></i> Failed to retrieve response. Is the server running?</div>`;
    }
    scrollToBottom(chatDisplay);
}

function scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
}

async function sendFeedback(button, status) {
    const originalText = button.textContent;
    button.textContent = 'Feedback Received';
    button.disabled = true;
    button.style.color = '#04d361'; // Change accent green
    button.style.borderColor = '#04d361';

    // (The actual backend feedback logging logic is assumed to remain the same as the previous steps)
}