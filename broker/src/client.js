const net = require("net");

const client = net.createConnection("/tmp/picube.sock", () => {
  client.write("Hello, Unix Socket");
});

client.on("data", (data) => {
  console.log(data.toString());
  console.log(JSON.parse(data));
});

client.on("end", () => {
  console.log("disconnected from server");
});
