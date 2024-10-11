// https://kno.wled.ge/interfaces/json-api/

const fs = require('fs');
const { power, loadStates } = require('./api')
const config = JSON.parse(fs.readFileSync('../config.json'));

const stateTarget = {
  nightTime: false,
  wleds: {},
}

for (const wled of config.wleds) {
  stateTarget.wleds[wled.label] = { ...wled }
  stateTarget.wleds[wled.label].state = {}
}

const state = new Proxy(stateTarget, {
  get(_target, _prop, _receiver) {
    return Reflect.get(...arguments);
  },
})

const updateNighttime = () => {
  const date = new Date();
  const hours = date.getHours();

  state.nightTime = hours > 20 || hours < 8 ? false : true;
};

updateNighttime();

let last = Date.now()
let int = 15_000;
let firstRun = true
let running = false;

setInterval(async () => {
  if (running) return;
  running = true

  const now = Date.now();
  updateNighttime();

  if (firstRun) {
    firstRun = false
    await loadStates(state.wleds)
  }

  const updatePromises = []

  if (now - last > int) {
    for (const label in state.wleds) {
      const wled = state.wleds[label]

      const shouldBeOn = state.nightTime
      const isOn = wled.state.on
      const needsPowerChanged = shouldBeOn != isOn

      if (needsPowerChanged) {
        const updatePromise = new Promise(async (resolve, _reject) => {
          wled.state = await power(wled.url, shouldBeOn);
          resolve();
        })

        updatePromises.push(updatePromise);
      }
    }

    last = now
  }

  if (updatePromises.length) {
    await Promise.allSettled(updatePromises);
  }

  running = false
}, 1000);