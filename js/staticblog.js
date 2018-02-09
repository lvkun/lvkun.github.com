var client = new XMLHttpRequest()
var converter;

function getArticle(hash) {
  if (hash === "") {
    return "README.md"
  } else {
    start = hash.indexOf("#!/")
    return "post/" + hash.substring(start + 3) + ".md"
  }
}

function loadArticle(article, callback) {
  client.onreadystatechange = function() {
    if (client.readyState == 4 && client.status == 200) {
      callback(client.responseText)
    }
  }
  client.open("GET", article, true)
  client.send(null)
}

function onArticleLoaded(articleText) {
  html = converter.makeHtml(articleText)
  document.getElementById("content").innerHTML = html

  ref = document.body.querySelectorAll('pre code');
  for (j = 0, len = ref.length; j < len; j++) {
    el = ref[j];
    hljs.highlightBlock(el);
  }
  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

function onReady() {
  converter = new Showdown.converter()

  var article = getArticle(window.location.hash)
  loadArticle(article, onArticleLoaded)
  window.onhashchange = function() {
    var article = getArticle(window.location.hash)
    loadArticle(article, onArticleLoaded)
  }
}

if (document.readyState !== "loading") {
  onReady()
} else {
  document.addEventListener("DOMContentLoaded", onReady())
}

