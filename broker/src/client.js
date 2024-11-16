const net = require("net");

let client;

export function connect(name, handleEvent) {
  client = net.createConnection("/tmp/picube.sock", () => {
    const onlineEvent = {
      for: 'broker',
      name: 'serviceOnline',
      data: {
        name,
      }
    };

    client.write(JSON.stringify(onlineEvent));
  });

  client.on("data", (data) => {
    let json;

    try {
      json = JSON.parse(data.toString());
    } catch (error) {
      // do nothing
    }

    if (!json) return;
    if (json.for !== name) return;

    handleEvent(json)
  });

  client.on("end", () => {
    console.log(`Disconnected ${name} from broker socket`);
  });
}