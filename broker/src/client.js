const net = require("net");

const client = net.createConnection("/tmp/picube.sock", () => {
  const payload = {
    event: "registration",
    name: "picubeTestClient",
  };

  client.write(JSON.stringify(payload));
});

client.on("end", () => {
  console.log("disconnected from server");
});
