## 博客代码更新

这次更改是用 [Angularjs] 代替 [jQuery] 生成HTML。
[Angularjs] 是 Google 提供的一套前端开发框架，上手简单，功能强大。
本文简单总结一下经验和感受。


### 使用 [Angularjs] 中遇到的问题

#### 路由

在 HTML 中添加 `ng-view ` 节点（当前一个页面中只能存在一个）

    <div ng-view></div>

然后就可以通过路由定义，针对不同的路径在此里使用不同的模板

    app = angular.module('blog', ['ngSanitize'])
            .config(['$routeProvider', ($routeProvider) ->
                $routeProvider
                    .when("", {templateUrl: "partials/index-list.html"})
                    .when("/tag/:tag", {templateUrl: "partials/index-list.html"})
                    .when("/resume", {templateUrl: "partials/resume.html"})
                    .when("/post/:postPath", {templateUrl: "partials/post.html"})

而且路径配置时支持参数，如 `#/tag/Angularjs` ，在 controller 中 $routeParams.postPath 就是 `Angualrjs` 。

#### 获取后端数据

在 controller 中使用 $http 即可，例如:

    app.controller 'ResumeCtrl', ($scope, $http) ->
        $http.get("resume.json").success (data) ->
            $scope.resume = data

但我需要在两个 controller (IndexListCtrl, PostCtrl) 里面都使用到 index.json （目录信息）的数据。所以将获取 index.json 的代码封装成 Service.

    angular.module('blog', ['ngSanitize'])
        ......
        .factory("indexService", ($http) ->
            indexService = {
                async : () ->
                    promise = $http.get('post/index.json').then( (response)->
                        return response.data
                    )
                    return promise
            }
            return indexService
        )

使用的时候可以这样调用：

    indexService.async().then( (data)->
        # handle the data
    )

#### 修改DOM

一般情况可以在 HTML 中使用模板标记 `{{}}` 直接引用作用域（ $scope ）的变量，用以生成内容。

但是如果想要对生成以后的HTML内容进行修改，则需要自定义 `directive`

    angular.module('blog', ['ngSanitize'])
        ......
        .directive('ngMarkdown', () ->
            return (scope, element, attrs) ->
                scope.$watch( attrs.ngMarkdown, (value) ->
                    if value?
                        html = converter.makeHtml value
                        element.html html

                        for el in document.body.querySelectorAll('pre code')
                            hljs.highlightBlock el
                )
        )

在 HTML 中使用这个 `directive` ， 绑定到 postContent ， postContent 为 [Markdown] 格式的博客文章内容

    <div ng-markdown="postContent"></div>

这样如果 postContent 内容更改，则会在先使用 converter.makeHtml 将 [Markdown] 转换为 HTML ，并填充到 `div` 中，然后遍历所有 `pre code` 结点进行高亮。

### 感受

[Angularjs] 确实功能很强大，我这个博客比较简单，很多功能都没有用上。
js文件体积较大，80KB，不过不依赖与其他库就可以运行。
有一些概念和用法（比如 `directive` ）需要在使用时需要留意。如果想要在实际项目中使用，建议通读一遍 [Developer Guide]


[Angularjs]:http://angularjs.org/
[jQuery]:http://jquery.com/
[Markdown]: http://daringfireball.net/projects/markdown/
[Developer Guide]:http://docs.angularjs.org/guide/
[JavaScript MVC框架PK：Angular、Backbone、CanJS与Ember]:http://www.ituring.com.cn/article/38394

