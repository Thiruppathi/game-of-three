const emitMsg = msg => {
  msg !== "404" ? appendMsg(msg) : gameOver();
};

const appendMsg = msg => {
  const parent = document.querySelector("#events");
  let shouldScroll =
    parent.scrollTop + parent.clientHeight === parent.scrollHeight;
  const el = document.createElement("li");
  el.setAttribute("class", "got__list-item ");
  el.innerHTML = msg;
  parent.appendChild(el);
  if (!shouldScroll) {
    parent.scrollTop = parent.scrollHeight;
  }
};

function scrollToBottom() {
  parent.scrollTop = parent.scrollHeight;
}

const gameOver = () => {
  document.querySelector(".new-game-wrapper").style.display = "flex";
  document.querySelector("#fabArea").style.display = "none";
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
