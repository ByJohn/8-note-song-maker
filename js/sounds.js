//Sounds
var sounds = {
  _sounds: {
    1: {url: 'audio/1.mp3'},
  },
  init: function () {
    for (let id in this._sounds) {
      this._setupSound(this._sounds[id], id);
    }
  },
  _setupSound: function (sound, id) {
    sound.channels = [];
    sound.index = 0;
    sound.volume = 1;

    for (let i = 0; i < 5; i++) {
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
