//Songs
var songs = {
  $songs: [],

  init: function () {
    this.$songs = document.querySelectorAll('#example-songs li');

    this.processList();
  },
  processList: function () {
    this.$songs.forEach(function ($song) {
    });
  },
};
