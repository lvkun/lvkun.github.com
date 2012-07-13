(function() {
  var IndexLoader, IndexRender, PostLoader, PostRender, StateManager, state,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    _this = this;

  IndexRender = (function() {

    function IndexRender() {}

    IndexRender.prototype.show = function(index_data) {
      return console.log(index_data);
    };

    IndexRender.prototype.hide = function() {
      return console.log("IndexRender hide");
    };

    return IndexRender;

  })();

  IndexLoader = (function() {

    function IndexLoader(args) {}

    IndexLoader.prototype.load = function(callback) {
      return $.ajax({
        url: "post/index.json",
        dataType: 'json',
        success: callback
      });
    };

    return IndexLoader;

  })();

  PostRender = (function() {

    function PostRender(args) {}

    PostRender.prototype.show = function() {
      return console.log("PostRender show");
    };

    PostRender.prototype.hide = function() {
      return console.log("PostRender hide");
    };

    return PostRender;

  })();

  PostLoader = (function() {

    function PostLoader(args) {}

    PostLoader.prototype.load = function(callback) {
      return console.log("PostLoader load");
    };

    return PostLoader;

  })();

  StateManager = (function() {

    function StateManager() {
      this.loaded = __bind(this.loaded, this);      this.renders = {
        index: new IndexRender(),
        post: new PostRender()
      };
      this.loaders = {
        index: new IndexLoader(),
        post: new PostLoader()
      };
      this.data = {};
    }

    StateManager.prototype.get_state = function() {
      var path;
      path = location.hash.replace(/^#/, '').replace(/^!/, '');
      if (path.length === 0 || path.indexOf("@") !== -1) return "index";
      return "post";
    };

    StateManager.prototype.loaded = function(data) {
      this.data[this.state] = data;
      return this.renders[this.state].show(data);
    };

    StateManager.prototype.update = function() {
      if (this.state) this.renders[this.state].hide();
      this.state = this.get_state();
      return this.loaders[this.state].load(this.loaded);
    };

    return StateManager;

  })();

  state = new StateManager();

  $(document).ready(function() {
    return state.update();
  });

  $(window).hashchange(function() {
    return state.update();
  });

}).call(this);
