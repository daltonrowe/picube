const net = require("net");
const fs = require("fs");

const sockExists = fs.existsSync("/tmp/picube.sock");
if (sockExists) fs.unlinkSync("/tmp/picube.sock");

const clients = new Map();
const subs = new Map();

const server = net.createServer((connection) => {
  connection.on("data", (data) => {
    let json;

    try {
      json = JSON.parse(data.toString());
    } catch (error) {
      // do nothing
    }

    if (!json) return;

    if (json.event === "registration" && !clients.get(json.name)) {
      clients.set(connection, json.name);
      console.log(`new client: ${json.name}`);
    }

    if (json.event === "subscribe") {

      subs.set(json.name, connection);
      console.log(`new client: ${json.name}`);
    }
  });
});

server.listen("/tmp/picube.sock", () => { });

function exitGracefully() {
  server.close();
  process.exit();
}

process.on("SIGTERM", exitGracefully);
process.on("SIGINT", exitGracefully);
