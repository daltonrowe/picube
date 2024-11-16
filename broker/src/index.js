const net = require("net");
const fs = require("fs");
const { getBehaviors } = require("./behaviors");

const sockExists = fs.existsSync("/tmp/picube.sock");
if (sockExists) fs.unlinkSync("/tmp/picube.sock");

const server = net.createServer((connection) => {
  connection.on("data", (data) => {
    let json;

    try {
      json = JSON.parse(data.toString());
    } catch (error) {
      // do nothing
    }

    if (!json) return;
    if (json.for !== 'broker') return;

    const responseEvents = getBehaviors(json)

    responseEvents.forEach(res => {
      connection.write(JSON.stringify(res))
    })
  });
});

server.listen("/tmp/picube.sock", () => { });

function exitGracefully() {
  server.close();
  process.exit();
}

process.on("SIGTERM", exitGracefully);
process.on("SIGINT", exitGracefully);
