var blog = {
    posts : null,
    loadPost : function(path) {

    },
    postLoaded : function(data) {

    },
    indexLoaded : function(data) {
        posts = data;

        if(posts.length == 0) {
            console.log("no post exist");
            return;
        }

        var hash = location.hash;
        if(hash.length == 0) {
            // load the newest post
            console.log(posts[0].path);
        } else {
            // load the post defined in hash(date+title)

        }

        $(window).hashchange(function() {
            var hash = location.hash;

            // load the post defined in hash(date+title)
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
