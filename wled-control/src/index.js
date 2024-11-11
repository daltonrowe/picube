// https://kno.wled.ge/interfaces/json-api/

require("dotenv").config();

const { getIps, power } = require('./api')

function log() {
  if (process.env.LOG === '1') console.log(...arguments);
}

function table() {
  if (process.env.LOG === '1') console.table(...arguments);
}

const stateTarget = {
  shouldBeOn: false,
  nodes: {},
}

const state = new Proxy(stateTarget, {
  get(_target, _prop, _receiver) {
    return Reflect.get(...arguments);
  },
})

const updateShouldBeOn = () => {
  const date = new Date();
  const hours = date.getHours();

  const evening = hours >= 18
  const morning = 6 <= hours && hours <= 8

  state.shouldBeOn = evening || morning
};

updateShouldBeOn();

let last = Date.now()
const interval = parseInt(process.env.CHECK_INTERVAL || 120_000);
const resolution = parseInt(process.env.CHECK_RESOLUTION || 1000);
let firstRun = true
let running = false;

setInterval(async () => {
  if (running) return;
  running = true

  const now = Date.now();
  updateShouldBeOn();

  if (firstRun) {
    log('🔆 First run!');
    state.nodes = await getIps()
    table(state.nodes);
    firstRun = false
  }

  const updatePromises = []

  if (now - last > interval) {
    const shouldBeOn = state.shouldBeOn
    const ips = Object.keys(state.nodes)

    for (let i = 0; i < ips.length; i++) {
      const ip = ips[i];
      const isOn = state.nodes[ip]
      const needsPowerChanged = shouldBeOn != isOn

      log(`ip: ${ip} | shouldBeOn: ${shouldBeOn} | isOn: ${isOn} | needsPowerChanged: ${needsPowerChanged}`);

      if (needsPowerChanged) {
        const updatePromise = new Promise(async (resolve, _reject) => {
          log(`ip: ${ip} setting power to ${shouldBeOn}`);
          state.nodes[ip] = await power(ip, shouldBeOn);
          resolve();
        })

        updatePromises.push(updatePromise);
      }
    }

    last = now
  }

  // need to wait for all the network reqs to complete
  // esp32 can be slow to respond
  if (updatePromises.length) {
    await Promise.allSettled(updatePromises);
  }

  running = false
}, resolution);