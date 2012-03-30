## 翻译： Waf 教程

### 前言

本人刚刚接触 Waf ，加之翻译水平一般，有什么错误大家见谅。

精确版本请看 [原文地址]

[Waf] 是一份用来帮助编译软件工程的软件。本教程的目标是提供如何为一个使用 [Waf] 的工程设置脚本的简要说明。

### Waf 脚本与命令

软件通常有保存在版本管理系统（git, subversion 等等）的 *源文件（source files）*，以及描述如何处理这些文件的 *编译脚本（build scripts）* （Makefiles，...）。一些 **生成文件（build files）** 通常由 *源文件（source files）* 转换而得，但它们是可选的。在 [Waf] 中编译脚本是那些命名为 'wscript' 的文件。

通常，一个工程包含下面若干阶段：

* 配置（configure）： 配置工程，找到依赖项的位置
* 编译（build）： 将源文件转换为生成文件
* 安装（install）： 安装生成文件
* 卸载（uninstall）： 卸载生成文件
* 打包（dist）： 生成源文件的存档
* 清理（clean）： 删除生成文件

每一阶段在 ``wscript`` 文件中都是以一个 Python 函数构造的，该函数使用 ``waflib.Context.Context`` 的一个实例作为函数。

让我们从在文件夹 ``/tmp/myproject`` 下 新建一个 ``wscript`` 文件开始：

    def configure(conf):
        print("configure!")

    def build(bld):
        print("build!")


我们也需要一个 [Waf] 二进制文件，如： http://waf.googlecode.com/files/waf-1.6.1 ， 并把该文件拷贝到工程目录下：

    $ cd /tmp/myproject
    $ wget http://waf.googlecode.com/files/waf-1.6.1

我们只需简单地将命令作为参数传递给 ``waf`` 即可运行此工程：

    $ ./waf-1.6.1 configure build
    configure!
    build!

### 目标

编译系统的一个重要组成部分是声明目标的创建过程。这里有一个非常简单的例子：

    def build(bld):
        tg = bld(rule='cp ${SRC} ${TGT}', source='wscript', target='foo.txt')
        bld(rule='cp ${SRC} ${TGT}', source='foo.txt', target='bar.txt')

调用 ``bld(..)`` 创建了一个 **任务生成器（task generator）** ，它用来生成 **任务（tasks）** 。 任务则实际运行命令 ``cp``。 命令直到所有脚本都被读取后才会运行，这对计算编译顺序非常重要。

表达式 *${SRC}* 和 *${TGT}* 是快捷方式，用来避免文件名重复。更多的快捷方式可以通过使用 *${}* 符合定义，该符号能从 ``bld.env`` 属性读取对应的值。

    def build(bld):
        bld.env.MESSAGE = 'Hello, world!'
        bld(rule='echo ${MESSAGE}', always=True)

``bld`` 对象是类 ``waflib.Build.BuildContext``，它的 ``env`` 属性是类 ``waflib.ConfigSet.ConfigSet`` 的一个实例。

这些值被保存在此对象中以便于共享/保存/加载。这里是如何在配置和编译过程中共享数据来实现和上个例子同样的事情：

    def configure(cnf):
        cnf.env.MESSAGE = 'Hello, world!'

    def build(bld):
        bld(rule='echo ${MESSAGE}', always=True)

### 脚本与工具

为让一个脚本使用子目录下的另一脚本，需要使用方法 ``waflib.Context.Context.recurse`` 及包含 ``wscript`` 文件夹的相对路径。例如，调用 ``src/wscript`` 脚本中 ``build`` 函数，应该这样写：

    def build(bld):
        bld.recurse('src')

[Waf] 通过特定模块 ``Waf tools`` 提供了对特定语言和编译器的支持。这些工具与 ``wscript`` 文件类似且提供如 ``configure`` 或者 ``build`` 函数。这里是一个C语言的简单工程：

    def options(opt):
        opt.load('compiler_c')
    def configure(cnf):
        cnf.load('compiler_c')
    def build(bld):
        bld(features='c cprogram', source='main.c', target='app')

``options`` 函数是另一个预定义的命令，用来设置命令行选项。它的参数是 ``waflib.Options.OptionsContext`` 的一个实例。 提供了工具 ``compiler_c``用以检测是否有 C 编译器存在，并设置各种参数如 ``cnf.env.CFLAGS``。

用 ``bld`` 声明的任务生成器并没有 **规则（rule）** 关键字，而是用一系列 **特性（features）** 来引用那些调用适当规则的方法。 在这个例子中，一个规则被调用以编译文件，而另一个用来链接目标文件到二进制文件 ``app`` 。
还存在其他一些工具依赖的 **特性（features）** 如： ``javac``，``cs`` 或者 ``tex`` 。

### 一个同时使用C和C++的工程

下面是一个更复杂一些工程的脚本

    def options(opt):
        opt.load('compiler_c compiler_cxx')
    def configure(cnf):
        cnf.load('compiler_c compiler_cxx')
        configure.check(features='cxx cxxprogram', lib=['m'], cflags=['-Wall'], defines=['var=foo'], uselib_store='M')
    def build(bld):
        bld(features='c cshlib', source='b.c', target='mylib')
        bld(features='c cxx cxxprogram', source='a.c main.cpp', target='app', use=['M','mylib'], lib=['dl'])

方法 ``waflib.Tools.c_config.check`` 会内部执行编译以检测在操作系统中是否存在 ``libm`` 库。然后它会定义变量如：

* ``conf.env.LIB_M = ['m']``
* ``conf.env.CFLAGS_M = ['-Wall']``
* ``conf.env.DEFINES_M = ['var=foo']``

通过声明 ``use=['M', 'mylib']``，程序 *app* 会继承所有在配置过程中定义的 *M* 变量。该程序也会使用库 *mylib* 并且编译顺序和依赖项都会更改以使 *mylib* 在 *app* 之前链接。

``use`` 属性也适用于其他语言如Java（jar 文件之间的依赖）或者C#（程序集之间的依赖）。

### 工程特定扩展

*feature* 关键字是高层次的对现有 Waf 方法的引用。例如： **c** feature 会添加方法 ``waflib.Tools.ccroot.apply_incpaths`` 以执行。要添加一个为所有C目标加入任务生成器路径到包含路径的新方法，可以采用如下声明：

    from waflib import Utils
    from waflib.TaskGen import feature, before_method
    @feature('c')
    @before_method('apply_incpaths')
    def add_current_dir_to_includes(self):
        self.includes = Utils.to_list(self.includes)
        self.includes.append(self.path)

    def build(bld):
        tg = bld(features='c', source='main.c', target='app')

这些 *feature* 方法被绑定到类 ``waflib.TaskGen.task_gen`` ，在这个例子中是对象 *tg* 的类。新的 feature 可以以相同的方式声明： 

    from waflib.TaskGen import feature, after_method
    @feature('debug_tasks')
    @after_method('apply_link')
    def print_debug(self):
        print('tasks created %r' % self.tasks)

    def build(bld):
        tg = bld(features='c cprogram debug_tasks', source='main.c', target='app')

通过绑定新方法到 context 类， 声明可以变得更加用户友好。

    from waflib.Build import BuildContext
    def enterprise_program(self, *k, **kw):
        kw['features'] = 'c cprogram debug_tasks'
        return self(*k, **kw)
    BuildContext.enterprise_program = enterprise_program

    def build(bld):
        # no feature line
        bld.enterprise_program(source='main.c', target='app')

这些辅助代码放到单独文件中即可以成为一个 Waf 工具。为了便于部署，新的 Waf 工具甚至可以被添加到 Waf 文件中（参见 http://code.google.com/p/waf/source/browse/trunk/README）。

### 结论

教程到此结束。 更多信息请参考[apis]，[Waf book]，[examples]。

[Waf]: http://code.google.com/p/waf/
[原文地址]: http://docs.waf.googlecode.com/git/apidocs_16/tutorial.html
[apis]: http://docs.waf.googlecode.com/git/apidocs_16/index.html
[Waf book]: http://waf.googlecode.com/svn/docs/wafbook/single.html
[examples]: http://code.google.com/p/waf/source/browse/#git%2Fdemos