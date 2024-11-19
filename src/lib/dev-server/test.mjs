

console.log('this is test');
const wsUrl = "ws://localhost:5173"; // Vite HMR WebSocket URL

console.log(`Connecting to ${wsUrl}...`);
const socket = new WebSocket(wsUrl, 'vite-hmr');

// Event: Connection opened
socket.addEventListener("open", () => {
  console.log("Connected to the WebSocket server.");
  // Optional: Send a test message
  socket.send(JSON.stringify({ type: "ping" }));
});

// Event: Message received
socket.addEventListener("message", (event) => {
  console.log("Message received:", event.data);
});

// Event: Connection closed
socket.addEventListener("close", (event) => {
  console.log(`Connection closed: Code=${event.code}, Reason=${event.reason}`);
});

// Event: Error occurred
socket.addEventListener("error", (error) => {
  console.error("WebSocket error:", error);
});

// Optional: Close connection after some time
setTimeout(() => {
  console.log("Closing WebSocket connection...");
  // socket.close();
}, 10000); // Adjust the timeout as needed

