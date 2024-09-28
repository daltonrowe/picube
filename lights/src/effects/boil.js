class BoilEffect {
  constructor(
    channel,
    colorLib,
    options = {
      color: 0xff0000,
      numBubbles: 2,
      duration: 2000,
    }
  ) {
    this.options = options;
    this.channel = channel;
    this.colorLib = colorLib;

    this.bubbles = [];

    for (let i = 0; i < this.options.numBubbles; i++) {
      const bubble = {};
      bubble.center = Math.floor(Math.random() * this.channel.array.length);
      bubble.duration = Math.floor(this.options.duration / (i + 1));
      this.bubbles.push(bubble);
    }

    this.last = Date.now();
  }

  mutate() {
    const elapsed = Date.now() - this.last;

    for (let i = 0; i < this.channel.array.length; i++) {
      this.channel.array[i] = "000000";
    }

    for (let i = 0; i < this.bubbles.length; i++) {
      const bubble = this.bubbles[i];
      const nextDuration = bubble.duration - elapsed;

      if (nextDuration > 0) {
        this.channel.array[bubble.center] = this.options.color;
        bubble.duration = nextDuration;
      } else {
        bubble.center = Math.floor(Math.random() * this.channel.array.length);
        bubble.duration = this.options.duration;
      }
    }

    this.last = Date.now();
  }
}

module.exports = {
  BoilEffect,
};
