class IndexRender

    constructor: ->

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

    update_tag_panel: ->
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

        $("#current-tag-list").click ->
            $("#tag-panel-list").slideToggle "fast"
            $("#extend-button").toggleClass "extend-up"

    show: (index_data) ->
        this.index_data = index_data

        this.filter_tags = this.get_filter_tags()
        this.post_tags = this.get_post_tags index_data
        
        this.update_index()
        this.update_tag_panel()
        this.update_current_tag_panel()

        $("#index").show()

    hide: ->
        $("#index").hide()
  
class IndexLoader

    constructor: (args) ->

    load: (callback) ->
        $.ajax
            url : "post/index.json",
            dataType : 'json',
            success : callback

class PostRender

    constructor: (args) ->
    
    show: ->
        console.log "PostRender show"

    hide: ->
        console.log "PostRender hide"

class PostLoader

    constructor: (args) ->

    load: (callback) ->
        console.log "PostLoader load"

class StateManager
    
    constructor: ->
        this.renders = 
            index: new IndexRender()
            post: new PostRender()

        this.loaders = 
            index: new IndexLoader()
            post: new PostLoader()

        this.data = {}

    get_state: ->
        path = location.hash.replace(/^#/, '' ).replace(/^!/, '')
        if path.length == 0 or path.indexOf("@") != -1
            return "index"

        return "post"

    loaded: (data) =>
        this.data[this.state] = data
        this.renders[this.state].show(data)

    update: ->
        # hide previous state content
        if this.state
            this.renders[this.state].hide()
        
        this.state = this.get_state()

        this.loaders[this.state].load this.loaded

state = new StateManager()

$(document).ready =>
    state.update()

$(window).hashchange =>
    state.update()
