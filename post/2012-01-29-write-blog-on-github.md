## 在Github上写博客

### 起因

工作后，我一直在[博客园]写博客，不过这几年一共只写了几篇。分析其中的原因：

* 不够专注

  工作和生活上的事情有很多，很难一次性写完一篇长的博客；
  常常会没有思路，或者突如其来的一些事情打断了写作。
  
* 更喜欢用本地工具
  
  使用本地编辑器习惯了，在网页里面写总会感到别扭。

* 喜欢纯文本格式
  
  喜欢[reStructuredText]，以及[Markdown]；不愿意在调整格式上，花太多时间。

* 其实更喜欢写代码
  
  作为程序员，写代码的时候很快乐，而写文档的时候很痛苦。

### 转向Github

虽然很早就听说了Git，但是2011年才开始学习和使用Git，
主要还是因为公司要将版本管理工具从Synergy转向Git。
在学习过程中接触到了Github。我眼中的大牛[刘未鹏]的文章[《怎样花两年时间去面试一个人》]，
让我认识到Github是程序员展示自己的最佳网站。
而[蒋鑫]老师的文章[用 Git 维护博客？酷！]启发了我使用Git Page服务来展示自己的博客。

### 使用Git Page

在Github上创建个人主页非常方便，只要创建一个名为(user-id).github.com的版本库，
并将自己编写的网页文件推送到master分支即可。

[用 Git 维护博客？酷！]中有成熟的解决方案[Jekyll]，不过本人厌恶生成过程，
更懒得装Ruby环境（本人是坚定的Python拥护者），就自己写了个简单的静态页面，
通过javascript代码动态加载markdown格式的博客文章，在前台转换成html展示。
这样只需要文本编辑器和Git即可方便的进行维护（在添加新博文时，需要手动维护index.json）。

对网页样式一直很苦恼，第一不熟悉，第二做不到美观，借用了[蒋鑫]老师的部分样式，希望不要介意 :)

### 优点

* 使用Markdown格式，感觉有点像写代码，而且不容易因为格式调整打断思路。
* 可以写一部分提交一次，git保存了完整的提交历史，让自己的思路更有延续性。
* 使用写字板和git就可以维护此博客。

### 部分细节

* 导航

  本博客的文章使用[Markdown]格式保存在post目录下，路径（path）的命名格式为(date)-(title).md。
  使用[jQuery hashChange]插件获取hashChange事件，
  并且通过location.hash来判断应该显示某篇文章还是博客目录。
  
  * 显示目录： (页面地址)
  
  * 使用Tag过滤（显示同时有Tag1，Tag2，...标签的文章）： (页面地址)+(#!)+(@Tag1)+(@Tag2)+...
  
  * 显示某篇文章： (页面地址)+(#!)+(path)

* [Markdown]

  如果当前需要显示某篇文章，通过location.hash获取文章路径。
  请求后，使用[showdown.js]进行转换，并插入到页面中。

* 评论

  采用[Disqus]评论系统。参照[Universal Code]，在页面中添加相应代码即可。
  另外就是切换文章时，需要参照[Using Disqus on AJAX sites]，重新加载Disqus thread。
  
* 代码高亮

  使用[highlight.js]，文章加载完成后，高亮所有代码模块：
  
        $('pre code').each(function(i, e) {hljs.highlightBlock(e, '    ')});
  

### 题外话

本人在工作中一直使用C/C++，网页开发可以说刚刚入门。如果博客上有什么Bug，请及时指出，万分感谢。
对博客样式有什么改进意见的，更加欢迎。
另外如果大家对以下话题感兴趣，尽可以找我讨论：

* Git
* C/C++
* Python
* Javascript

附： [博客园]支持发布html代码，写完文章后可以打开chrome开发视图，找到div#post节点，
复制其中html代码。在[博客园]的后台，找到编辑HTML源代码选项，打开窗口，粘贴进去即可，非常方便。

[博客园]: http://lvkun.cnblogs.com
[reStructuredText]: http://docutils.sourceforge.net/rst.html
[Markdown]: http://daringfireball.net/projects/markdown/
[刘未鹏]: http://mindhacks.cn/
[《怎样花两年时间去面试一个人》]: http://mindhacks.cn/2011/11/04/how-to-interview-a-person-for-two-years/
[蒋鑫]: http://www.worldhello.net/about.html
[用 Git 维护博客？酷！]: http://www.worldhello.net/2011/11/29/jekyll-based-blog-setup.html
[Jekyll]: https://github.com/mojombo/jekyll
[showdown.js]: https://github.com/coreyti/showdown
[jQuery hashChange]: http://benalman.com/projects/jquery-hashchange-plugin/
[Disqus]: http://disqus.com
[Universal Code]: http://docs.disqus.com/developers/universal/
[Using Disqus on AJAX sites]: http://docs.disqus.com/help/85/
[highlight.js]: https://github.com/isagalaev/highlight.js