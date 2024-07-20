const ws281x = require("rpi-ws281x-native");

const channel = ws281x(60, { stripType: "ws2812" });

const colorsArray = channel.array;
for (let i = 0; i < channel.count; i++) {
  if (i % 2) {
    colorsArray[i] = 0xff0000;
  } else {
    colorsArray[i] = 0x0000ff;
  }
}

ws281x.render();
