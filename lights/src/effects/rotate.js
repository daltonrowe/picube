class RotateEffect {
  last = Date.now();
  progress = 0;

  constructor(
    channel,
    colorLib,
    options = {
      color: 0xff0000,
      freq: 200_000,
    }
  ) {
    this.channel = channel;
    this.options = options;
    this.colorLib = colorLib;

    const hexColor = this.options.color.toString(16).padStart(6, "0");
    this.rgb = this.colorLib.hexRgbToDecRgb(
      this.colorLib.hexStringToHexRgb(this.colorLib.hexNumberToString(hexColor))
    );
  }

  mutate() {
    const now = Date.now();
    const since = now - this.last;
    this.progress += since;

    if (this.progress > this.options.freq) {
      this.progress = this.progress - this.options.freq;
      this.last = now;
    }

    const perc = this.progress / this.options.freq;
    const deg = 360 * perc;

    const newDecRgb = this.colorLib.rotateDecRgb(this.rgb, deg);

    for (let i = 0; i < this.channel.array.length; i++) {
      const newHexRgb = this.colorLib.decRgbToHexRgb(newDecRgb);
      const newHexString = this.colorLib.hexRgbToHexString(newHexRgb);
      const newHexNumber = this.colorLib.hexStringToHexNumber(newHexString);

      this.channel.array[i] = newHexNumber;
    }
  }
}

module.exports = {
  RotateEffect,
};
