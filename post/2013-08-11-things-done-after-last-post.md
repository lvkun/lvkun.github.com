## 杂记

从三月份开始，家里的事情很多，主要是媳妇怀孕和房子装修，而工作也开始逐渐忙碌起来，所以一直到现在都没有更新博客。

但这期间还是抽时间学了一些东西。

### Coursera

在 [Coursera] 上面陆陆续续听了几门课，包括：

* [Algorithms, Part I]
* [Algorithms, Part II]
* [Natural Language Processing]
* [Algorithms: Design and Analysis, Part 1]

不过 [Natural Language Processing] 和 [Algorithms, Part II] 都因为业余时间有其他事情没有完全完成。决定继续参加这两门课下一次 session 。

[Coursera]:https://www.coursera.org/
[Natural Language Processing]:https://www.coursera.org/course/nlangp
[Algorithms, Part I]:https://www.coursera.org/course/algs4partI
[Algorithms, Part II]:https://www.coursera.org/course/algs4partII
[Algorithms: Design and Analysis, Part 1]:https://www.coursera.org/course/algo

### Bootstrap

业余时间研究了 [Bootstrap] ，将博客的CSS框架 换成了 Bootstrap ，界面看上去简洁清爽很多。

接下来如果有时间会研究 [Angularjs] ，希望可以使页面代码更加简洁。

[Bootstrap]:http://getbootstrap.com/
[Angularjs]:http://angularjs.org/

### 开始挖坑

接下来准备利用业余时间写一个基于 [node-webkit] 和 [ACE] 的编辑器。已经有很多非常优秀的编辑器（如 vim ，emacs ，Sublime Text等）和IDE（Visual Studio ，Eclipse），按理说不应该再重新造轮子。
不过我这次想写一个具有以下优点通用的插件框架：

1. 编写插件更加容易（采用js+html+css方式，并且支持调用nodejs）

2. 实现更加丰富的界面交互效果

其实 [Sublime Text] 插件开发已经很方便了，但是 [Sublime Text] 插件输出非常单一，只能以文本或者列表形式。在我设想的框架下，插件可以通过网页方式输出结果以及进行交互，完全不受限制，甚至可以访问网络，或者建立本地数据库。

[ACE]:http://ace.c9.io/
[node-webkit]:https://github.com/rogerwang/node-webkit
[Sublime Text]:http://www.sublimetext.com/
