class Lights {
  effectInstance = null;
  numLeds = null;
  interval = null;
  ws281x = null;
  effects = null;
  speed = null;

  constructor(numLeds, ws281x, channel, effects, speed) {
    this.numLeds = numLeds;
    this.ws281x = ws281x;
    this.channel = channel;
    this.effects = effects;
    this.speed = speed;

    this.setEffect("default", {});
  }

  setEffect(effectName, effectOptions) {
    this.effectInstance = new this.effects[effectName](
      this.channel,
      effectOptions,
    );
  }

  render() {
    this.effectInstance.mutate();
    this.ws281x.render();
  }

  start() {
    this.interval = setInterval(() => {
      this.render();
    }, this.speed);
  }

  stop() {
    clearInterval(this.interval);
  }
}

module.exports = {
  Lights,
};
