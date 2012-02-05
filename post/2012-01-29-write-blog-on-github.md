## 在Github上写博客

### 起因

工作后，我一直在[博客园]写博客，不过这几年一共只写了几篇。分析其中的原因：

* 不够专注

  工作和生活上的事情有很多，很难一次性写完一篇长的博客；常常会没有思路，或者突如其来的
  一些事情打断了写作。
  
* 更喜欢用本地工具
  
  使用本地编辑器习惯了，在网页里面写总会感到别扭。

* 喜欢纯文本格式
  
  喜欢reStructuredText，以及Markdown；不愿意在调整格式上，花太多时间。

* 其实更喜欢写代码
  
  作为程序员，往往写代码的时候很快乐，而写文档的时候很痛苦。

### 转向Github

虽然很早就听说了Git，但是2011年才开始学习和使用Git，主要还是因为公司要将版本管理工具从
Synergy转向Git。在学习过程中接触到了Github。我眼中的大牛[刘未鹏]的文章[《怎样花两年时间去面试一个人》]，
让我认识到Github是程序员展示自己的最佳网站。而[蒋鑫]老师的文章[用 Git 维护博客？酷！]启发了我使用
Git Page服务来展示自己的博客。

### 使用Git Page

在Github上创建个人主页非常方便，只要创建一个名为(user-id).github.com的版本库，并将自
己编写的网页文件推送到master分支即可。

[用 Git 维护博客？酷！]中有成熟的解决方案[Jekyll]，不过本人厌恶生成过程，更懒得装Ruby
环境（本人是坚定的Python拥护者），就自己写了个简单静态页面，通过javascript代码动态加载
markdown格式的博客文章，在前台转换成html展示。这样只需要文本编辑器和Git即可方便的进行
维护（在添加新博文时，需要手动维护index.json）。

对网页样式一直很苦恼，第一不熟悉，第二做不到美观，借用了[蒋鑫]老师的部分样式，希望不要介意 :)

[博客园]: http://lvkun.cnblogs.com
[刘未鹏]: http://mindhacks.cn/
[《怎样花两年时间去面试一个人》]: http://mindhacks.cn/2011/11/04/how-to-interview-a-person-for-two-years/
[蒋鑫]: http://www.worldhello.net/about.html
[用 Git 维护博客？酷！]: http://www.worldhello.net/2011/11/29/jekyll-based-blog-setup.html
[Jekyll]: https://github.com/mojombo/jekyll