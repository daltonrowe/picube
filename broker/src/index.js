import * as net from "net";
import * as fs from "fs";
import { getBehaviors } from "./behaviors.js"

const sockExists = fs.existsSync("/tmp/picube.sock");
if (sockExists) fs.unlinkSync("/tmp/picube.sock");

const connections = new Map()

function handlEvent(event) {
  let json;

  try {
    json = JSON.parse(event);
  } catch (error) {
    // do nothing
  }

  if (!json || !json.for || json.for !== 'broker') return;

  const responseEvents = getBehaviors(json)

  responseEvents.forEach(res => {
    const resEvent = { ...res, from: 'broker' }
    const resEventString = JSON.stringify(resEvent)

    const connectionsArray = Array.from(connections)
    console.log(connectionsArray.length);

    connectionsArray.forEach(([, connection]) => {
      connection.write(resEventString)
    })
  })
}

const server = net.createServer((connection) => {
  const stamp = Date.now()
  connections.set(stamp, connection)

  connection.on("data", (data) => {
    const dataString = data.toString()
    const eventStrings = dataString.split('\r\n');

    eventStrings.forEach(event => handlEvent(event))
  });

  connection.on('close', () => {
    connections.delete(stamp)
  })
});

server.listen("/tmp/picube.sock", () => {
  console.log('☎️ Broker listening...');
});

function exitGracefully() {
  server.close();
  process.exit();
}

process.on("SIGTERM", exitGracefully);
process.on("SIGINT", exitGracefully);
