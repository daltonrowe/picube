const net = require("net");
const fs = require("fs");

const sockExists = fs.existsSync("/tmp/picube.sock");
if (sockExists) fs.unlinkSync("/tmp/picube.sock");

const server = net.createServer((connection) => {
  connection.on("data", (data) => {
    console.log("Data from client:", data.toString());
  });

  connection.write(JSON.stringify({ taco: "bell" }));
});

server.listen("/tmp/picube.sock", () => {});

function exitGracefully() {
  server.close();
  process.exit();
}

process.on("SIGTERM", exitGracefully);
process.on("SIGINT", exitGracefully);
