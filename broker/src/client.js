import * as net from "net"

let client
let send

export function connect(name, handleEvent) {
  client = net.createConnection("/tmp/picube.sock", () => {
    const onlineEvent = {
      for: 'broker',
      from: name,
      name: 'serviceOnline',
    };

    client.write(JSON.stringify(onlineEvent));
  })

  client.on('error', function (ex) {
    console.log(`Error from client ${name} communicating with broker socket`);
  });

  client.on("data", (data) => {
    console.log('clientdata', name, data.toString());

    let json;

    try {
      json = JSON.parse(data.toString());
    } catch (error) {
      // do nothing
    }

    if (!json) return;
    if (json.for !== name) return;

    if (handleEvent) handleEvent(json)
  });

  client.on("end", () => {
    console.log(`Disconnected client ${name} from broker socket`);
  });

  if (!send) {
    send = (json) => {
      json.from = name;
      json.for = 'broker'

      try {
        client.write(`${JSON.stringify(json)}\r\n`)
      } catch (error) {
        console.log(`Error from client ${name} writing to broker socket`);
      }
    }
  }

  return send
}