const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');

// Get username and room form url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

console.log(username, room);

const socket = io();

// Listen for chat message
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users}) => {
  outputRoomName(room);
  outputUsers(users);
})

socket.on('message', message => {
  console.log(message);
  // append the message in the DOM
  outputMessage(message);
})

// message submit
chatForm.addEventListener('submit', (e) => {
  // prevent reload behavior
  e.preventDefault();

  // in form there's a text with id msg get it's value
  const message = e.target.msg.value;
  
  // Emit a message to a server
  socket.emit('chatMessage', message);

  // clear input 
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

const outputMessage = message => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  chatMessages.appendChild(div);

  // after sending a message scroll to the end
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add room name to dom 
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  usersList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}
