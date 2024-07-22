const hexNumber = 0x55dd3a;

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

function multiplyDecRgb(decRgb, multiplier) {
  const [r, g, b] = decRgb;

  const newR = clampRgb(r * multiplier);
  const newG = clampRgb(g * multiplier);
  const newB = clampRgb(b * multiplier);

  return [newR, newG, newB];
}

function multiplyHexRgb(hexRgb, multiplier) {
  const [r, g, b] = hexRgb;

  const newR = clampRgb(r * multiplier);
  const newG = clampRgb(g * multiplier);
  const newB = clampRgb(b * multiplier);

  return [newR, newG, newB];
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

function multiplyHexNumber(hexNumber, multiplier) {
  const hexString = hexNumberToString(hexNumber);
  const hexRgb = hexStringToHexRgb(hexString);
  const decRgb = hexRgbToDecRgb(hexRgb);
  const newDecRgb = multiplyDecRgb(decRgb, multiplier);
  const newHexRgb = decRgbToHexRgb(newDecRgb);
  const newHexString = hexRgbToHexString(newHexRgb);
  const newHexNumber = hexStringToHexNumber(newHexString);

  return newHexNumber;
}

function rotateDecRgb(decRgb, deg) {
  // https://beesbuzz.biz/code/16-hsv-color-transforms
  // https://github.com/konvajs/konva/blob/master/src/filters/HSV.ts#L17
  const h = deg;
  const s = 1;
  const v = 1;

  const [r, g, b] = decRgb;

  const vsu = v * s * Math.cos((h * Math.PI) / 180);
  const vsw = v * s * Math.sin((h * Math.PI) / 180);

  // precompute the transformation matrix values
  const rr = 0.299 * v + 0.701 * vsu + 0.167 * vsw;
  const rg = 0.587 * v - 0.587 * vsu + 0.33 * vsw;
  const rb = 0.114 * v - 0.114 * vsu - 0.497 * vsw;
  const gr = 0.299 * v - 0.299 * vsu - 0.328 * vsw;
  const gg = 0.587 * v + 0.413 * vsu + 0.035 * vsw;
  const gb = 0.114 * v - 0.114 * vsu + 0.293 * vsw;
  const br = 0.299 * v - 0.3 * vsu + 1.25 * vsw;
  const bg = 0.587 * v - 0.586 * vsu - 1.05 * vsw;
  const bb = 0.114 * v + 0.886 * vsu - 0.2 * vsw;

  // manually perform matrix multiplication
  const newR = rr * r + rg * g + rb * b;
  const newG = gr * r + gg * g + gb * b;
  const newB = br * r + bg * g + bb * b;

  return [clampRgb(newR), clampRgb(newG), clampRgb(newB)];
}

// const hexString = hexNumberToString(hexNumber);
// const hexRgb = hexStringToHexRgb(hexString);
// const decRgb = hexRgbToDecRgb(hexRgb);
// const reducedDecRgb = multiplyDecRgb(decRgb, 0.5);
// const increasedDecRgb = multiplyDecRgb(decRgb, 1.5);
// const addedDecRgb = addDecRgb(decRgb, 10);
// const subtractedDecRgb = addDecRgb(decRgb, -10);
// const hexRgbReconverted = decRgbToHexRgb(decRgb);
// const hexStringReconverted = hexRgbToHexString(hexRgbReconverted);
// const hexNumberReconverted = hexStringToHexNumber(hexStringReconverted);

// const reducedHexNumber = multiplyHexNumber(hexNumber, 0.5);
// const reducedHexString = hexNumberToString(reducedHexNumber);

// console.assert(hexNumber === hexNumberReconverted);

// console.table({
//   hexNumber,
//   hexString,
//   hexRgb,
//   decRgb,
//   reducedDecRgb,
//   increasedDecRgb,
//   addedDecRgb,
//   subtractedDecRgb,
//   hexRgbReconverted,
//   hexStringReconverted,
//   hexNumberReconverted,
//   reducedHexNumber,
//   reducedHexString,
// });

// const rotatedRgb = rotateDebRgb(decRgb, 360);

// console.table({
//   decRgb,
//   90: rotateDebRgb(decRgb, 90),
//   180: rotateDebRgb(decRgb, 180),
//   270: rotateDebRgb(decRgb, 270),
//   360: rotateDebRgb(decRgb, 360),
// });

module.exports = {
  colorMath: {
    clampRgb,
    hexNumberToString,
    hexStringToHexRgb,
    hexRgbToDecRgb,
    multiplyDecRgb,
    multiplyHexRgb,
    addDecRgb,
    decRgbToHexRgb,
    hexRgbToHexString,
    hexStringToHexNumber,
    multiplyHexNumber,
    rotateDecRgb,
  },
};
