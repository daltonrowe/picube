const ws281x = require("rpi-ws281x-native");
const { colorMath } = require("./lib/colorMath");
const { Lights } = require("./lights");
const { DefaultEffect } = require("./effects/default");
const { BreatheEffect } = require("./effects/breathe");
const { UpAndDownEffect } = require("./effects/upanddown");
const { NightRideEffect } = require("./effects/nightride");
const { RotateEffect } = require("./effects/rotate");

const numLeds = 42;

const channel = ws281x(numLeds, {
  stripType: "ws2812",
});

const effects = {
  default: DefaultEffect,
  breathe: BreatheEffect,
  upanddown: UpAndDownEffect,
  nightride: NightRideEffect,
  rotate: RotateEffect,
};

const lights = new Lights(42, ws281x, channel, colorMath, effects, 20);

let nightTime = true;
updateDaytime();

const updateDaytime = () => {
  const date = new Date();
  const hours = date.getHours();

  nightTime = hours > 20 || hours < 8 ? false : true;
};

// turns lights on or off at night
setInterval(() => {
  updateDaytime();

  if (lights.isPlaying() === false && !nightTime) lights.start();
  if (lights.isPlaying() === true && nightTime) lights.stop();
}, 5000);

lights.setEffect("rotate");

lights.start();

function exitGracefully() {
  lights.stop();
  ws281x.reset();
  process.exit();
}

process.on("SIGTERM", exitGracefully);
process.on("SIGINT", exitGracefully);
