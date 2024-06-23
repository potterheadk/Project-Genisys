document.getElementById('fileUpload').addEventListener('change', handleFileUpload);
document.getElementById('chatForm').addEventListener('submit', sendQuery);
document.getElementById('clearButton').addEventListener('click', clearConversation);

function handleFileUpload(event) {
    let formData = new FormData();
    let files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        formData.append('pdfs', files[i]);
    }

    fetch('/process', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            document.querySelector('.chatContainer').style.display = 'block';
        }
    })
    .catch(error => console.error('Error:', error));

    // Prevent default form submission
    event.preventDefault();
}

function sendQuery(event) {
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
        let chatHistory = data.chat_history;

        // Clear existing chat messages before adding new ones
        clearChatMessages();

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
}

function createMessage(sender, message) {
    let messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');
    if (sender === 'user') {
        messageDiv.classList.add('user');
        messageDiv.innerHTML = `
            <div class="avatar">
                <img src="https://img.redbull.com/images/c_crop,x_510,y_0,h_1234,w_926/c_fill,w_450,h_600/q_auto:low,f_auto/redbullcom/2020/9/16/qsavzzs1hulerklkkzzp/ac-header">
            </div>
            <div class="message">${message}</div>
        `;
    } else {
        messageDiv.classList.add('bot');
        messageDiv.innerHTML = `
            <div class="avatar">
                <img src="https://i.ibb.co/cN0nmSj/Screenshot-2023-05-28-at-02-37-21.png">
            </div>
            <div class="message">${message}</div>
        `;
    }
    return messageDiv;
}

function clearConversation() {
    clearChatMessages(); // Clear displayed messages
    // Optionally, clear any stored data (arrays, variables, etc.)
    // Example: chatHistory = [];
    // Example: conversationId = null;
}

function clearChatMessages() {
    document.getElementById('chatGPTResponse').innerHTML = ''; // Clear displayed messages
}
