**COMPANY**: CODTECH IT SOLUTIONS

**NAME**: RESHMA M

**INTERN ID**: CT04DH1296

**DOMAIN**: FULL STACK WEB DEVELOPMENT

**DURATION**:4 WEEEKS

**MENTOR**: NEELA SANTOSH

# 💬 Realtime Chat App

This is a real-time chat application built using **Node.js**, **Express**, and **Socket.IO**. It allows multiple users to chat live in a shared chat room, with features like join/leave notifications and typing indicators.

---

## 📋 Description

The Realtime Chat Application is a full-stack web application designed to facilitate live communication between multiple users in a shared environment. Developed using modern web technologies such as Node.js, Express.js, and Socket.IO, this project demonstrates a practical implementation of real-time, bidirectional communication over web sockets. It also incorporates frontend technologies like HTML5, CSS3, and JavaScript, making it a complete and responsive application that showcases both backend and frontend development skills.

The primary objective of this task was to build a simple yet functional real-time chat interface that allows users to communicate instantly in a web browser without requiring page refreshes. Users can enter their name to join the chatroom, send and receive messages in real-time, view when others are typing, and get notified when a user joins or leaves the session. The chat server also maintains a live count of online users, which is dynamically updated as users connect or disconnect.

This project uses Socket.IO, a powerful JavaScript library that enables real-time, event-based communication between the client and server. The backend is powered by Express.js, which serves static files from the frontend and handles HTTP server setup and socket configuration. On the frontend, client-side Socket.IO connects users to the server and listens for various events such as message broadcasts, user typing updates, and join/leave notifications.

When a new user joins the chat, a system message is emitted to all connected clients indicating the arrival of a new participant. Similarly, when a user leaves the chat, the system broadcasts a departure message. The application supports a typing indicator to show when a user is composing a message, improving interactivity and user experience. All chat messages are timestamped and displayed in the UI in real time.

To enhance scalability and maintain a clean user interface, the server maintains a history of the last 50 messages in memory. This history is sent to new users upon connection so they can view recent conversations. Although this data is stored temporarily in memory for simplicity, the architecture can be extended to integrate a database like MongoDB or Firebase for persistent storage in real-world applications.

The UI is designed to be lightweight and responsive, making it accessible across different devices. The public directory contains all the frontend resources, including index.html, style.css, script.js, and color-themes.css. These files handle the user interface layout, dynamic message rendering, theme support, and real-time event handling.

This project aligns with industry use cases for collaborative tools, support systems, gaming chats, and educational platforms. It showcases essential skills such as setting up server-client communication, working with WebSocket APIs, managing events, and building an interactive UI. It also emphasizes clean folder structure, use of environment variables (if extended), and modular JavaScript coding practices.

Overall, the Realtime Chat App represents a foundational, beginner-friendly implementation of real-time networking principles in web development. It is an excellent base for future enhancements such as user authentication, private messaging, chat rooms, emoji support, file sharing, and database integration. This task demonstrates a full understanding of web application lifecycle — from server setup to deployment-ready frontend — making it suitable for academic evaluation, interviews, and real-world portfolio projects

---

## 📸 Output Screenshots

### 💬 Realtime Chat UI Preview



## 🧠 Features

- 🌐 Real-time messaging using Socket.IO
- 🔔 Join and leave notifications
- ✍️ Typing indicators
- 👤 Live user count display
- 🎨 Clean and responsive UI

---

## 🔧 Technologies Used

- Node.js
- Express.js
- Socket.IO
- HTML, CSS, JavaScript (Vanilla)

---

## 🚀 Project Structure

Realtime-chat-app/
│
├── server.js # Node.js + Express + Socket.IO backend
├── package.json # Project metadata & dependencies
├── package-lock.json
├── config.json # (Optional) local configuration
├── .gitignore
└── public/ # Frontend files served by Express
├── index.html
├── style.css
├── script.js
└── color-themes.css

---

## 🛠️ Setup & Run

### 1. Clone the repository
```bash
git clone https://github.com/reshmamaheshkumar/Realtime-chat-app.git
cd Realtime-chat-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the chat server
```bash
npm start
```

### 4. Open the app in your browser
```
http://localhost:3000
```

---

## 👩‍💻 Author

**Reshma Maheshkumar**  
GitHub: [@reshmamaheshkumar](https://github.com/reshmamaheshkumar)


