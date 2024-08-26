document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.overlay');

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
    }

});

document.getElementById('chatForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Disable form while processing request
    document.getElementById('chatForm').classList.add('disabled');

    let question = document.getElementById('chatGPTQuestion').value;
    if (question.trim() === '') {
        // Re-enable form
        document.getElementById('chatForm').classList.remove('disabled');
        return;
    }

    let userMessage = createMessage('user', question);
    document.getElementById('chatGPTResponse').appendChild(userMessage);

    fetch('/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question }),
    })
    .then(response => response.json())
    .then(data => {
        // Clear existing chat messages before adding new ones
        clearChatMessages();

        let chatHistory = data.chat_history;
        chatHistory.forEach(entry => {
            let messageElement = createMessage(entry.sender, entry.message);
            document.getElementById('chatGPTResponse').appendChild(messageElement);
        });
        document.getElementById('chatGPTQuestion').value = '';

        // Re-enable form after processing request
        document.getElementById('chatForm').classList.remove('disabled');
    })
    .catch(error => {
        console.error('Error:', error);

        // Re-enable form on error
        document.getElementById('chatForm').classList.remove('disabled');
    });
});

function handleFileUpload(event) {
    const fileInput = event.target;
    const files = fileInput.files;

    // Display "Processing" message
    const processingMessage = "Processing files...";
    appendBotMessage(processingMessage);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('pdfs', files[i]);
    }

    fetch('/process', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        const readyMessage = "Ready to answer questions based on uploaded files.";
        appendBotMessage(readyMessage);
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMessage = "Error processing files. Please try again.";
        appendBotMessage(errorMessage);
    });
}

function createMessage(sender, text) {
    const message = document.createElement('div');
    message.classList.add('message', sender);

    const img = document.createElement('img');
    img.src = sender === 'user' ? 'static/user-avatar.png' : 'static/bot-avatar.png';
    img.alt = sender === 'user' ? 'User Avatar' : 'Bot Avatar';
    img.width = 30;
    img.height = 30;

    const messageText = document.createElement('span');
    messageText.textContent = text;

    message.appendChild(img);
    message.appendChild(messageText);
    return message;
}

function clearChatMessages() {
    const chatContainer = document.getElementById('chatGPTResponse');
    while (chatContainer.firstChild) {
        chatContainer.removeChild(chatContainer.firstChild);
    }
}

function clearConversation() {
    clearChatMessages();
    // Optional: Append a "Chat cleared" message if needed
}

function appendBotMessage(message) {
    const messageElement = createMessage('bot', message);
    document.getElementById('chatGPTResponse').appendChild(messageElement);
}

