console.log("script");
class Event {
  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
  }
}

class SendMessageEvent {
  constructor(message, from) {
    this.message = message;
    this.from = from;
  }
}

class NewMessageEvent {
  constructor(message, from, sent) {
    this.message = message;
    this.from = from;
    this.sent = sent;
  }
}

class changeChatRoomEvent {
  constructor(name) {
    this.name = name;
  }
}

let conn;
let selectedChat = "general";
const routeEvent = (event) => {
  if (event.type === undefined) {
    alert("no type field in the event");
  }

  switch (event.type) {
    case "new_message":
      const messageEvent = Object.assign(new NewMessageEvent(), event.payload);
      appendChatMessage(messageEvent);
      break;
    default:
      alert("unsuppported message");
  }
};

const appendChatMessage = (messageEvent) => {
  var date = new Date(messageEvent.sent);
  const formattedMsg = `${date.toLocaleString()}: ${messageEvent.message}`;

  textarea = document.getElementById("chatmessages");
  textarea.innerHTML = textarea.innerHTML + "\n" + formattedMsg;
  textarea.scrollTop = textarea.scrollHeight;
};

const sendEvent = (eventName, payload) => {
  const event = new Event(eventName, payload);

  conn.send(JSON.stringify(event));
};

const changeChatRoom = (event) => {
  event.preventDefault(); // Prevent form submission
  let newchat = document.getElementById("chatroom");
  if (newchat !== null && newchat.value !== selectedChat) {
    selectedChat = newchat.value;
    header = document.getElementById("chat-header").innerHTML =
      "Currently in chatroom: " + selectedChat;

    let changeEvent = new changeChatRoomEvent(selectedChat);

    sendEvent("change_room", changeEvent);

    textarea = document.getElementById("chatmessages");
    textarea.innerHTML = `You changed room into: ${selectedChat}`;
  }
  return false;
};

const login = () => {
  let formData = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };
  fetch("login", {
    method: "post",
    body: JSON.stringify(formData),
    mode: "cors",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw "unauthorized";
      }
    })
    .then((data) => {
      connectWebsocket(data.otp);
    })
    .catch((e) => {
      alert(e);
    });
  return false;
};

const connectWebsocket = (otp) => {
  if (window["WebSocket"]) {
    console.log("supports websockets");

    conn = new WebSocket("ws://" + document.location.host + "/ws?otp=" + otp);

    conn.onopen = (evt) => {
      document.getElementById("connection-header").innerHTML =
        "Connected to WebSocket: true";
    };

    conn.onclose = (evt) => {
      document.getElementById("connection-header").innerHTML =
        "Connected to WebSocket: false";
    };

    conn.onmessage = (evt) => {
      const eventData = JSON.parse(evt.data);

      const event = Object.assign(new Event(), eventData);

      routeEvent(event);
    };
  } else {
    alert("Browser does not support websockets");
  }
};

const sendMessage = () => {
  let newMessage = document.getElementById("message");
  if (newMessage !== null) {
    let outgoingEvent = new SendMessageEvent(newMessage.value, "percy");
    sendEvent("send_message", outgoingEvent);
  }
  return false;
};

window.onload = () => {
  document.getElementById("chatroom-selection").onsubmit = changeChatRoom;
  document.getElementById("chatroom-message").onsubmit = sendMessage;
  document.getElementById("login-form").onsubmit = login;
};
