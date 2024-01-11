function createConnection() {
  const socket = io();
  const sndBtn = document.getElementById("sndBtn");
  const msgInput = document.getElementById("message");
  const allMessages = document.getElementById("messages");
  socket.on("message", (message) => {
    console.log(message);
    const p = document.createElement("p");
    p.innerText = message;
    allMessages.appendChild(p);
  });

  sndBtn.addEventListener("click", (e) => {
    const message = msgInput.value;
    console.log(message);
    socket.emit("message", message);
  });
}
