document.addEventListener("DOMContentLoaded", function () {
  const sendButton = document.getElementById("sendButton");
  const chat = document.getElementById("chat");
  const messageInput = document.getElementById("messageInput");
  const fontSelector = document.getElementById("fontSelector");

  sendButton.addEventListener("click", sendMessage);
  fontSelector.addEventListener("change", function () {
    chat.className = this.value; //div(chat) 전체
  });

  const ws = new WebSocket("ws://localhost:3000");

  ws.onopen = function () {
    console.log("WebSocket 서버에 연결됨.");
  };

  ws.onerror = function (error) {
    console.error("WebSocket 에러:", error);
  };

  ws.onmessage = function (event) {
    if (event.data instanceof Blob) {
      const reader = new FileReader();
      reader.onload = function () {
        const message = document.createElement("p");
        message.innerHTML = formatMessage(reader.result);
        chat.appendChild(message);
      };
      reader.readAsText(event.data);
    } else {
      const message = document.createElement("p");
      message.innerHTML =
        formatMessage(event.data) +
        ' <span class="timestamp">' +
        formatTimestamp(new Date()) +
        "</span>";
      chat.appendChild(message);
    }
  };

  function formatMessage(message) {
    message = message.replace(/'(.*?)'/g, "<span class='important'>$1</span>");
    return message;
  }

  function formatTimestamp(date) {
    return `${date.getFullYear()}년 ${(date.getMonth() + 1).toString().padStart(2, "0")}월 ${date.getDate().toString().padStart(2, "0")}일 ${date.getHours().toString().padStart(2, "0")}시 ${date.getMinutes().toString().padStart(2, "0")}분 ${date.getSeconds().toString().padStart(2, "0")}초`;
  }

  function sendMessage() {
    const message = messageInput.value;
    ws.send(message);
    messageInput.value = "";
  }
});
