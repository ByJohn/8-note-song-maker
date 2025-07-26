//Sounds
var sounds = {
  _sounds: {
    1: {url: 'sounds/1.mp3'},
    2: {url: 'sounds/2.mp3'},
    3: {url: 'sounds/3.mp3'},
    4: {url: 'sounds/4.mp3'},
    5: {url: 'sounds/5.mp3'},
    6: {url: 'sounds/6.mp3'},
    7: {url: 'sounds/7.mp3'},
    8: {url: 'sounds/8.mp3'},
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
    sound.volume = 0.25;

    for (let i = 0; i < sound.num; i++) {
      sound.channels.push(new Audio(sound.url));
    }
  },
  _getSound: function (id) {
    if (!this._sounds.hasOwnProperty(id)) return null;

    return this._sounds[id];
  },
  _getSoundChannel: function (id, index) {
    let sound = this._getSound(id);

    if (!sound) return null;

    index = typeof index === 'undefined' ? sound.index : index;

    let audio = sound.channels[index];

    audio.volume = sound.volume;

    return audio;
  },
  _cycleSound: function (id) {
    let sound = this._getSound(id);

    if (!sound) return false;

    sound.index++;
    sound.index = sound.index < sound.num ? sound.index : 0;
  },
  _playSound: function (id) {
    let audio = this._getSoundChannel(id);

    if (!audio) return false;

    audio.play();

    this._cycleSound(id);
  },
  play: function (id) {
    this._playSound(id);
  },
};
