const fetch = require('node-fetch')
require('dotenv').config()

const LATENCY_INTERVAL = parseInt(process.env.LATENCY_INTERVAL)
const PING_INTERVAL = parseInt(process.env.PING_INTERVAL)

let lastSuccess = new Date().getTime();
const successTimings = [];
let pendingFails = 0;

async function post(content) {
  const data = {
    content
  }

  await fetch(process.env.WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

async function ping() {
  const time = new Date().getTime()
  let success;
  let duration;

  try {
    const start = new Date().getTime()
    await fetch(`${process.env.PING_URL}?time=${time}`)
    const end = new Date().getTime()
    duration = end - start;

    success = true;
  } catch (_error) {
  }

  if (!success) {
    pendingFails += 1
    return;
  }


  if (duration > 500) {
    await post(`🐢 Slow request took ${Math.floor(duration)}ms`)
  }

  if (pendingFails) {
    const downtime = Math.floor((time - lastSuccess) / 1000)
    await post(`⛓️‍💥 ${pendingFails} Fails : Down for ${downtime}s`)

    pendingFails = 0;
  }

  if (LATENCY_INTERVAL) {
    successTimings.push(duration);

    if (successTimings.length >= LATENCY_INTERVAL) {
      const sum = successTimings.reduce((acc, next) => acc + next)
      const avg = Math.floor(sum / successTimings.length);

      post(`🔁 Average latency : ${avg}ms`)
      successTimings.length = 0;
    }
  }

  lastSuccess = time;

}

setInterval(async () => {
  await ping();
}, PING_INTERVAL);