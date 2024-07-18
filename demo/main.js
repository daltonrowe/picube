const numLeds = 42
const speed = 20

function setup(numLeds) {
  const leds = document.createElement('DIV');
  leds.id = 'leds'

  for (let i = 0; i < numLeds; i++) {
    const led = document.createElement('DIV')
    led.classList.add('pixel')

    leds.appendChild(led)
  }

  document.body.appendChild(leds)
  return leds;
}

const leds = setup(numLeds)
const pixels = document.querySelectorAll('.pixel')

const effects = {
  default: window.requires.DefaultEffect,
  breathe: window.requires.BreatheEffect
}

const channel = {
  array: new Array(numLeds),
  brightness: 50
}

const ws281x = {
  render: function () {
    leds.style.setProperty("--brightness", channel.brightness)

    for (let i = 0; i < channel.array.length; i++) {
      const pixel = pixels[i];

      const hexStr = channel.array[i].toString(16)
      const hexColor = "#" + hexStr.padStart(6, '0')
      pixel.style.setProperty('--color', hexColor)
    }
  }
}

const lights = new Lights(numLeds, ws281x, channel, effects, speed)
lights.setEffect('breathe')
lights.start()