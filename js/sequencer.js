//Sequencer
var sequencer = {
  $sequence: document.getElementById('sequence'),
  $monoNoteRows: document.querySelectorAll('.monophonic .note-row ul'), //Monophonic rows (only one, but still an array for consistany)
  $polyNoteRows: [].slice.call(document.querySelectorAll('.polyphonic .note-row ul'), 0).reverse(), //polyphonic rows, reversed
  $needle: document.getElementById('play-needle'),
  needleMoveWidth: 0,
  forcedPolyphonic: false,
  song: [], //An array unique notes for each step (song tick)
  songStep: 0, //Song playback iterator
  playing: false,
  bpm: 120,
  interval: null,
  ticker: {
    ticking: false,
    fps: 10,
    fpsInterval: null,
    then: null,
  },

  //General
  init: function () {
    this.needleMoveWidth = document.getElementById('needle-spacing-reference').offsetWidth;
  },
  forcePolyphonic: function (polyphonic) {
    this.forcedPolyphonic = polyphonic;
  },
  normaliseNote: function (note) {
    note = parseInt(note);

    if (isNaN(note) || note < 1 || note > 8) return null;

    return note;
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
    return (1 / (this.bpm / 60) * 1000);
  },
  togglePlay: function () {
    if (this.playing) this.stop();
    else this.play();
  },
  play: function () {
    if (this.playing) return false;

    this.playing = true;
    document.body.classList.add('playing');
    this.step();
    this.startTicker();
  },
  stop: function () {
    if (!this.playing) return false;

    this.playing = false;
    this.resetStep();
    this.stopTicker();
    document.body.classList.remove('playing');
    window.clearTimeout(this.interval);
  },
  step: function () {
    this.interval = window.setTimeout(this.step.bind(this), this.getIntervalMilliseconds());

    //If the current song step does not exist, stop playing
    if (typeof this.song[this.songStep] === 'undefined') {
      this.stop();

      return;
    }
    
    this.positionNeedle();

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
  positionNeedle: function () {
    this.$needle
  },
  updateNeedle: function () {},

  //Ticker
  startTicker: function () {
    if (this.ticker.ticking) return;

    this.ticker.ticking = true;
    this.ticker.fpsInterval = 1000 / this.ticker.fps;
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
        elapsed = now - this.ticker.then;

    //If it is the first frame or enough time has elapsed
    if (this.ticker.startTime === now || elapsed > this.ticker.fpsInterval) {
      this.ticker.then = now - (elapsed % this.ticker.fpsInterval);

      console.log('tick');
    }
  },
};
