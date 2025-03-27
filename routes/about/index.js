// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:3000/__hmr");

// Listen for messages
socket.addEventListener("message", (event) => {
  console.log("", event.data);
});
