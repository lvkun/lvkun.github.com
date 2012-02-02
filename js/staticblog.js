var blog = {
    posts : null,
    current_path: "",
    con: new Showdown.converter(),
    loadPost : function() {
        // load post according to location.hash
        var hash = location.hash;
        
        if(hash.length == 0) {
            // load the newest post
            blog.current_path = blog.posts[0].path;
        } else {
            // load the post defined in hash(date+title)
            blog.current_path = hash.replace(/^#/, '' );
        }
        // clear exist content
        $("#post").html("");
        
        $.ajax({
            url : "_post/" + blog.current_path + ".md",
            dataType : 'text',
            success : blog.postLoaded
        });
    },
    updateHref : function(aClass, path){
        $("."+aClass).attr("href", "#"+path);
        $("."+aClass).removeClass("noref");
        if(path.length == 0){
            $("."+aClass).addClass("noref");
        }
    },
    postLoaded : function(data) {
        var post_content = blog.con.makeHtml(data);
        $("#post").html(post_content);
        
        for(i=0; i<blog.posts.length; i++){
            if(blog.posts[i].path == blog.current_path){
                if(i>0){
                    // not first post
                    blog.updateHref("prev_a", blog.posts[i-1].path);
                }
                else{
                    blog.updateHref("prev_a", "");
                }
                
                if(i<blog.posts.length-1){
                    // not last post
                    blog.updateHref("next_a", blog.posts[i+1].path);
                }
                else{
                    blog.updateHref("next_a", "");
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

        blog.loadPost();

        $(window).hashchange(function() {
            blog.loadPost();
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
