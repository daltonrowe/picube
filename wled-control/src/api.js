async function post(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({ ...data, v: true })
  })

  return await res.json();
}

async function get(url) {
  const res = await fetch(url)
  return await res.json();
}

async function toggle(url) {
  const data = { "on": "t" }
  return await post(`${url}/json/state`, data)
}

async function power(url, bool) {
  const data = { "on": bool }
  return await post(`${url}/json/state`, data)
}

async function getState(url) {
  const data = { "on": "t" }
  return await get(`${url}/json/state`, data)
}

async function loadStates(wleds) {
  for (const label in wleds) {
    const wled = wleds[label]
    const res = await getState(wled.url);
    wled.state = res;
  }
}

async function getNodes(url) {
  const res = await fetch(`${url}/json/nodes`)
  return await res.json();
}

module.exports = {
  toggle,
  power,
  post,
  get,
  getState,
  loadStates,
  getNodes
}