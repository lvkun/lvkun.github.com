resetDisqus = (identifier) ->
    if DISQUS?
        DISQUS.reset
            reload : true,
            config : ->
                this.page.identifier = identifier
                if identifier == ""
                    this.page.identifier = "index"
                this.page.url = location.href
                this.page.title = document.title

class IndexRender

    constructor: ->
        this.title = document.title

    get_filter_tags: ->
        path = location.hash.replace(/^#/, '' ).replace(/^!/, '')
        tags = path.split("@")

        filter_tags = []
        if tags.length > 1
            filter_tags = filter_tags.concat tags.slice(1)

        return filter_tags

    get_post_tags: (index_data) ->
        tags = {}

        all_tags = []
        all_tags = all_tags.concat post.tags for post in index_data

        for tag in all_tags
            if tags[tag]
                tags[tag] += 1
            else
                tags[tag] = 1

        return tags

    clear_index: ->
        $("#index-list").html ""

    clear_tag_panel: ->
        $("#tag-panel-list").html ""

    clear_current_tag_panel: ->
        $("#current-tag").html ""
        $(".tag-href").removeClass "selected"

    is_should_show: (post) ->
        if this.filter_tags.length == 0
            # should show all post
            return true

        for filter_tag in this.filter_tags

            if $.inArray(filter_tag, post.tags) == -1
                return false

        return true

    add_index_item: (post) ->
        $item_value_list = $("<ul class='index-item-row'>").appendTo $("#index-list")
        $post_title = $("<li class='post-title'>").appendTo $item_value_list

        $("<a>")
            .appendTo($post_title)
            .text(post.title)
            .attr("href", "#!"+post.path)

        $("<li class='post-date'>")
            .appendTo($item_value_list)
            .text(post.date)

        $post_tags = $("<li class='post-tags'>").appendTo $item_value_list

        for tag in post.tags
            $("<a class='post-tag-href'></a>")
                .appendTo($post_tags)
                .text(tag+";")
                .attr("href", "#@"+tag);

    update_index: ->
        this.clear_index()

        for post in this.index_data

            if !this.is_should_show(post)
                continue

            this.add_index_item(post)

    init_tag_panel: ->
        this.clear_tag_panel()
        $("<li class='tag-item'><a id='tag-all' class='tag-href' href='#!'>全部/All</a></li>").appendTo $("#tag-panel-list")

        for key, value of this.post_tags
            $tag_item = $("<li class='tag-item'></li>").appendTo $("#tag-panel-list")
            $tag_href = $("<a class='tag-href'></a>").appendTo $tag_item
            $tag_href.text key

            $tag_href.click ->
                if $(this).hasClass "selected"
                    location.hash = location.hash.replace "@" + $(this).text(), ""
                else
                    location.hash += "@" + $(this).text()

        $("#tag-panel-list").hide();

        $("#current-tag-list").click ->
            $("#tag-panel-list").slideToggle "fast"
            $("#extend-button").toggleClass "extend-up"

    update_current_tag_panel: ->
        this.clear_current_tag_panel()

        if this.filter_tags.length == 0
            $("#tag-all").addClass "selected"
            $("#tag-all").clone()
                .appendTo($("#current-tag"))
                .removeClass("selected")

        for tag in this.filter_tags
            $tag_href = $("a.tag-href:contains("+tag+")").addClass("selected")
            $tag_href = $tag_href.clone()
                .appendTo($("#current-tag"))
                .removeClass("selected")

            $tag_href.click (event) ->
                location.hash = location.hash.replace "@"+$(this).text(), ""
                e.stopPropagation()

    update_title: ->
        document.title = this.title

    init: (index_data) ->
        this.index_data = index_data
        this.post_tags = this.get_post_tags index_data
        this.init_tag_panel()

    update: ->
        this.filter_tags = this.get_filter_tags()

        this.update_index()
        this.update_current_tag_panel()
        this.update_title()

        $("#index").show()
        resetDisqus ""

    hide: ->
        $("#index").hide()

class Index

    constructor: (args) ->
        this.render = new IndexRender()
        this.loaded = false

    on_success: (data) =>
        this.loaded = true
        this.data = data
        this.render.init(data)
        this.callback()

    update: ->
        if this.loaded
            this.render.update()

    load: (callback) ->
        this.callback = callback
        $.ajax
            url : "post/index.json",
            dataType : 'json',
            success : this.on_success

    is_loaded: ->
        return this.loaded

    get_data: =>
        return this.data

    get_title: ->
        return this.title

    hide: ->
        this.render.hide()

class PostRender

    constructor: (args) ->
        this.converter = new Showdown.converter()

    init: ->
        $("#wrapper").show()

    update_nav_panel: ->
        this.update_nav_href "prev-a", if this.prev? and this.prev.path? then this.prev.path else ""
        this.update_nav_href "next-a", if this.next? and this.next.path? then this.next.path else ""

    update_nav_href: (aClass, path)->
        if path.length == 0
            $("." + aClass).removeAttr "href"
        else
            $("." + aClass).attr "href", "#!"+path

    update_highlight: ->
        $('pre code').each (i, e)->
            hljs.highlightBlock e, '    '

    update_content: ->
        $("#post").html this.converter.makeHtml this.post_data

    update_title: ->
        document.title = this.post_info.title

    update: (post_data, info, prev, next)->
        this.post_data = post_data
        this.post_info = info
        this.prev = prev
        this.next = next

        this.update_nav_panel()
        this.update_content()
        this.update_highlight()
        this.update_title()

        $("#post").removeClass 'background-transparent'

        resetDisqus location.hash

    hide: ->
        $("#wrapper").hide()

    clear: ->
        # clear exist content
        $("#post").addClass 'background-transparent';
        $("#post").html ""

class Post

    constructor: (index_data) ->
        this.render = new PostRender()
        this.index_data = index_data

    get_post_index: ->
        for post, i in this.index_data()
            if post.path == this.path
                return i

    update: ->
        this.render.clear()
        this.render.init()

        this.path = location.hash.replace(/^#/, '' ).replace(/^!/, '')
        $.ajax
            url : "post/" + this.path + ".md",
            dataType : 'text',
            success : this.on_success

    on_success: (data) =>
        this.post_index = this.get_post_index()
        this.post_data = data

        this.render.update(data,
            this.index_data()[this.post_index]
            this.index_data()[this.post_index-1],
            this.index_data()[this.post_index+1])

        MathJax.Hub.Queue ["Typeset",MathJax.Hub]
        return

    hide: ->
        this.render.hide()

class StateManager

    constructor: ->
        this.index = new Index()
        this.post = new Post(this.index.get_data)

        this.post.hide()

    get_state: ->
        path = location.hash.replace(/^#/, '' ).replace(/^!/, '')
        if path.length == 0 or path.indexOf("@") != -1
            return "index"

        return "post"

    update: =>
        if location.hash.length == 0
            location.hash += "#!"
            return

        # hide previous state content
        this.state = this.get_state()

        if this.state == "index"
            this.post.hide()
        else
            this.index.hide()

        if !this.index.is_loaded()
            # index should be loaded at first
            this.index.load(this.update)
        else
            this[this.state].update()

state = new StateManager()

$(document).ready =>
    state.update()

$(window).hashchange =>
    state.update()
