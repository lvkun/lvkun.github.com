var blog = {
    posts : null,
    con: new Showdown.converter(),
    loadPost : function() {
        // load post according to location.hash
        var hash = location.hash;
        var path = "";
        if(hash.length == 0) {
            // load the newest post
            path = blog.posts[0].path;
        } else {
            // load the post defined in hash(date+title)
            path = hash.replace(/^#/, '' );
        }
        
        $.ajax({
            url : "_post/" + path + ".md",
            dataType : 'text',
            success : blog.postLoaded
        });
    },
    postLoaded : function(data) {
        var post_content = blog.con.makeHtml(data);
        $("<div id='top_panel'>").appendTo($("#wrapper"));
        $("<div class='post'>").appendTo($("#wrapper")).html(post_content);
        $("<div id='bottom_panel'>").appendTo($("#wrapper"));
    },
    indexLoaded : function(data) {
        blog.posts = data;

        if(blog.posts.length == 0) {
            console.log("no post exist");
            return;
        }

        blog.loadPost();

        $(window).hashchange(function() {
            // clear exist content
            $("#wrapper").html("");
            
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
