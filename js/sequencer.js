//Sequencer
var sequencer = {
  $sequence: document.getElementById('sequence'),
  $noteRows: document.querySelectorAll('.note-row'),
  init: function () {},
  normaliseNote: function (note) {
    note = parseInt(note);

    if (isNaN(note) || note < 1 || note > 8) return null;

    return note;
  },
  draw: function (lines) {
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
        let notesToAddThisColumn = {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
      };

      //For each line
      lines.forEach(function (line, row) {
        //If the current column in the current line exists and is valid
        if (typeof line[column] !== 'undefined') {
          let note = that.normaliseNote(line[column]);

          if (note) {
            notesToAddThisColumn[note - 1] = true;
          }
        }
      });

      for (let i; i < 8; i++) {
      }

      notesToAddThisColumn.forEach(function (addNote, noteI) {
        that.$noteRows[noteI].append('<li>' + (addNote ? noteI + 1 : '') + '</li>');
      });
    }
  },
};
