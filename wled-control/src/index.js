// https://kno.wled.ge/interfaces/json-api/

require("dotenv").config();

const { power, getState, getNodes } = require('./api')

const stateTarget = {
  nightTime: false,
  host: {},
  nodes: {}
}

const state = new Proxy(stateTarget, {
  get(_target, _prop, _receiver) {
    return Reflect.get(...arguments);
  },
})

const updateNighttime = () => {
  const date = new Date();
  const hours = date.getHours();

  state.nightTime = hours > 18 ? false : true;
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
    state.host = await getState()
    state.nodes = await getNodes()
  }

  const updatePromises = []

  if (now - last > int) {
    const shouldBeOn = state.nightTime
    const isOn = state.host.on
    const needsPowerChanged = shouldBeOn != isOn

    if (needsPowerChanged) {
      const updatePromise = new Promise(async (resolve, _reject) => {
        state.host = await power(shouldBeOn);
        resolve();
      })

      updatePromises.push(updatePromise);
    }

    last = now
  }

  // need to wait for all the network reqs to complete
  // esp32 can be slow to respond
  if (updatePromises.length) {
    await Promise.allSettled(updatePromises);
  }

  running = false
}, 1000);