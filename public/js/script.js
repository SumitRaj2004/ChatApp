const socket = io();
const body = document.querySelector("body")
const chatSection = document.querySelector(".chat-section")
const chatContainer = document.querySelector(".chat-section .container");
const msgForm= document.querySelector(".sendMsg-form");
const msgInput = document.querySelector(".sendMsg-form .msg");

let user;
do{
    user = prompt("Enter Your Name : ")
}while(!user)

const chatScrollBottom = () =>{
    chatSection.scrollTop = chatSection.scrollHeight;
}
msgInput.focus();

socket.emit("sendUser", user)

socket.on("setUser", (user) => {
    const joinedText = document.createElement("p")
    joinedText.textContent = `${user} has joined the chat`;
    joinedText.classList.add("joined-text");
    chatContainer.appendChild(joinedText);
    chatScrollBottom()
})


msgForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msgValue = msgInput.value.trim()
    if (msgValue){
        socket.emit("sendMsg", msgValue, user);
        msgInput.value = ""
    }
})


socket.on("setOutgoingMsg", (msg, user) => {
    const outgoingChat = document.createElement("div");
    outgoingChat.classList.add("outgoing-chat");
    outgoingChat.innerHTML = 
        `
            <h2 class="outgoing-user">${user}</h2>
            <p class="outgoing-msg">${msg}</p>   
        `
    chatContainer.appendChild(outgoingChat);
    chatScrollBottom()    
})

socket.on("setIncomingMsg", (msg, user) => {
    const incomingChat = document.createElement("div");
    incomingChat.classList.add("incoming-chat");
    incomingChat.innerHTML = 
        `
            <h2 class="incoming-user">${user}</h2>
            <p class="incoming-msg">${msg}</p>   
        `
    chatContainer.appendChild(incomingChat)    ;
    chatScrollBottom();
})

socket.emit("leave", user)

socket.on("leftUser", (user) => {
    const leftText = document.createElement("p")
    leftText.textContent = `${user} has left the chat`;
    leftText.classList.add("left-text");
    chatContainer.appendChild(leftText);
})
