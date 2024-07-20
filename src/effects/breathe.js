class BreatheEffect {
  constructor(
    channel,
    options = {
      color: 0x6545b2,
      freq: 2000,
    }
  ) {
    this.channel = channel;
    this.options = options;

    for (let i = 0; i < this.channel.array.length; i++) {
      this.channel.array[i] = this.options.color;
    }
  }

  mutate() {
    const ratio = Math.cos((Date.now() / this.options.freq) * 2) * 0.5 + 0.5;
    const value = Math.floor(255 * ratio);

    this.channel.brightness = value;
  }
}

module.exports = {
  BreatheEffect,
};
