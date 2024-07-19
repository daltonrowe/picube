class UpAndDownEffect {
  constructor(channel, options = {
    color: 0x6545B2
  }) {
    this.options = options
    this.channel = channel
  }

  mutate() {
    const freq = 2000
    const ratio = Math.cos(Date.now() / freq * 2) * .5 + 0.5;
    const value = Math.floor(this.channel.array.length * ratio)

    for (let i = 0; i < this.channel.array.length; i++) {
      if (i === value) {
        this.channel.array[i] = this.options.color;
      } else {
        this.channel.array[i] = 0x000000;
      }
    }
  }
}

module.exports = {
  UpAndDownEffect
};
