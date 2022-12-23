//UI
var ui = {
  $form: document.getElementById('form'),
  $songData: document.getElementById('song-data'),
  $export: document.getElementById('export'),
  $exportCanvas: document.getElementById('export-canvas'),
  $sequenceInner: document.querySelector('.sequence-inner'),

  init: function () {
    this.setupEvents();
    this.updateFormFromHash();
    this.processForm();
  },
  setupEvents: function () {
		this.$form.addEventListener('submit', this.formSubmitted.bind(this), false);

		this.$songData.addEventListener('keyup', this.formKeyup.bind(this), false);

    document.addEventListener('click', this.maybePlaySoundOnClick.bind(this), false);

    $export.addEventListener('click', this.export.bind(this), false);
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
  updateFormFromHash: function () {
    let hash = location.hash.replace('#', '').trim();

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

    if(history.replaceState) {
      history.replaceState('', document.title, '#' + hash);
    }
    else {
      location.hash = '#' + hash;
    }

    return hash;
  },
  export: function () {
    let options = {
      canvas: this.$exportCanvas,
      scale: 2,
    };

    html2canvas(this.$sequenceInner, options).then(function(canvas) {
    });
  },
};
