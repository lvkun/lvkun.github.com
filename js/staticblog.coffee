resetDisqus = (identifier) ->
    if DISQUS?
        DISQUS.reset
            reload : true,
            config : ->
                this.page.identifier = identifier
                if identifier == ""
                    this.page.identifier = "index"
                this.page.url = location.href
                this.page.title = document.title

converter = new Showdown.converter()
app = angular.module('blog', ['ngSanitize'])
        .config(['$routeProvider', ($routeProvider) ->
            $routeProvider
                .when("", {templateUrl: "partials/index-list.html"})
                .when("/tag/:tag", {templateUrl: "partials/index-list.html"})
                .when("/resume", {templateUrl: "partials/resume.html"})
                .when("/post/:postPath", {templateUrl: "partials/post.html"})
        ]).directive('ngMarkdown', () ->
            return (scope, element, attrs) ->
                scope.$watch( attrs.ngMarkdown, (value) ->
                    if value?
                        html = converter.makeHtml value
                        element.html html

                        for el in document.body.querySelectorAll('pre code')
                            hljs.highlightBlock el

                        MathJax.Hub.Queue ["Typeset",MathJax.Hub]
                )
        ).factory("indexService", ($http) ->
            indexService = {
                async : () ->
                    promise = $http.get('post/index.json').then( (response)->
                        return response.data
                    )
                    return promise
            }
            return indexService
        )

app.controller 'HeaderCtrl', ($scope, $http, $location) ->
    $http.get("config.json").success (data) ->

        getState = (path) ->
            items = path.split("/")

            if items.length > 1 and items[items.length-1] == "resume"
                return "Resume"

            return "Blog"

        $scope.state = getState($location.path())
        $scope.config = data

        $scope.$on("$locationChangeSuccess", (event, newLoc, oldLoc) ->
            $scope.state = getState($location.path())
        )

app.controller 'IndexListCtrl', ($scope, $routeParams, indexService) ->

    indexService.async().then( (data)->

        buildTagList = (indexData) ->
            all_tags = []
            all_tags = all_tags.concat post.tags for post in indexData

            tags = {}
            for tag in all_tags
                if tags[tag]
                    tags[tag]["count"] += 1
                else
                    tags[tag] = {"text" : tag, "href" : "#/tag/" + tag, "count" : 1}

            tags["All"] = {"text" : "All", "href" : "#/", "count" : indexData.length}
            return tags

        $scope.indexList = data
        indexService.indexData = data

        $scope.tagList = buildTagList(data)

        if $routeParams.tag? and $routeParams.tag.length != 0
            tag = $routeParams.tag
        else
            tag = "All"

        $scope.currentTag = $scope.tagList[tag]
        if tag == "All"
            $scope.currentTag.filter = ""
        else
            $scope.currentTag.filter = tag
    )

app.controller 'PostCtrl', ($scope, $http, $routeParams, indexService) ->

    $http.get("post/" + $routeParams.postPath + ".md").success (data) ->
        $scope.postContent = data

        indexService.async().then( (data)->
            i = 0
            for post in data
                if post.path == $routeParams.postPath
                    $scope.prevPostPath = ""
                    $scope.nextPostPath = ""

                    if data[i-1]?
                        $scope.prevPostPath= "#/post/" + data[i-1].path
                    if data[i+1]?
                        $scope.nextPostPath= "#/post/" + data[i+1].path

                    break
                i++
        )

app.controller 'ResumeCtrl', ($scope, $http) ->

    $http.get("resume.json").success (data) ->

        $scope.resume = data


