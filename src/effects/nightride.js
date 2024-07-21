function clampRgb(byte) {
  return Math.floor(Math.min(Math.max(byte, 0), 255));
}

function hexNumberToString(hexNumber) {
  const hexCode = hexNumber.toString(16).padStart(6, "0");

  return hexCode;
}

function hexStringToHexRgb(hexString) {
  const r = hexString.substring(0, 2);
  const g = hexString.substring(2, 4);
  const b = hexString.substring(4, 6);

  return [r, g, b];
}

function hexRgbToDecRgb(hexRgb) {
  const r = parseInt(hexRgb[0], 16);
  const g = parseInt(hexRgb[1], 16);
  const b = parseInt(hexRgb[2], 16);

  return [r, g, b];
}

function addDecRgb(decRgb, adder) {
  const [r, g, b] = decRgb;

  const newR = clampRgb(r + adder);
  const newG = clampRgb(g + adder);
  const newB = clampRgb(b + adder);

  return [newR, newG, newB];
}

function decRgbToHexRgb(decRgb) {
  const [r, g, b] = decRgb;

  const newR = r.toString(16).padStart(2, "0");
  const newG = g.toString(16).padStart(2, "0");
  const newB = b.toString(16).padStart(2, "0");

  return [newR, newG, newB];
}

function hexRgbToHexString(hexRgb) {
  const [r, g, b] = hexRgb;

  return `${r}${g}${b}`;
}

function hexStringToHexNumber(hexString) {
  return parseInt(hexString, 16);
}
class NightRideEffect {
  constructor(
    channel,
    options = {
      color: 0xff0000,
      choke: -30,
      freq: 2000
    },
  ) {
    this.options = options;
    this.channel = channel;

    this.rgb = hexRgbToDecRgb(hexStringToHexRgb(hexNumberToString(this.options.color)))
  }

  mutate() {
    const ratio = Math.cos((Date.now() / this.options.freq) * 2) * 0.5 + 0.5;
    const value = Math.floor(this.channel.array.length * ratio);

    for (let i = 0; i < this.channel.array.length; i++) {
      const distance = Math.abs(value - i);

      const newDecRgb = addDecRgb(this.rgb, this.options.choke * distance);
      const newHexRgb = decRgbToHexRgb(newDecRgb)
      const newHexString = hexRgbToHexString(newHexRgb)
      const newHexNumber = hexStringToHexNumber(newHexString)

      this.channel.array[i] = newHexNumber
    }
  }
}

module.exports = {
  NightRideEffect,
};
