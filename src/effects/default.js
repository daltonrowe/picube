class DefaultEffect {
  numLeds = null;

  lastColor = 0;
  lastTime = 0;

  colors = [0xff0000, 0x00ff00, 0x0000ff];

  channel = null;

  constructor(channel, _options) {
    this.channel = channel;
  }

  mutate() {
    const freq = 1000;
    const now = Date.now();
    const since = now - this.lastTime;

    let newColor = this.lastColor;

    if (since >= freq) {
      this.lastTime = now;

      newColor += 1;
      if (newColor >= this.colors.length) newColor = 0;
    }

    const colorHex = this.colors[newColor];
    this.lastColor = newColor;

    for (let i = 0; i < this.channel.array.length; i++) {
      this.channel.array[i] = colorHex;
    }
  }
}

module.exports = {
  DefaultEffect,
};
