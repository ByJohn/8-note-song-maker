//Sequencer
var sequencer = {
  $sequence: document.getElementById('sequence'),
  $monoNoteRows: document.querySelectorAll('.monophonic .note-row ul'), //Monophonic rows (only one, but still an array for consistany)
  $polyNoteRows: [].slice.call(document.querySelectorAll('.polyphonic .note-row ul'), 0).reverse(), //polyphonic rows, reversed
  forcedPolyphonic: false,
  song: [], //An array unique notes for each step (song tick)
  playing: false,
  bpm: 60,
  interval: null,

  //General
  init: function () {},
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
  set: function(lines) {
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
    console.log(song);
    this.clear();

    let that = this,
        isPolyphonic = this.forcedPolyphonic,
        $rows = this.$monoNoteRows;

    //If not forced to be polyphonic, check the song
    if (!isPolyphonic) {
      isPolyphonic = song.some(function (notes) {
        return notes.length > 1;
      });
    }

    if (isPolyphonic) {
      $rows = this.$polyNoteRows;
      this.$sequence.classList.add('is-polyphonic');
    } else {
      this.$sequence.classList.remove('is-polyphonic');
    }

    song.forEach(function (notes, i) {
      let newEls = [];

      $rows.forEach(function (row) {
        let el = document.createElement('li');

        newEls.push(el);

        row.appendChild(el);
      });

      notes.forEach(function (note) {
        if (!note) return;

        if (isPolyphonic) {
          var el = newEls[note - 1];
        } else {
          var el = newEls[0];
        }

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
    this.tick();
  },
  stop: function () {
    if (!this.playing) return false;

    this.playing = false;
    document.body.classList.remove('playing');
    window.clearTimeout(this.interval);
  },
  tick: function () {
    this.interval = window.setTimeout(this.tick.bind(this), this.getIntervalMilliseconds());
    console.log('tick');
  },
};
