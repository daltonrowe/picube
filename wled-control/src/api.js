const fetch = require('node-fetch')

async function post(url, data) {
  const res = await fetch(`http://${process.env.HOST_NODE}${url}`, {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({ ...data, v: true })
  })

  return await res.json();
}

async function get(url) {
  const res = await fetch(`http://${process.env.HOST_NODE}${url}`)
  return await res.json();
}

async function toggle() {
  const data = { "on": "t" }
  return await post(`/json/state`, data)
}

async function power(bool) {
  const data = { "on": bool }
  return await post(`/json/state`, data)
}

async function getState() {
  return await get(`/json/state`)
}

async function getNodes() {
  return await get(`/json/nodes`);
}

module.exports = {
  toggle,
  power,
  post,
  get,
  getState,
  getNodes
}