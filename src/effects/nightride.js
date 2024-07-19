class NightRideEffect {
  constructor(channel, options = {
    color: 0x6545B2
  }) {
    this.options = options
    this.channel = channel

    const hexColor = this.options.color.toString(16);
    this.r = parseInt(`${hexColor[0]}${hexColor[1]}`, 16)
    this.g = parseInt(`${hexColor[2]}${hexColor[3]}`, 16)
    this.b = parseInt(`${hexColor[4]}${hexColor[5]}`, 16)
  }

  mutate() {
    const freq = 2000
    const ratio = Math.cos(Date.now() / freq * 2) * .5 + 0.5;
    const value = Math.floor(this.channel.array.length * ratio)

    for (let i = 0; i < this.channel.array.length; i++) {
      const choke = 3
      const distance = Math.abs(value - i) * choke
      const falloff = 1 - distance / this.channel.array.length

      const newR = Math.max(this.r * falloff, 0).toFixed(2)
      const newG = Math.max(this.g * falloff, 0).toFixed(2)
      const newB = Math.max(this.b * falloff, 0).toFixed(2)

      console.log(newR);


      const newHex = `${newR.toString(16)}${(newG * falloff).toString(16)}${newB.toString(16)}`
      console.log(newHex);

      this.channel.array[i] = parseInt(newHex, 16)
    }
  }
}

module.exports = {
  NightRideEffect
};
