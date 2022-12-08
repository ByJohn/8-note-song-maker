//Sequencer
var sequencer = {
  $sequence: document.getElementById('sequence'),
  $monoNoteRow: document.querySelectorAll('.monophonic .note-row ul')[0],
  $polyNoteRows: document.querySelectorAll('.polyphonic .note-row ul'),
  init: function () {},
  normaliseNote: function (note) {
    note = parseInt(note);

    if (isNaN(note) || note < 1 || note > 8) return null;

    return note;
  },
  clear: function () {
    this.$monoNoteRow.innerHTML = '';

    this.$polyNoteRows.forEach(function ($row) {
      $row.innerHTML = '';
    });
  },
  draw: function (lines) {
    this.clear();

    lines = lines.trimEnd();
    lines = lines.split("\n");

    let that = this,
        longestLineIndex = 0;

    //Find the longest line
    lines.forEach(function (line, i) {
      if (line.length > lines[longestLineIndex].length) {
        longestLineIndex = i;
      }
    });

    //For each character index (column) up to the last character of the longest line
    for (let column = 0; column < lines[longestLineIndex].length; column++) {
        let notesToAdd = new Array(that.$polyNoteRows.length).fill(false); //Create a boolean array for the notes

      //For each line
      lines.forEach(function (line, row) {
        //If the current column in the current line exists and is valid
        if (typeof line[column] !== 'undefined') {
          let note = that.normaliseNote(line[column]);

          if (note) {
            notesToAdd[note - 1] = true;
          }
        }
      });

      for (let i in notesToAdd) {
        let addNote = notesToAdd[i],
            note = parseInt(i) + 1;

        that.$polyNoteRows[i].innerHTML += '<li>' + (addNote ? note : '') + '</li>';
        // that.$polyNoteRows[i].innerHTML += '<li>.</li>';
      }
    }
  },
};
