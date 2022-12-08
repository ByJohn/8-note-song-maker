//Sounds
var sounds = {
  sounds: {
    1: {url: 'audio/1.mp3'},
  },
  init: function () {
    for (let id in this.sounds) {
      this.setupSound(this.sounds[id], id);
    }
    
    console.log(this.sounds);
  },
  setupSound: function (sound, id) {
    sound.channels = [];
    sound.index = 0;
    sound.volume = 1;

    for (let i = 0; i < 5; i++) {
      sound.channels.push(new Audio(sound.url));
    }
  },
};
