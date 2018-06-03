const emitMsg = (msg, msgType = "") => {
  msg !== "404" ? appendMsg(msg, msgType) : gameOver();
};

const appendMsg = (msg, msgType = "") => {
  const parent = document.querySelector("#events");
  let shouldScroll =
    parent.scrollTop + parent.clientHeight === parent.scrollHeight;
  const el = document.createElement("li");
  el.setAttribute("class", `animated pulse got__list-item ${msgType}`);
  el.innerHTML = msg;
  parent.appendChild(el);
  if (!shouldScroll) {
    parent.scrollTop = parent.scrollHeight;
  }
};

const avatar = avatarStyle => {
  const avatarElement = document.querySelector("#avatar");
  avatarElement.src = `../img/${avatarStyle}.svg`;
  avatarElement.setAttribute("class", "avatar show animated fadeIn");
};

const fireWorks = msg => {
  document.querySelector(".fireWorks").style.display = "block";
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

const newGame = () => {
  location.reload(true);
};

emitMsg("Welcome to Game of Three!", "alert");

const sock = io();
sock.on("message", emitMsg);
sock.on("fireWorks", fireWorks);
sock.on("avatar", avatar);

addButtonListeners();
