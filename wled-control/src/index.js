// https://kno.wled.ge/interfaces/json-api/

const fs = require('fs');
const path = require('path');
const { power, loadStates, getNodes } = require('./api')

const stateTarget = {
  nightTime: false,
  wleds: {
    rswled: {
      url: 'http://rswled.local',
      label: 'rswled'
    }
  },
}

const state = new Proxy(stateTarget, {
  get(_target, _prop, _receiver) {
    return Reflect.get(...arguments);
  },
})

const updateNighttime = () => {
  const date = new Date();
  const hours = date.getHours();

  // state.nightTime = hours > 20 || hours < 8 ? false : true;
  state.nightTime = !state.nightTime
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