const chatForm = document.getElementById('chat-form');
const chatMessage= document.querySelector('.chat-messages');
const roomName= document.getElementById('room-name');
const userList= document.getElementById('users');
// var Qs = require('querystring')

// Get username and room frolm the URL
const { username, room }=Qs.parse(location.search,{
ignoreQueryPrefix:true
});

const socket = io();

// join Chatroom
socket.emit('joinRoom', {username, room});

// get room and users

socket.on('roomUsers',({room, users})=>{
  outputRoomName(room);
  outputUsers(users);
})

// message from the server
socket.on('message', message=>{
    console.log(message);
    outputMessage(message);

    // scoll down
    chatMessage.scrollTop= chatMessage.scrollHeight;

});

// message submit
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    // Get message 
    const msg = e.target.elements.msg.value;

    // emit message to the server
    socket.emit('message',msg); 
    // clear input
    e.target.elements.msg.value= '';
    e.target.elements.msg.focus();
});
// outputMessage
 function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
 }
//  add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}
//  add USERS to DOM
function outputUsers(users) {
  userList.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}

