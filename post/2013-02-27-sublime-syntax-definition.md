## Sublime Text 2 : 语法定义文件

近半年来在使用一种Scheme的变种语言做开发，没有适合的编辑器支持，于是自己通过[Sublime text 2]的Lisp package，改造出来一个。主要是修改了其中的语法定义文件。估计大家在刚接触语法定义文件时都会感到难以入手。这篇文章主要讲一些自己在这一过程中遇到的难点。[Sublime Text Docs]中的[Syntax Definitions]对语法定义文件有更加详细的介绍。

[Sublime text 2]: http://www.sublimetext.com/2
[Sublime Text Docs]: http://docs.sublimetext.info/en/latest/index.html
[Syntax Definitions]: http://docs.sublimetext.info/en/latest/extensibility/syntaxdefs.html

### 使用[AAAPackageDev]

“工欲善其事，必先利其器”，[AAAPackageDev]可以大大加速[Sublime text 2]的扩展（尤其是语法定义文件）的开发。
[AAAPackageDev]: https://bitbucket.org/guillermooo/aaapackagedev

#### 安装

下载[AAAPackageDev 安装文件](.sublime-package 文件)，复制到Sublime text的Installed Packages目录下，重启Sublime text即可。
[AAAPackageDev 安装文件]: https://bitbucket.org/guillermooo/aaapackagedev/downloads/AAAPackageDev.sublime-package

#### 创建语法定义文件

在Sublime text的菜单选择：Tools | Packages | Package Development | New Syntax Definition，或者可以打开命令面板，输入new，选择z:AAAPackageDev:New Syntax Definition

将其保存到Sublime text的Packages目录下面，文件名后缀设置为.JSON-tmLanguage

#### Build System

[Sublime Text 2]使用了与[Textmate]相同的语法定义文件格式(tmlanguage)。

### 编辑语法定义文件

语法定义文件可以认为是很多组正则表达式和与其对应的Scope名称。Scope是缓存中被命名的文本区域（named text regions in a buffer）。Sublime通过语法文件中的正则表达式来匹配缓存中的文本，将所有匹配上的地方关联对应的Scope名称。

[Textmate Online Manual]对Scope有详细的介绍。

[Textmate Online Manual]: http://manual.macromates.com/en/scope_selectors#scope_selectors

[Textmate]: http://macromates.com/




