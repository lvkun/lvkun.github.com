(function() {
  var Index, IndexRender, Post, PostRender, StateManager, resetDisqus, state,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    _this = this;

  resetDisqus = function(identifier) {
    if (typeof DISQUS !== "undefined" && DISQUS !== null) {
      return DISQUS.reset({
        reload: true,
        config: function() {
          this.page.identifier = identifier;
          if (identifier === "") this.page.identifier = "index";
          this.page.url = location.href;
          return this.page.title = document.title;
        }
      });
    }
  };

  IndexRender = (function() {

    function IndexRender() {
      this.title = document.title;
    }

    IndexRender.prototype.get_filter_tags = function() {
      var filter_tags, path, tags;
      path = location.hash.replace(/^#/, '').replace(/^!/, '');
      tags = path.split("@");
      filter_tags = [];
      if (tags.length > 1) filter_tags = filter_tags.concat(tags.slice(1));
      return filter_tags;
    };

    IndexRender.prototype.get_post_tags = function(index_data) {
      var all_tags, post, tag, tags, _i, _j, _len, _len2;
      tags = {};
      all_tags = [];
      for (_i = 0, _len = index_data.length; _i < _len; _i++) {
        post = index_data[_i];
        all_tags = all_tags.concat(post.tags);
      }
      for (_j = 0, _len2 = all_tags.length; _j < _len2; _j++) {
        tag = all_tags[_j];
        if (tags[tag]) {
          tags[tag] += 1;
        } else {
          tags[tag] = 1;
        }
      }
      return tags;
    };

    IndexRender.prototype.clear_index = function() {
      return $("#index-list").html("");
    };

    IndexRender.prototype.clear_tag_panel = function() {
      return $("#tag-panel-list").html("");
    };

    IndexRender.prototype.clear_current_tag_panel = function() {
      $("#current-tag").html("");
      return $(".tag-href").removeClass("selected");
    };

    IndexRender.prototype.is_should_show = function(post) {
      var filter_tag, _i, _len, _ref;
      if (this.filter_tags.length === 0) return true;
      _ref = this.filter_tags;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        filter_tag = _ref[_i];
        if ($.inArray(filter_tag, post.tags) === -1) return false;
      }
      return true;
    };

    IndexRender.prototype.add_index_item = function(post) {
      var $item_value_list, $post_tags, $post_title, tag, _i, _len, _ref, _results;
      $item_value_list = $("<ul class='index-item-row'>").appendTo($("#index-list"));
      $post_title = $("<li class='post-title'>").appendTo($item_value_list);
      $("<a>").appendTo($post_title).text(post.title).attr("href", "#!" + post.path);
      $("<li class='post-date'>").appendTo($item_value_list).text(post.date);
      $post_tags = $("<li class='post-tags'>").appendTo($item_value_list);
      _ref = post.tags;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tag = _ref[_i];
        _results.push($("<a class='post-tag-href'></a>").appendTo($post_tags).text(tag + ";").attr("href", "#@" + tag));
      }
      return _results;
    };

    IndexRender.prototype.update_index = function() {
      var post, _i, _len, _ref, _results;
      this.clear_index();
      _ref = this.index_data;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        post = _ref[_i];
        if (!this.is_should_show(post)) continue;
        _results.push(this.add_index_item(post));
      }
      return _results;
    };

    IndexRender.prototype.init_tag_panel = function() {
      var $tag_href, $tag_item, key, value, _ref;
      this.clear_tag_panel();
      $("<li class='tag-item'><a id='tag-all' class='tag-href' href='#!'>全部/All</a></li>").appendTo($("#tag-panel-list"));
      _ref = this.post_tags;
      for (key in _ref) {
        value = _ref[key];
        $tag_item = $("<li class='tag-item'></li>").appendTo($("#tag-panel-list"));
        $tag_href = $("<a class='tag-href'></a>").appendTo($tag_item);
        $tag_href.text(key);
        $tag_href.click(function() {
          if ($(this).hasClass("selected")) {
            return location.hash = location.hash.replace("@" + $(this).text(), "");
          } else {
            return location.hash += "@" + $(this).text();
          }
        });
      }
      $("#tag-panel-list").hide();
      return $("#current-tag-list").click(function() {
        $("#tag-panel-list").slideToggle("fast");
        return $("#extend-button").toggleClass("extend-up");
      });
    };

    IndexRender.prototype.update_current_tag_panel = function() {
      var $tag_href, tag, _i, _len, _ref, _results;
      this.clear_current_tag_panel();
      if (this.filter_tags.length === 0) {
        $("#tag-all").addClass("selected");
        $("#tag-all").clone().appendTo($("#current-tag")).removeClass("selected");
      }
      _ref = this.filter_tags;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tag = _ref[_i];
        $tag_href = $("a.tag-href:contains(" + tag + ")").addClass("selected");
        $tag_href = $tag_href.clone().appendTo($("#current-tag")).removeClass("selected");
        _results.push($tag_href.click(function(event) {
          location.hash = location.hash.replace("@" + $(this).text(), "");
          return e.stopPropagation();
        }));
      }
      return _results;
    };

    IndexRender.prototype.update_title = function() {
      return document.title = this.title;
    };

    IndexRender.prototype.init = function(index_data) {
      this.index_data = index_data;
      this.post_tags = this.get_post_tags(index_data);
      return this.init_tag_panel();
    };

    IndexRender.prototype.update = function() {
      this.filter_tags = this.get_filter_tags();
      this.update_index();
      this.update_current_tag_panel();
      this.update_title();
      $("#index").show();
      return resetDisqus("");
    };

    IndexRender.prototype.hide = function() {
      return $("#index").hide();
    };

    return IndexRender;

  })();

  Index = (function() {

    function Index(args) {
      this.get_data = __bind(this.get_data, this);
      this.on_success = __bind(this.on_success, this);      this.render = new IndexRender();
      this.loaded = false;
    }

    Index.prototype.on_success = function(data) {
      this.loaded = true;
      this.data = data;
      this.render.init(data);
      return this.callback();
    };

    Index.prototype.update = function() {
      if (this.loaded) return this.render.update();
    };

    Index.prototype.load = function(callback) {
      this.callback = callback;
      return $.ajax({
        url: "post/index.json",
        dataType: 'json',
        success: this.on_success
      });
    };

    Index.prototype.is_loaded = function() {
      return this.loaded;
    };

    Index.prototype.get_data = function() {
      return this.data;
    };

    Index.prototype.get_title = function() {
      return this.title;
    };

    Index.prototype.hide = function() {
      return this.render.hide();
    };

    return Index;

  })();

  PostRender = (function() {

    function PostRender(args) {
      this.converter = new Showdown.converter();
    }

    PostRender.prototype.init = function() {
      return $("#wrapper").show();
    };

    PostRender.prototype.update_nav_panel = function() {
      this.update_nav_href("prev-a", (this.prev != null) && (this.prev.path != null) ? this.prev.path : "");
      return this.update_nav_href("next-a", (this.next != null) && (this.next.path != null) ? this.next.path : "");
    };

    PostRender.prototype.update_nav_href = function(aClass, path) {
      if (path.length === 0) {
        return $("." + aClass).removeAttr("href");
      } else {
        return $("." + aClass).attr("href", "#!" + path);
      }
    };

    PostRender.prototype.update_highlight = function() {
      return $('pre code').each(function(i, e) {
        return hljs.highlightBlock(e, '    ');
      });
    };

    PostRender.prototype.update_content = function() {
      return $("#post").html(this.converter.makeHtml(this.post_data));
    };

    PostRender.prototype.update_title = function() {
      return document.title = this.post_info.title;
    };

    PostRender.prototype.update = function(post_data, info, prev, next) {
      this.post_data = post_data;
      this.post_info = info;
      this.prev = prev;
      this.next = next;
      this.update_nav_panel();
      this.update_content();
      this.update_highlight();
      this.update_title();
      $("#post").removeClass('background-transparent');
      return resetDisqus(location.hash);
    };

    PostRender.prototype.hide = function() {
      return $("#wrapper").hide();
    };

    PostRender.prototype.clear = function() {
      $("#post").addClass('background-transparent');
      return $("#post").html("");
    };

    return PostRender;

  })();

  Post = (function() {

    function Post(index_data) {
      this.on_success = __bind(this.on_success, this);      this.render = new PostRender();
      this.index_data = index_data;
    }

    Post.prototype.get_post_index = function() {
      var i, post, _len, _ref;
      _ref = this.index_data();
      for (i = 0, _len = _ref.length; i < _len; i++) {
        post = _ref[i];
        if (post.path === this.path) return i;
      }
    };

    Post.prototype.update = function() {
      this.render.clear();
      this.render.init();
      this.path = location.hash.replace(/^#/, '').replace(/^!/, '');
      return $.ajax({
        url: "post/" + this.path + ".md",
        dataType: 'text',
        success: this.on_success
      });
    };

    Post.prototype.on_success = function(data) {
      this.post_index = this.get_post_index();
      this.post_data = data;
      this.render.update(data, this.index_data()[this.post_index], this.index_data()[this.post_index - 1], this.index_data()[this.post_index + 1]);
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    };

    Post.prototype.hide = function() {
      return this.render.hide();
    };

    return Post;

  })();

  StateManager = (function() {

    function StateManager() {
      this.update = __bind(this.update, this);      this.index = new Index();
      this.post = new Post(this.index.get_data);
      this.post.hide();
    }

    StateManager.prototype.get_state = function() {
      var path;
      path = location.hash.replace(/^#/, '').replace(/^!/, '');
      if (path.length === 0 || path.indexOf("@") !== -1) return "index";
      return "post";
    };

    StateManager.prototype.update = function() {
      if (location.hash.length === 0) {
        location.hash += "#!";
        return;
      }
      this.state = this.get_state();
      if (this.state === "index") {
        this.post.hide();
      } else {
        this.index.hide();
      }
      if (!this.index.is_loaded()) {
        return this.index.load(this.update);
      } else {
        return this[this.state].update();
      }
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
