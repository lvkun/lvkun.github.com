class IndexRender

    constructor: ->

    show: (index_data) ->
        console.log index_data

    hide: ->
        console.log "IndexRender hide"
  
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

        # pass function show of render as callback
        this.loaders[this.state].load this.loaded

state = new StateManager()

$(document).ready =>
    state.update()

$(window).hashchange =>
    state.update()
