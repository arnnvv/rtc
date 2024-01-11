function createConnection() {
  const socket = io();
  const sndBtn = document.getElementById("sndBtn");
  const msgInput = document.getElementById("message");

  sndBtn.addEventListener("click", (e) => {
    const message = msgInput.value;
    console.log(message);
  });
}
