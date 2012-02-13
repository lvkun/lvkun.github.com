function removeDuplicate(arr){
    var map = {};
    var ret_arr = [];
    $(arr).each(function(){
        if(map[this] == undefined){
            map[this] = this;
            ret_arr.push(this);
        }
    });

    return ret_arr;
}

var blog = {
    /* member variable */
    posts: null,
    title: document.title,
    post_tags: [],
    filter_tags: [],
    current_path: "",
    current_index: 0,
    con: new Showdown.converter(),
    
    /* functions */
    filterPost: function(tags){
        var should_show = false;
        if(blog.filter_tags.length > 0){
            for(var i in blog.filter_tags){
                should_show = false;
                
                for(var j in tags){
                    if(blog.filter_tags[i] == tags[j]){
                        should_show = true;
                        break;
                    }
                }
                if(!should_show){
                    return should_show;
                }
            }
        }
        else{
            should_show = true;
        }
        
        return should_show;
    },
    updateIndexItem: function(post_index_data){
        var $item_value_list = $("<ul class='index-item-row'>").appendTo($("#index-list"));
            
        var $post_title = $("<li class='post-title'>").appendTo($item_value_list);
        $("<a>").appendTo($post_title).text(post_index_data.title).attr("href", "#!"+post_index_data.path);
        
        $("<li class='post-date'>").appendTo($item_value_list).text(post_index_data.date);
        var $post_tags = $("<li class='post-tags'>").appendTo($item_value_list);
        $(post_index_data.tags).each(function(){
            // Seems </a> must be added in IE
            $("<a class='post-tag-href'></a>").appendTo($post_tags).text(this+";").attr("href", "#@"+this);
        });
    },
    initTagPanel: function(){
        $("#tag-panel-list").html("");
        
        $(blog.posts).each(function(){
            blog.post_tags = blog.post_tags.concat(this.tags);
        });

        blog.post_tags = removeDuplicate(blog.post_tags);
        
        $("<li class='tag-item'><a id='tag-all' class='tag-href' href='#!'>"+"全部/All"+"</a></li>").appendTo($("#tag-panel-list"));

        $(blog.post_tags).each(function(){
            var $tag_item = $("<li class='tag-item'></li>").appendTo($("#tag-panel-list"));
            // Seems </a> must be added in IE
            var $tag_href = $("<a class='tag-href'></a>").appendTo($tag_item);
            // TODO: Just try out, don't know why
            $tag_href.text(this.toString());
            //$tag_href.attr("id", this.replace(/#/g, ""));
            
            $tag_href.click(function(){
                if($(this).hasClass("selected")){
                    location.hash = location.hash.replace("@"+$(this).text(), "");
                }else{
                    location.hash += "@"+$(this).text();
                }
            });
        });
    },
    updataTagPanel: function(){
        $(".tag-href").removeClass("selected");
        $("#current-tag").html("");
        if(blog.filter_tags.length == 0){
            $("#tag-all").addClass("selected");
            $("#tag-all").clone().appendTo($("#current-tag")).removeClass("selected");
        }
        
        $(blog.filter_tags).each(function(){
            var $tag_href = $("a.tag-href:contains("+this+")").addClass("selected");
            $tag_href.clone().appendTo($("#current-tag")).removeClass("selected");
        });
    },
    updateIndex: function() {
        // clear index content
        $("#index-list").html("");
        
        $(blog.posts).each(function(){
            if(!blog.filterPost(this.tags)){
                // should not be shown
                // because tags not in filter tags
                return;
            }
            
            blog.updateIndexItem(this);
        });
        
        blog.updataTagPanel();
    },
    showIndex: function() {
        $("#wrapper").hide();
        $("#index").show();
        
        if(typeof(DISQUS) != "undefined") {
            DISQUS.reset({
                reload : true,
                config : function() {
                    this.page.identifier = "";
                    this.page.url = location.href;
                }
            });
        }
        
        document.title = blog.title;
    },
    findPostIndex: function() {
        for(i = 0; i < blog.posts.length; i++) {
            if(blog.posts[i].path == blog.current_path) {
                blog.current_index = i;
                break;
            }
        }
    },
    updateNavPanel: function() {
        if(blog.current_index > 0) {
            // not first post
            blog.updateHref("prev-a", blog.posts[blog.current_index - 1].path);
        } else {
            blog.updateHref("prev-a", "");
        }

        if(blog.current_index < blog.posts.length - 1) {
            // not last post
            blog.updateHref("next-a", blog.posts[blog.current_index + 1].path);
        } else {
            blog.updateHref("next-a", "");
        }
    },
    showPost: function() {
        $("#index").hide();
        $("#wrapper").show();
        
        blog.findPostIndex();
        blog.updateNavPanel();
        
        if(blog.posts[blog.current_index]){
            document.title = blog.posts[blog.current_index].title;
        }

        if(typeof(DISQUS) != "undefined") {
            DISQUS.reset({
                reload : true,
                config : function() {
                    this.page.identifier = blog.current_path;
                    this.page.url = location.href;
                }
            });
        }
    },
    hideAll: function() {
        $("#index").hide();
        $("#wrapper").hide();    
    },
    updateContent : function() {
        // load post or show index according to location.hash
        var hash = location.hash;
        blog.current_path = hash.replace(/^#/, '' ).replace(/^!/, '');
        var tags = blog.current_path.split("@");
        
        blog.filter_tags = [];
        if(tags.length > 1){
            blog.filter_tags = blog.filter_tags.concat(tags.slice(1));
        }

        blog.updateIndex();
        
        if(blog.current_path.length == 0 || blog.filter_tags.length > 0) {
            blog.showIndex();
            return;
        }
        
        blog.showPost();
               
        // clear exist content
        $("#post").html("");
        
        $.ajax({
            url : "post/" + blog.current_path + ".md",
            dataType : 'text',
            success : blog.postLoaded
        });
    },
    updateHref : function(aClass, path){
        if(path.length == 0) {
            $("." + aClass).removeAttr("href");
        } else {
            $("." + aClass).attr("href", "#!" + path);
        }
    },

    
    /* event handler */
    postLoaded : function(data) {
        var post_content = blog.con.makeHtml(data);
        $("#post").html(post_content);
        
        $('pre code').each(function(i, e) {hljs.highlightBlock(e, '    ')});
    },
    indexLoaded : function(data) {
        blog.posts = data;
        
        if(blog.posts.length == 0) {
            console.log("no post exist");
            return;
        }
        
        blog.hideAll();
        blog.initTagPanel();

        blog.updateContent();

        // Event handler
        $(window).hashchange(function() {
            blog.updateContent();
        });
        $("#tag-panel-list").hide(); 
        $("#current-tag-list").click(function() {
           $("#tag-panel-list").slideToggle('fast'); 
        });
    }
}

$(document).ready(function() {
    // load post index
    $.ajax({
        url : "post/index.json",
        dataType : 'json',
        success : blog.indexLoaded
    });  
});
