const emitMsg = msg => {
  msg !== "404" ? appendMsg(msg) : gameOver();
};

const appendMsg = msg => {
  const parent = document.querySelector("#events");
  const el = document.createElement("li");
  el.innerHTML = msg;
  parent.appendChild(el);
};

const gameOver = () => {
  document.querySelector(".chat-wrapper").style.display = "flex";
  document.querySelector(".button-wrapper").style.display = "none";
};

const addButtonListeners = () => {
  ["minusOne", "zero", "plusOne"].forEach(id => {
    const button = document.getElementById(id);
    button.addEventListener("click", () => {
      sock.emit("turn", button.value);
    });
  });
};

emitMsg("Welcome to Game of Three!");

const sock = io();
sock.on("message", emitMsg);

addButtonListeners();
