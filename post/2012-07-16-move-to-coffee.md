## 使用 Coffee Script 重写博客前台

今年三月份的时候，我将博客[迁移到 github] 。当时花的时间不多，
对 javascript 使用也不是很熟练。尤其是 javascript 如何定义类，
了解的几种方式，总让我有些不太习惯。所以写的比较混乱，
基本上将所有代码都写到了一个对象里。

从五月份开始，项目上比较忙，博客就没有更新。前两天刚刚忙完，
看着混乱的js代码，决定下手收拾一下。

### 选择 Coffee Script

[Coffee Script] 我也是第一次接触。不过 [Coffee Script] 的语法还是比较简单，
花个半个小时熟悉一下就可以了。

个人认为 [Coffee Script] 的优点主要有：

1. 代码简洁，可读性强
2. 生成的javascript代码经过优化，且比较规范。
3. 语法特性少，学习时间短。
4. 解决了回调中this关键字的问题。

决定以后涉及到javascript的代码都用[Coffee Script]代替。

### 改造结果

这次将以前的逻辑拆分为5个类，每个函数也都不超过20行。
统计了一下，总体的代码行数和字符数基本上和改造前一样。
在增加了很多空行，以及类和函数的声明的情况下，这个结果还不错。
至少可读性大大增加了。


[迁移到 github]: #!2012-01-29-write-blog-on-github
[Coffee Script]: http://coffeescript.org
[回调中this关键字]: http://coffeescript.org/#fat_arrow