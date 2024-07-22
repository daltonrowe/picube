class NightRideEffect {
  constructor(
    channel,
    colorLib,
    options = {
      color: 0xff0000,
      choke: -30,
      freq: 2000,
    }
  ) {
    this.options = options;
    this.channel = channel;
    this.colorLib = colorLib;

    this.rgb = this.colorLib.hexRgbToDecRgb(
      this.colorLib.hexStringToHexRgb(
        this.colorLib.hexNumberToString(this.options.color)
      )
    );
  }

  mutate() {
    const ratio = Math.cos((Date.now() / this.options.freq) * 2) * 0.5 + 0.5;
    const value = Math.floor(this.channel.array.length * ratio);

    for (let i = 0; i < this.channel.array.length; i++) {
      const distance = Math.abs(value - i);

      const newDecRgb = addDecRgb(this.rgb, this.options.choke * distance);
      const newHexRgb = decRgbToHexRgb(newDecRgb);
      const newHexString = hexRgbToHexString(newHexRgb);
      const newHexNumber = hexStringToHexNumber(newHexString);

      this.channel.array[i] = newHexNumber;
    }
  }
}

module.exports = {
  NightRideEffect,
};
