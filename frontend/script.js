console.log("script");
class Event {
  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
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
      console.log("new message");
      break;
    default:
      alert("unsuppported message");
  }
};

const sendEvent = (eventName, payload) => {
  const event = new Event(eventName, payload);

  conn.send(JSON.stringify(event));
};

const changeChatRoom = () => {
  let newchat = document.getElementById("chatroom");
  if (newchat !== null && newchat.value !== selectedChat) {
    console.log(newchat);
  }
  return false;
};

const sendMessage = () => {
  let newMessage = document.getElementById("message");
  if (newMessage !== null) {
    sendEvent("send_message", newMessage.value);
  }
  return false;
};

window.onload = () => {
  document.getElementById("chatroom-selection").onsubmit = changeChatRoom;
  document.getElementById("chatroom-message").onsubmit = sendMessage;

  if (window["WebSocket"]) {
    console.log("supports websockets");

    conn = new WebSocket("ws://" + document.location.host + "/ws");

    conn.onmessage = (evt) => {
      const eventData = JSON.parse(evt.data);

      const event = Object.assign(new Event(), eventData);

      routeEvent(event);
    };
  } else {
    alert("Browser does not support websockets");
  }
};
