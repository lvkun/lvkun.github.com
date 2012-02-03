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
                for(var j in tags){
                    if(blog.filter_tags[i] == tags[j]){
                        should_show = true;
                    }
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
        $("<a>").appendTo($post_title).text(post_index_data.title).attr("href", "#"+post_index_data.path);
        
        $("<li class='post-date'>").appendTo($item_value_list).text(post_index_data.date);
        var $post_tags = $("<li class='post-tags'>").appendTo($item_value_list);
        $(post_index_data.tags).each(function(){
            $("<a class='post-tag-href'>").appendTo($post_tags).text(this.toString()+";").attr("href", "#@"+this.toString());
        });
        blog.post_tags = blog.post_tags.concat(post_index_data.tags);
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
        
        blog.post_tags = removeDuplicate(blog.post_tags);
    },
    showIndex: function() {
        $("#wrapper").hide();
        $("#index").show();
    },
    updateContent : function() {
        // load post or show index according to location.hash
        var hash = location.hash;
        blog.current_path = hash.replace(/^#/, '' );
        
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
        
        $("#index").hide();
        $("#wrapper").show();
        
        // clear exist content
        $("#post").html("");
        
        $.ajax({
            url : "_post/" + blog.current_path + ".md",
            dataType : 'text',
            success : blog.postLoaded
        });
    },
    updateHref : function(aClass, path){
        if(path.length == 0) {
            $("." + aClass).removeAttr("href");
        } else {
            $("." + aClass).attr("href", "#" + path);
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

        blog.updateContent();

        $(window).hashchange(function() {
            blog.updateContent();
        });
    }
}

$(document).ready(function() {
    // load post index
    $.ajax({
        url : "_post/index.json",
        dataType : 'json',
        success : blog.indexLoaded
    });
});
