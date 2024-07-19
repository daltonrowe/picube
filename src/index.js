const ws281x = require("rpi-ws281x-native");
const { Lights } = require('./lights')
const { DefaultEffect } = require('./effects/default')
const { BreatheEffect } = require('./effects/breathe')
const { UpAndDownEffect } = require('./effects/upanddown')
const { NightRideEffect } = require('./effects/nightride')

const numLeds = 42;

const channel = ws281x(numLeds, {
  stripType: "ws2812",
});

const effects = {
  default: DefaultEffect,
  breathe: BreatheEffect,
  upanddown: UpAndDownEffect,
  nightride: NightRideEffect
}

const lights = new Lights(42, ws281x, channel, effects, 20)

const tasks = [
  {
    name: "Check Schedule",
    last: Date.now(),
    every: 1000,
    run: () => {
      // do nothing
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

lights.setEffect('nightride')
lights.start()

function exit() {
  lights.stop();
  ws281x.reset()
  process.exit();
}

process.on('exit', exit);
process.on('SIGINT', exit);
process.on('SIGTERM', exit);
