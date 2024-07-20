class BreatheEffect {
  constructor(
    channel,
    options = {
      color: 0x6545b2,
    },
  ) {
    this.channel = channel;

    for (let i = 0; i < this.channel.array.length; i++) {
      this.channel.array[i] = options.color;
    }
  }

  mutate() {
    const freq = 2000;
    const ratio = Math.cos((Date.now() / freq) * 2) * 0.5 + 0.5;
    const value = Math.floor(255 * ratio);

    this.channel.brightness = value;
  }
}

module.exports = {
  BreatheEffect,
};
