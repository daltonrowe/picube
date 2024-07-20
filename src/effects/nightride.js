class NightRideEffect {
  constructor(
    channel,
    options = {
      color: 0xff0000,
    },
  ) {
    this.options = options;
    this.channel = channel;

    const hexColor = this.options.color.toString(16).padStart(6, "0");
    this.r = parseInt(`${hexColor[0]}${hexColor[1]}`, 16);
    this.g = parseInt(`${hexColor[2]}${hexColor[3]}`, 16);
    this.b = parseInt(`${hexColor[4]}${hexColor[5]}`, 16);
  }

  mutate() {
    const freq = 2000;
    const ratio = Math.cos((Date.now() / freq) * 2) * 0.5 + 0.5;
    const value = Math.floor(this.channel.array.length * ratio);

    for (let i = 0; i < this.channel.array.length; i++) {
      const distance = Math.abs(value - i);
      const falloff = distance / this.channel.array.length;

      const d = Math.min(255 * falloff, 255);

      const newR = parseInt(Math.max(this.r - d, 0).toFixed(0), 16).toString(
        16,
      );
      const newG = parseInt(Math.max(this.g - d, 0).toFixed(0), 16).toString(
        16,
      );
      const newB = parseInt(Math.max(this.b - d, 0).toFixed(0), 16).toString(
        16,
      );

      const newHex = `${newR}${newG.padStart(2, "0")}${newB.padStart(2, "0")}`;
      this.channel.array[i] = parseInt(newHex, 16);
    }
  }
}

module.exports = {
  NightRideEffect,
};
