import * as net from "net";
import * as fs from "fs";
import { getBehaviors } from "./behaviors.js"

const sockExists = fs.existsSync("/tmp/picube.sock");
if (sockExists) fs.unlinkSync("/tmp/picube.sock");

const connections = [];

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

    connections.forEach(connection => connection.write(resEventString))
  })
}

const server = net.createServer((connection) => {
  connections.push(connection)

  connection.on("data", (data) => {
    const dataString = data.toString()
    const eventStrings = dataString.split('\r\n');

    eventStrings.forEach(event => handlEvent(event))
  });
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
