//UI
var ui = {
  $form: document.getElementById('form'),
  $songData: document.getElementById('song-data'),

  init: function () {
    this.setupEvents();
    this.updateFormFromHash();
    this.processForm();
  },
  setupEvents: function () {
		this.$form.addEventListener('submit', this.formSubmitted.bind(this), false);

		this.$songData.addEventListener('keyup', this.formKeyup.bind(this), false);

    document.addEventListener('click', this.maybePlaySoundOnClick.bind(this), false);
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
    let lines = this.$songData.value;

    sequencer.forcePolyphonic(lines.split("\n").length > 1); //Split sequence onto multiple lines if the string has multiple lines
    sequencer.applySong(lines);
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
};
