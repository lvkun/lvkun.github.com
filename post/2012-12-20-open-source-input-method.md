## 开源中文输入法

在Windows上面中文拼音输入法数不胜数。简单数了一下自己用过，就有六种以上：

* 智能ABC
* 微软拼音
* 紫光拼音
* 搜狗输入法
* 谷歌输入法
* QQ输入法
* ......

可参考[wikipedia 中文输入法列表]，以及[小众软件 我最喜欢的《拼音输入法》]。在手机端各种拼音输入法种类更多。

而在Unix和Linux平台上也存在不少中文输入法，它们不仅免费，而且开源。如果想要了解输入法的实现，不妨从它们入手。

输入法大致可分为三部分：

1. 输入法框架
2. 输入法引擎
3. 输入法界面

关于输入法结构的介绍，可以参见这篇文章[Packaging Input Method Framework and Engines]。

### 输入法框架

Windows系统提供统一的输入法框架，在Windows XP和之前版本是IMM（Input Method Manger），之后是TSF（Text Service Framework）。搜狗，谷歌，QQ等输入法都是在IMM框架下面实现了引擎和界面。而Linux下面输入法框架并不统一，这给兼容性带来很大问题。

#### [IBus]

Intelligent Input Bus。相对较新。使用C和Python开发。

特点：

* 输入法引擎可以按需加载\卸载
* 支持系统托盘（Systray）
* 支持XKB
* 配置更改即可生效
* 提供C和Python的绑定

提供以下拼音输入法引擎：

* ibus-pinyin
  IBus主要开发者开发的
* ibus-googlepinyin
  由Android项目移植过来

#### [Scim]

Smart Common Input Method。历史比较悠久，曾作为多数Linux发行版默认的中文输入法。使用C++开发。

特点：

* 使用C++编写，完全面向对象。
* 高度模块化。
* 非常灵活的架构，即可以用作动态加载的库，也可以作为C/S输入法环境。
* 简单的编程接口。
* 完全支持i18n，及UCS-4/UTF-8编码
* 包含很多方便实用的函数来加速开发
* 特性非常丰富的GUI Panel
* 统一的配置框架

提供以下拼音输入法引擎：

* scim-ccinput
* novel-pinyin
* scim-pinyin
* fitx
* scim-sunpinyin

#### [Fcitx]

小企鹅输入法，Free Chinese Input Toy for X。

特点：

* 支持主题（Theme）
* 支持系统托盘（Systray）
* 支持Kimpanel
* 支持KDE配置模块
* 全局简繁转换

提供以下拼音输入法引擎：

* fcitx-pinyin
* fcitx-sunpinyin
* fcitx-googlepinyin

#### [Rime]

全名中州韵输入法，不仅仅是一个输入法，而是一个输入法算法框架。
非常有创意地通过YAML格式的配置文件，定制输入法。参见[RimeWithSchemata]

> Rime 是一款强调个性的输入法。
> Rime 不要定义输入法应当是哪个样、而要定义输入法可以玩出哪些花样。
> Rime 不可能通过预设更多的输入方桉来满足玩家的需求；真正的玩家一定有一般人想不到的高招。

它支持主流操作系统：

* Linux: 中州韵 ibus-rime
* Windows: 小狼毫 Weasel
* Mac OS X: 鼠须管 Squirrel

### 输入法引擎

除了输入法框架自带的pinyin输入法引擎，[sunpinyin]，[libgooglepinyin]比较常用。

#### [sunpinyin]

[sunpinyin]是基于统计语言模型（Statistical Language Model）输入法引擎。支持上述的三个输入法框架。
Mac下面的FIT输入法也将[sunpinyin]作为输入法引擎。参见[FIT携手sunpinyin]。

> SunPinyin是由Sun中国工程研究院的北京国际化中心开发，并贡献给开源社区的。最初由张磊（Phill.Zhang）博士独立完成，后来由众多的社区开发者共同推进，目前的版本是2.0.x。支持整句输入，能够记录用户的词汇和语言模型，从而训练出更适合你的输入法。

在Google code的项目的wiki上面，有三篇非常详细的代码导读系列文章，可以让有兴趣的人能有相对深入了解的途径。
很少能看到类似关于拼音输入法引擎如何实现的文章。

* [SunPinyin代码导读 - 输入法引擎]
* [SunPinyin代码导读 - 语言模型的训练]
* [SunPinyin代码导读 - 词表与拼音切分]

#### [libgooglepinyin]

Google pinyin Android 版本（注意不是桌面版本）是曾经开源的，但从2009年后就再未更新。[libgooglepinyin]就是从这个版本移植过来的。同样的项目还有[scim-googlepinyin]、[fcitx-googlepinyin]。

Github上还有反向工程版本[com.google.android.inputmethod.pinyin]

### 其他有趣的项目

#### [libpinyin]

参见[开源拼音输入法社区的大融合]。[libpinyin]是SunPinyin、Novel Pinyin和iBus-Pinyin社区联合创建的子项目，致力于为中文拼音输入法提供智能整句输入的算法核心，将试图合并novel-pinyin和sunpinyin中的智能拼音整句输入算法部分。

#### [javachinesepinyin]

> 这是一个中文拼音输入法的Java实现，基于HMM模型，无词典，能完成拼音转汉字，和汉字转拼音的任务，并结合Edit Distance使其具有中文输入纠错功能。

### 结论

输入法相关的开源项目很多，但成熟并实际应用的不多，很多个人项目不再更新，甚至没有内容。今后会继续关注，不断在这篇文章进行更新。

[wikipedia 中文输入法列表]: http://zh.wikipedia.org/wiki/%E4%B8%AD%E6%96%87%E8%BC%B8%E5%85%A5%E6%B3%95%E5%88%97%E8%A1%A8
[小众软件 我最喜欢的《拼音输入法》]: http://www.appinn.com/my-fav-pinyin-input-method-final/
[IBus]: https://code.google.com/p/ibus/
[Scim]: http://www.scim-im.org/
[Fcitx]: http://fcitx-im.org/wiki/Fcitx

[sunpinyin]: https://github.com/sunpinyin/sunpinyin
[FIT携手sunpinyin]: http://funinput.com/club/blog/read?bid=302
[SunPinyin代码导读 - 输入法引擎]: https://code.google.com/p/sunpinyin/wiki/CodeTourOfIME
[SunPinyin代码导读 - 语言模型的训练]: https://code.google.com/p/sunpinyin/wiki/CodeTourOfSLMTraining
[SunPinyin代码导读 - 词表与拼音切分]: https://code.google.com/p/sunpinyin/wiki/CodeTourOfLexicon

[libgooglepinyin]: https://code.google.com/p/libgooglepinyin/
[scim-googlepinyin]: http://code.google.com/p/scim-googlepinyin/
[fcitx-googlepinyin]: https://github.com/fcitx/fcitx-googlepinyin/
[com.google.android.inputmethod.pinyin]: https://github.com/rainux/com.google.android.inputmethod.pinyin

[Rime]: https://code.google.com/p/rimeime/
[RimeWithSchemata]: https://code.google.com/p/rimeime/wiki/RimeWithSchemata

[libpinyin]: https://github.com/libpinyin/libpinyin
[libpinyin slideshare]:http://www.slideshare.net/pengewu/libpinyin
[开源拼音输入法社区的大融合]: http://yongsun.me/2010/10/%E5%BC%80%E6%BA%90%E6%8B%BC%E9%9F%B3%E8%BE%93%E5%85%A5%E6%B3%95%E7%A4%BE%E5%8C%BA%E7%9A%84%E5%A4%A7%E8%9E%8D%E5%90%88%EF%BC%88libpinyin%EF%BC%89/
[javachinesepinyin]: https://code.google.com/p/javachinesepinyin/

[Packaging Input Method Framework and Engines]: http://zh.opensuse.org/index.php?title=Packaging_Input_Method_Framework_and_Engines&variant=zh-cn