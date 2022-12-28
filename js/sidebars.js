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
    this.$menuToggle.addEventListener('click', this.openMenu.bind(this), false);
  },

  openMenu: function () {
    this.open('menu');
  },

  open: function (name) {},
  close: function (name) {},
};
