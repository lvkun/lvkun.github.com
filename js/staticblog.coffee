class IndexRender

    constructor: (args) ->

  
class IndexLoader

    constructor: (args) ->

        
class PostRender

    constructor: (args) ->
        
class PostLoader

    constructor: (args) ->

class StateManager
    
    constructor: (args) ->
        renders = 
            index: new IndexRender()
            post: new PostRender()

        loaders = 
            index: new IndexLoader()
            post: new PostLoader()

    init: ->
        console.log "StateManager init"

state = new StateManager()

$(document).ready =>
    state.init()