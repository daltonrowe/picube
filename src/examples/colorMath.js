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

const hexString = hexNumberToString(hexNumber);
const hexRgb = hexStringToHexRgb(hexString);
const decRgb = hexRgbToDecRgb(hexRgb);
const reducedDecRgb = multiplyDecRgb(decRgb, 0.5);
const increasedDecRgb = multiplyDecRgb(decRgb, 1.5);
const addedDecRgb = addDecRgb(decRgb, 10);
const subtractedDecRgb = addDecRgb(decRgb, -10);
const hexRgbReconverted = decRgbToHexRgb(decRgb);
const hexStringReconverted = hexRgbToHexString(hexRgbReconverted);
const hexNumberReconverted = hexStringToHexNumber(hexStringReconverted);

const reducedHexNumber = multiplyHexNumber(hexNumber, 0.5);
const reducedHexString = hexNumberToString(reducedHexNumber);

console.assert(hexNumber === hexNumberReconverted);

const manualHexNumber = hexNumber * 0.5;
const manualHexString = hexNumberToString(manualHexNumber);

console.table({
  hexNumber,
  hexString,
  hexRgb,
  decRgb,
  reducedDecRgb,
  increasedDecRgb,
  addedDecRgb,
  subtractedDecRgb,
  hexRgbReconverted,
  hexStringReconverted,
  hexNumberReconverted,
  reducedHexNumber,
  reducedHexString,
  manualHexNumber,
  manualHexString,
});
