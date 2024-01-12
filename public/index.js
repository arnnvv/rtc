function createConnection() {
  const socket = io();
  const sendBtn = document.querySelector("form button");
  const msgInput = document.getElementById("input");
  const allMessages = document.getElementById("messages");

  socket.on("message", (message) => {
    console.log(message);
    const p = document.createElement("p");
    p.innerText = message;
    allMessages.appendChild(p);
  });

  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const message = msgInput.value;
    console.log(message);
    socket.emit("message", message);
  });
}
