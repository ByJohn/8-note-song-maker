//Sounds
var sounds = {
  _sounds: {
    1: {url: 'https://cdn.glitch.global/c67f43ce-4102-41a6-8d66-8c89ab5d0e0c/1.mp3'},
    2: {url: 'https://cdn.glitch.global/c67f43ce-4102-41a6-8d66-8c89ab5d0e0c/2.mp3'},
    3: {url: 'https://cdn.glitch.global/c67f43ce-4102-41a6-8d66-8c89ab5d0e0c/3.mp3'},
    4: {url: 'https://cdn.glitch.global/c67f43ce-4102-41a6-8d66-8c89ab5d0e0c/4.mp3'},
    5: {url: 'https://cdn.glitch.global/c67f43ce-4102-41a6-8d66-8c89ab5d0e0c/5.mp3'},
    6: {url: 'https://cdn.glitch.global/c67f43ce-4102-41a6-8d66-8c89ab5d0e0c/6.mp3'},
    7: {url: 'https://cdn.glitch.global/c67f43ce-4102-41a6-8d66-8c89ab5d0e0c/7.mp3'},
    8: {url: 'https://cdn.glitch.global/c67f43ce-4102-41a6-8d66-8c89ab5d0e0c/8.mp3'},
  },
  init: function () {
    for (let id in this._sounds) {
      this._setupSound(this._sounds[id], id);
    }
  },
  _setupSound: function (sound, id) {
    sound.channels = [];
    sound.num = 5;
    sound.index = 0;
    sound.volume = 1;

    for (let i = 0; i < sound.num; i++) {
      sound.channels.push(new Audio(sound.url));
    }
  },
  _getSound: function (id) {
    return this._sounds[id];
  },
  _getSoundChannel: function (id, index) {
    let sound = this._getSound(id);

    index = typeof index === 'undefined' ? sound.index : index;

    let audio = sound.channels[index];

    audio.volume = sound.volume;

    return audio;
  },
  _cycleSound: function (id) {
    let sound = this._getSound(id);

    sound.index++;
    sound.index = sound.index < sound.num ? sound.index : 0;

    sound.volume = 1; //Reset volume, ready for next sound
  },
  _playSound: function (id) {
    let audio = this._getSoundChannel(id);

    audio.play();

    this._cycleSound(id);
  },
  play: function (id) {
    this._playSound(id);
  },
};
