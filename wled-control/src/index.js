// https://kno.wled.ge/interfaces/json-api/

require("dotenv").config();

const { power, getState, getNodes } = require('./api')

function log() {
  if (process.env.LOG === '1') console.log(...arguments);
}

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
let int = 60_000;
let firstRun = true
let running = false;

setInterval(async () => {
  if (running) return;
  running = true

  const now = Date.now();
  updateNighttime();

  if (firstRun) {
    log('First run, getting state.');
    log(`Host Node: ${process.env.HOST_NODE}`);
    firstRun = false
    state.host = await getState()
    state.nodes = await getNodes()

    console.log(`Host State On: ${state.host.on}`);

  }

  const updatePromises = []

  if (now - last > int) {
    const shouldBeOn = state.nightTime
    const isOn = state.host.on
    const needsPowerChanged = shouldBeOn != isOn

    log(`shouldBeOn: ${shouldBeOn} | isOn: ${isOn} | needsPowerChanged: ${needsPowerChanged}`);

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