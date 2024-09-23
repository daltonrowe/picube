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

const tasks = [
  {
    name: "Adjust Brightness for Sleeptime",
    last: Date.now(),
    every: 5000,
    run: () => {
      const date = new Date();
      const hours = date.getHours();

      let shouldBePlaying = true;
      if (hours > 20 || hours < 9) shouldBePlaying = false;

      if (lights.isPlaying() === false && shouldBePlaying) lights.start();
      if (lights.isPlaying() === true && !shouldBePlaying) lights.stop();
    },
  },
];

setInterval(() => {
  tasks.forEach((task) => {
    const now = Date.now();
    const since = now - task.last;

    if (since > task.every) {
      task.last = now;
      task.run();
    }
  });
}, 500);

lights.setEffect("rotate");

lights.start();

function exitGracefully() {
  lights.stop();
  ws281x.reset();
  process.exit();
}

process.on("SIGTERM", exitGracefully);
process.on("SIGINT", exitGracefully);
