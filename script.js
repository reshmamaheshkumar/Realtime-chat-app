class ChatApp {
    constructor() {
        this.socket = io();
        this.currentUser = null;
        this.typingTimer = null;
        this.isTyping = false;

        this.initializeElements();
        this.attachEventListeners();
        this.setupSocketListeners();
    }

    initializeElements() {
        // Screens
        this.joinScreen = document.getElementById('join-screen');
        this.chatScreen = document.getElementById('chat-screen');
        
        // Forms and inputs
        this.joinForm = document.getElementById('join-form');
        this.usernameInput = document.getElementById('username-input');
        this.messageForm = document.getElementById('message-form');
        this.messageInput = document.getElementById('message-input');
        
        // UI elements
        this.messagesContainer = document.getElementById('messages-container');
        this.userCount = document.getElementById('user-count');
        this.typingIndicator = document.getElementById('typing-indicator');
        this.leaveBtn = document.getElementById('leave-btn');
        this.sendBtn = document.getElementById('send-btn');
    }

    attachEventListeners() {
        // Join form
        this.joinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.joinChat();
        });

        // Message form
        this.messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        // Leave button
        this.leaveBtn.addEventListener('click', () => {
            this.leaveChat();
        });

        // Typing indicator
        this.messageInput.addEventListener('input', () => {
            this.handleTyping();
        });

        // Enter key for username
        this.usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.joinChat();
            }
        });

        // Focus username input on load
        window.addEventListener('load', () => {
            this.usernameInput.focus();
        });
    }

    setupSocketListeners() {
        // Connection established
        this.socket.on('connect', () => {
            console.log('Connected to server');
        });

        // Message history
        this.socket.on('message-history', (messages) => {
            this.clearWelcomeMessage();
            messages.forEach(message => {
                this.displayMessage(message);
            });
        });

        // New message
        this.socket.on('new-message', (data) => {
            this.clearWelcomeMessage();
            this.displayMessage(data);
        });

        // User joined
        this.socket.on('user-joined', (data) => {
            this.displayMessage(data);
        });

        // User left
        this.socket.on('user-left', (data) => {
            this.displayMessage(data);
        });

        // User count update
        this.socket.on('user-count', (count) => {
            this.updateUserCount(count);
        });

        // Typing indicator
        this.socket.on('user-typing', (data) => {
            this.showTypingIndicator(data);
        });

        // Connection error
        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            this.showNotification('Connection error. Please try again.', 'error');
        });

        // Disconnect
        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.showNotification('Disconnected from server', 'warning');
        });
    }

    joinChat() {
        const username = this.usernameInput.value.trim();
        
        if (!username) {
            this.showNotification('Please enter a username', 'error');
            return;
        }

        if (username.length > 20) {
            this.showNotification('Username must be 20 characters or less', 'error');
            return;
        }

        this.currentUser = username;
        this.socket.emit('user-join', username);
        
        // Switch to chat screen
        this.joinScreen.classList.add('hidden');
        this.chatScreen.classList.remove('hidden');
        
        // Focus message input
        setTimeout(() => {
            this.messageInput.focus();
        }, 100);
    }

    sendMessage() {
        const message = this.messageInput.value.trim();
        
        if (!message) return;
        
        if (message.length > 500) {
            this.showNotification('Message must be 500 characters or less', 'error');
            return;
        }

        // Send message
        this.socket.emit('send-message', { message });
        
        // Clear input
        this.messageInput.value = '';
        
        // Stop typing indicator
        this.stopTyping();
    }

    leaveChat() {
        if (confirm('Are you sure you want to leave the chat?')) {
            this.socket.disconnect();
            this.currentUser = null;
            
            // Switch back to join screen
            this.chatScreen.classList.add('hidden');
            this.joinScreen.classList.remove('hidden');
            
            // Clear messages and reset
            this.messagesContainer.innerHTML = `
                <div class="welcome-message">
                    <h3>Welcome to the Chat!</h3>
                    <p>Start chatting with other users in real-time</p>
                </div>
            `;
            this.usernameInput.value = '';
            this.messageInput.value = '';
            
            // Reconnect
            this.socket.connect();
            
            // Focus username input
            setTimeout(() => {
                this.usernameInput.focus();
            }, 100);
        }
    }

    displayMessage(data) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${data.type}`;
        
        // Add 'own' class for current user's messages
        if (data.socketId === this.socket.id && data.type === 'user') {
            messageDiv.classList.add('own');
        }

        let messageHTML = '';
        
        if (data.type === 'system') {
            messageHTML = `
                <div class="message-content">
                    ${this.escapeHtml(data.message)}
                </div>
            `;
        } else {
            const isOwn = messageDiv.classList.contains('own');
            messageHTML = `
                <div class="message-header">
                    <span class="username">${this.escapeHtml(data.username)}</span>
                    <span class="timestamp">${data.timestamp}</span>
                </div>
                <div class="message-content">
                    ${this.escapeHtml(data.message)}
                </div>
            `;
        }

        messageDiv.innerHTML = messageHTML;
        this.messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        this.scrollToBottom();
    }

    handleTyping() {
        if (!this.isTyping) {
            this.isTyping = true;
            this.socket.emit('typing', { typing: true });
        }

        clearTimeout(this.typingTimer);
        this.typingTimer = setTimeout(() => {
            this.stopTyping();
        }, 1000);
    }

    stopTyping() {
        if (this.isTyping) {
            this.isTyping = false;
            this.socket.emit('typing', { typing: false });
        }
        clearTimeout(this.typingTimer);
    }

    showTypingIndicator(data) {
        const indicator = document.getElementById('typing-indicator');
        
        if (data.typing) {
            indicator.innerHTML = `<span>${this.escapeHtml(data.username)} is typing...</span>`;
            indicator.classList.remove('hidden');
        } else {
            indicator.classList.add('hidden');
        }
    }

    updateUserCount(count) {
        const text = count === 1 ? '1 user online 🟢' : `${count} users online 🟢`;
        this.userCount.textContent = text;
    }

    clearWelcomeMessage() {
        const welcomeMessage = this.messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '1000',
            animation: 'slideIn 0.3s ease-out',
            maxWidth: '300px'
        });

        // Set background color based on type
        const colors = {
            error: '#ef4444',
            warning: '#f59e0b',
            success: '#10b981',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Add to page
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the chat app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});