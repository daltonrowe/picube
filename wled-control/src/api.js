const fetch = require('node-fetch')

async function post(host, url, data) {
  const res = await fetch(`http://${host}${url}`, {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({ ...data, v: true })
  })

  return await res.json();
}

async function get(host, url) {
  const res = await fetch(`http://${host}${url}`)
  return await res.json();
}

async function power(host, bool) {
  const data = { "on": bool }
  const { on } = await post(host, `/json/state`, data)
  return on
}

async function getIps() {
  const ips = {}

  const { ip } = await get(process.env.HOST_NODE, `/json/info`)
  const { on } = await get(ip, '/json/state')

  ips[`${ip}`] = on

  const { nodes } = await get(ip, '/json/nodes')

  for (const node of nodes) {
    const nodeState = await get(node.ip, '/json/state')
    ips[`${node.ip}`] = nodeState.on
  }

  return ips
}

module.exports = {
  post, get, power, getIps
}