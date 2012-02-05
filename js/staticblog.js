function removeDuplicate(arr){
    var map = {};
    var ret_arr = [];
    $(arr).each(function(){
        if(map[this] == undefined){
            map[this] = this;
            ret_arr.push(this.toString());
        }
    });

    return ret_arr;
}

var blog = {
    /* member variable */
    posts: null,
    post_tags: [],
    filter_tags: [],
    current_path: "",
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
            $("<a class='post-tag-href'>").appendTo($post_tags).text(this.toString()+";").attr("href", "#@"+this.toString());
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
            var $tag_href = $("<a class='tag-href'>").appendTo($tag_item).text(this.toString());
            $tag_href.attr("id", this.toString());
            $tag_href.click(function(){
                if($(this).hasClass("selected")){
                    location.hash = location.hash.replace("@"+$(this).attr("id"), "");
                }else{
                    location.hash += "@"+$(this).attr("id");
                }
            });
        });
    },
    updataTagPanel: function(){
        $(".tag-href").removeClass("selected");
        
        if(blog.filter_tags.length == 0){
            $("#tag-all").addClass("selected");
        }
        
        $(blog.filter_tags).each(function(){
            $("#"+this.toString()).addClass("selected");
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
    },
    showPost: function() {
        $("#index").hide();
        $("#wrapper").show();

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
        
        for(i=0; i<blog.posts.length; i++){
            if(blog.posts[i].path == blog.current_path){
                if(i>0){
                    // not first post
                    blog.updateHref("prev-a", blog.posts[i-1].path);
                }
                else{
                    blog.updateHref("prev-a", "");
                }
                
                if(i<blog.posts.length-1){
                    // not last post
                    blog.updateHref("next-a", blog.posts[i+1].path);
                }
                else{
                    blog.updateHref("next-a", "");
                }
            }
        }
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

        $(window).hashchange(function() {
            blog.updateContent();
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
