//  fileName : server.js
// Example using the http module
const http = require("http");
const { SerialPort } = require("serialport");
const dgram = require("dgram");

// COM port settings
const COM_PORT = "COM6"; // Replace with your COM port
const BAUD_RATE = 115200; // Replace with your baud rate

// Network settings
const DEST_IP = "192.168.224.125"; // Replace with the IP address of your destination
const DEST_PORT = 3000; // Replace with the port of your destination

// Create UDP socket
const socket = dgram.createSocket("udp4");

// Open COM port
const port = new SerialPort({
  path: "COM6",
  baudRate: 115200,
  dataBits: 8,
  stopBits: 1,
  parity: "none",
});

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Set the response headers
  res.writeHead(200, { "Content-Type": "text/html" });

  // Write the response content
  res.write("<h1>Hello, Node.js HTTP Server!</h1>");
  res.end();
});

// Specify the port to listen on
const porti = 3000;

// Start the server
server.listen(porti, () => {
  port.on("open", function () {
    console.log("COM port opened");
  });

  port.on("data", function (data) {
    // Send data over the network
    socket.send(data, 0, data.length, DEST_PORT, DEST_IP, function (err) {
      if (err) {
        console.error("Error sending data:", err);
      } else {
        console.log("Sent:", data);
      }
    });
  });

  socket.on("error", function (err) {
    console.error("Socket error:", err);
  });

  // Close the socket and COM port when exiting
  process.on("SIGINT", function () {
    console.log("Exiting...");
    socket.close();
    port.close();
    process.exit();
  });
});
