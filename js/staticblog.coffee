class IndexRender

    constructor: (args) ->

    show: ->
        console.log "IndexRender show"

    hide: ->
        console.log "IndexRender hide"
  
class IndexLoader

    constructor: (args) ->

    load: (callback) ->
        console.log "IndexLoader load"

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
    
    constructor: (args) ->
        this.renders = 
            index: new IndexRender()
            post: new PostRender()

        this.loaders = 
            index: new IndexLoader()
            post: new PostLoader()

    get_state: ->
        path = location.hash.replace(/^#/, '' ).replace(/^!/, '')
        if path.length == 0 or path.indexOf("@") != -1
            return "index"

        return "post"

    update: ->
        # hide previous state content
        if this.state
            this.renders[this.state].hide()
        
        this.state = this.get_state()

        # pass function show of render as callback
        this.loaders[this.state].load this.renders[this.state].show

state = new StateManager()
$(document).ready =>
    state.update()
