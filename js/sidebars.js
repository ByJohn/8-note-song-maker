//Sidebars
var sidebars = {
  $menuToggle: document.getElementById('menu-toggle'),
  sidebars: {},

  init: function () {
    let that = this;

    document.querySelectortAll('.sidebar[data-sidebar]').forEach(function ($sidebar) {
      let name = $sidebar.dataset.sidebar;

      that.sidebars[name] = $sidebar;
    });

    this.setupEvents();
  },
  setupEvents: function () {
    this.$menuToggle.addEventListener('click', this.open.bind(this, 'menu'), false);
  },

  open: function (name) {
    let $si
  },
  close: function (name) {},
};
