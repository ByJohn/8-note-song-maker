//UI
var ui = {
  $form: document.getElementById('form'),
  $songData: document.getElementById('song-data'),
  $export: document.getElementById('export'),
  $exportCanvas: document.getElementById('export-canvas'),

  init: function () {
    this.setupEvents();
    this.updateFormFromHash();
    this.processForm();
  },
  setupEvents: function () {
		this.$form.addEventListener('submit', this.formSubmitted.bind(this), false);

		this.$songData.addEventListener('keyup', debounce(this.formKeyup.bind(this), 100), false);

    this.$export.addEventListener('click', this.export.bind(this), false);

    document.addEventListener('click', this.maybePlaySoundOnClick.bind(this), false);

    document.addEventListener('keydown', this.maybePlaySoundOnKeyDown.bind(this), false);
  },
  formSubmitted: function (e) {
    e.preventDefault();

    sequencer.togglePlay();
  },
  formKeyup: function (e) {
    this.processForm();
    this.updateHashFromForm();

    //If Ctrl+Enter is pressed
    if ((e.ctrlKey || e.metaKey) && (e.keyCode == 13 || e.keyCode == 10)) {
      sequencer.togglePlay();
    }
  },
  processForm: function () {
    let lines = this.$songData.value,
        splitLines = lines.split("\n");

    sequencer.resetSettings();

    if (splitLines.length > 1) {
      let settings = sequencer.getSettingsFromString(splitLines[0]); //Identify any settings encoded in the first line

      //If there are settings, disregard the first line as notes
      if (Object.keys(settings).length > 0) {
        sequencer.setSettings(settings);

        splitLines.shift(); //Remove the first line
      }
    }

    sequencer.forcePolyphonic(splitLines.length > 1); //Split sequence onto multiple lines if the string has multiple lines
    sequencer.applySong(splitLines.join("\n"));
  },
  maybePlaySoundOnClick: function (e) {
    if (typeof e.target.dataset.play !== 'undefined') {
      sounds.play(e.target.dataset.play);
    }
  },
  maybePlaySoundOnKeyDown: function (e) {
    switch (e.keyCode) {
      case 49:
      case 97:
        sounds.play(1);
        break;

      case 50:
      case 98:
        sounds.play(2);
        break;

      case 51:
      case 99:
        sounds.play(3);
        break;

      case 52:
      case 100:
        sounds.play(4);
        break;

      case 53:
      case 101:
        sounds.play(5);
        break;

      case 54:
      case 102:
        sounds.play(6);
        break;

      case 55:
      case 103:
        sounds.play(7);
        break;

      case 56:
      case 104:
        sounds.play(8);
        break;
    }
  },
  updateFormFromHash: function (hash) {
    hash = typeof hash === 'undefined' ? location.hash.replace('#', '').trim() : '';

    if (!hash) return false;

    let lines = hash
      .replace(/_/g, ' ')
      .replace(/~/g, "\n");

    this.$songData.value = lines;

    return true;
  },
  updateHashFromForm: function () {
    let lines = this.$songData.value;

    if (lines.trim() == '') {
      history.replaceState('', document.title, window.location.pathname + window.location.search);

      return null;
    }

    let hash = lines
      .replace(/[^\d\w \n]/g, ' ') //Replace all invalid characters with spaces, allow letters for flair
      .replace(/ /g, '_') //Replace spaces with underscores
      .replace(/\n/g, '~'); //Replace new lines with tildes

    this.setHash(hash);

    return hash;
  },
  setHash: function (hash) {
    if(history.replaceState) {
      history.replaceState('', document.title, '#' + hash);
    }
    else {
      location.hash = '#' + hash;
    }
  },
  songLinkClicked: function (e) {
    if (!e.target.href) return;

    let parts = e.target.href.split('#');

    if (parts.length < 2) return; //Exit if the URL does not have a hash

    this.setHash(parts[1], true);

    this.updateFormFromHash();

    this.processForm();

    e.preventDefault();
  },
  export: function () {
    let that = this,
        scale = 2,
        options = {
          canvas: this.$exportCanvas,
          backgroundColor: null, //Transparent
          scale: scale,
        };

    sequencer.stop();

    document.body.classList.add('exporting');

    this.$exportCanvas.width = sequencer.$inner.offsetWidth * scale;
    this.$exportCanvas.height = sequencer.$inner.offsetHeight * scale;

    html2canvas(sequencer.$inner, options).then(function(canvas) {
      let image = canvas.toDataURL(),
          link = document.createElement('a');

      link.download = '8 Note Song.png';
      link.href = image;
      link.click();
      link.remove();

      document.body.classList.remove('exporting');
    });
  },
};
