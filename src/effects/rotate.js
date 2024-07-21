class RotateEffect {
  last = Date.now();
  progress = 0;

  constructor(
    channel,
    options = {
      color: 0x6545b2,
      freq: 2000,
    }
  ) {
    this.channel = channel;
    this.options = options;

    const hexColor = this.options.color.toString(16).padStart(6, "0");
    this.rgb = hexRgbToDecRgb(hexStringToHexRgb(hexNumberToString(hexColor)));
  }

  mutate() {
    const freq = 3000;
    const now = Date.now();
    const since = now - this.last;
    this.progress += since;

    if (this.progress > freq) {
      this.progress = this.progress - freq;
      this.last = now;
    }

    const perc = (this.progress / freq).toFixed(2);
  }
}

module.exports = {
  RotateEffect,
};
