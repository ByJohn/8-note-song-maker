//Sequencer
var sequencer = {
  $sequence: document.getElementById('sequence'),
  $inner: document.querySelector('.sequence-inner'),
  $monoNoteRows: document.querySelectorAll('.monophonic .note-row ul'), //Monophonic rows (only one, but still an array for consistany)
  $polyNoteRows: [].slice.call(document.querySelectorAll('.polyphonic .note-row ul'), 0).reverse(), //polyphonic rows, reversed
  forcedPolyphonic: false,
  song: [], //An array unique notes for each step (song tick)
  songStep: 0, //Song playback iterator
  playing: false,
  defaultSettings: {
    bpm: 120,
  },
  settingsLabelMappings: {
    t: 'bpm',
  },
  settings: {},
  ticker: {
    ticking: false,
    startTime: null,
    then: null,
  },

  //General
  init: function () {
    this.resetSettings();

    window.addEventListener('resize', this.checkSongWidth.bind(this));
  },
  forcePolyphonic: function (polyphonic) {
    this.forcedPolyphonic = polyphonic;
  },
  normaliseNote: function (note) {
    note = parseInt(note);

    if (isNaN(note) || note < 1 || note > 8) return null;

    return note;
  },
  checkSongWidth: function () {
    document.body.classList.toggle('wide-song', this.$inner.offsetWidth > this.$sequence.offsetWidth);
  },

  resetSettings: function() {
    this.setSettings(this.defaultSettings);
  },
  getSettingsFromString: function(line) {
    let that = this,
        settings = {};

    if (!isNaN(line[0])) return settings; //Exit if the first character is a number

    Object.keys(this.settingsLabelMappings).forEach(function (key) {
      let regex = '\\b' + key + '(\\d+)\\b',
          matches = line.match(new RegExp(regex));

      if (matches && matches[1] && !isNaN(matches[1])) {
        settings[that.settingsLabelMappings[key]] = parseFloat(matches[1]);
      }
    });

    return settings;
  },
  setSettings: function(settings) {
    this.settings = Object.assign({}, this.defaultSettings, settings);
  },

  //Notes
  parseLines: function (lines) {
    let that = this,
        song = [];

    lines = lines.split("\n");

    lines.forEach(function (line, row) {
      for (let column = 0; column < line.length; column++) {
        //If the column does not yet have an array
        if (typeof song[column] === 'undefined') {
          song[column] = [];
        }

        let note = that.normaliseNote(line[column]);

        if (note !== null && !song[column].includes(note)) {
          song[column].push(note);
        }
      }
    });

    return song;
  },
  applySong: function(lines) {
    this.song = this.parseLines(lines);

    this.draw(this.song);
    this.setCSSVariables();
    this.checkSongWidth();
  },
  setCSSVariables: function () {
    let songDuration = ((this.song.length / this.settings.bpm) * 60), //Song duration in seconds
        beatDuration = songDuration / this.song.length; //Length of time between beats

    document.documentElement.style.setProperty('--song-length', this.song.length);
    document.documentElement.style.setProperty('--song-duration', songDuration + 's');
    document.documentElement.style.setProperty('--beat-duration', beatDuration + 's');
  },

  //Drawing
  clear: function () {
    this.$monoNoteRows.forEach(function ($row) {
      $row.innerHTML = '';
    });

    this.$polyNoteRows.forEach(function ($row) {
      $row.innerHTML = '';
    });
  },
  draw: function (song) {
    this.clear();

    let that = this,
        isPolyphonic = this.forcedPolyphonic,
        $rows = this.$monoNoteRows; //Use monophonic rows

    //If not forced to be polyphonic, check if the song is
    if (!isPolyphonic) {
      isPolyphonic = song.some(function (notes) {
        return notes.length > 1;
      });
    }

    if (isPolyphonic) {
      $rows = this.$polyNoteRows; //Use polyphonic rows
      this.$sequence.classList.add('is-polyphonic');
    } else {
      this.$sequence.classList.remove('is-polyphonic');
    }

    //For each step in the song
    song.forEach(function (notes, i) {
      let newEls = [];

      //Create empty note element for each note row
      $rows.forEach(function (row) {
        let el = document.createElement('li');

        newEls.push(el);

        row.appendChild(el);
      });

      //For each note in the song's current step
      notes.forEach(function (note) {
        if (!note) return;

        //Find the empty note element
        if (isPolyphonic) {
          var el = newEls[note - 1];
        } else {
          var el = newEls[0];
        }

        //Add note data to the note element
        el.textContent = note;
        el.classList.add('note-' + note);
        el.dataset.play = note;
      });
    });
  },

  //Playback
  getIntervalMilliseconds: function () {
    return (1 / (this.settings.bpm / 60) * 1000);
  },
  togglePlay: function () {
    if (this.playing) this.stop();
    else this.play();
  },
  play: function () {
    if (this.playing) return false;

    this.$sequence.scrollTo(0, 0);

    this.playing = true;

    document.body.classList.add('playing');

    this.startTicker();
  },
  stop: function () {
    if (!this.playing) return false;

    this.stopTicker();

    this.stopPlayingAnimation();

    this.resetStep();

    document.body.classList.remove('playing');

    this.playing = false;
  },
  step: function () {
    //If the current song step does not exist, stop playing
    if (typeof this.song[this.songStep] === 'undefined') {
      this.stop();

      return;
    }

    if (this.songStep === 0) {
      this.restartPlayingAnimation();
    }

    //Play all notes
    this.song[this.songStep].forEach(function (note) {
      sounds.play(note);
    });

    this.nextStep();
  },
  nextStep: function () {
    this.songStep++;

    if (this.songStep >= this.song.length) {
      this.resetStep();
    }
  },
  resetStep: function () {
    this.songStep = 0;
  },
  restartPlayingAnimation: function () {
    document.body.classList.remove('playing-animation');
    document.body.offsetHeight; //Trigger reflow
    document.body.classList.add('playing-animation');
  },
  stopPlayingAnimation: function () {
    document.body.classList.remove('playing-animation');
  },

  //Ticker (setInterval-like using request animation frame)
  startTicker: function () {
    if (this.ticker.ticking) return;

    this.ticker.ticking = true;
    this.ticker.then = Date.now();
    this.ticker.startTime = this.ticker.then;

    this.tick();
  },
  stopTicker: function () {
    this.ticker.ticking = false;
  },
  tick: function () {
    if (!this.ticker.ticking) return;

    requestAnimationFrame(this.tick.bind(this));

    let now = Date.now(),
        elapsed = now - this.ticker.then,
        targetInterval = this.getIntervalMilliseconds();

    //If it is the first frame or enough time has elapsed
    if (this.ticker.startTime === now || elapsed > targetInterval) {
      this.ticker.then = now - (elapsed % targetInterval);

      this.step(elapsed);
    }
  },
};
