class Lights {
  effectInstance = null;
  numLeds = null;
  interval = null;
  ws281x = null;
  effects = null;
  speed = null;

  constructor(numLeds, ws281x, channel, colorLib, effects, speed) {
    this.numLeds = numLeds;
    this.ws281x = ws281x;
    this.channel = channel;
    this.effects = effects;
    this.speed = speed;
    this.colorLib = colorLib;

    this.setEffect("default");
  }

  setEffect(effectName, effectOptions) {
    console.log(effectOptions);

    this.effectInstance = new this.effects[effectName](
      this.channel,
      this.colorLib,
      effectOptions
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
    this.interval = null;
    this.ws281x.reset();
  }

  isPlaying() {
    return !!this.interval;
  }
}

module.exports = {
  Lights,
};
