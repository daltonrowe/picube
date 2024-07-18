class DefaultEffect {
  numLeds = null;

  lastColor = 'r';

  colors = {
    r: 0xff0000,
    g: 0x00ff00,
    b: 0x0000ff
  }

  channel = null;

  constructor(channel, _options) {
    this.channel = channel
  }

  mutate() {
    let newColor = 'r';

    switch (this.lastColor) {
      case 'r':
        newColor = 'g'
        break;

      case 'g':
        newColor = 'b'
        break;

      case 'b':
        newColor = 'r'
        break;
    }

    const colorHex = this.colors[newColor]
    this.lastColor = newColor

    for (let i = 0; i < this.channel.array.length; i++) {
      this.channel.array[i] = colorHex;
    }
  }
}

module.exports = {
  DefaultEffect
};
