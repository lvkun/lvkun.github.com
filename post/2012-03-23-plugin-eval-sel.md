## Sumlime text 2 插件： Eval Sel

### 前言

[Sublime text 2] 确实是很不错的编辑器，用了挺长一段时间。我认为是我等用不惯 Vim/Emacs 的凡人的最佳选择。最近经常向周围同事推荐。

正在学习 Scheme ，用不惯 [DrRacket] ，而且不太习惯用命令行形式的 REPL 。 于是准备自己开发一个简单的插件，目的是运行当前选中的语句，并显示其输出。

此插件的代码保存在 [github] 上, 有兴趣的同学可以看一看 [Eval Sel]。 插件本身还有不少问题，今后会逐渐改进。

### 开发步骤

[Sublime text 2] 的插件开发使用的是 Python 。具体接口可以参考 [API Reference]。而 [How to Create a Sublime Text 2 Plugin] 提供了一个很好插件开发例子。

#### 使用插件模板

使用 Sublime 菜单 Tools->New Plugin... ，即可创建新的插件：

        import sublime, sublime_plugin

        class ExampleCommand(sublime_plugin.TextCommand):
            def run(self, edit):
                self.view.insert(edit, 0, "Hello, World!")

Sublime的插件中含有一个或多个命令（Command）。每个命令的具体实现在 run 函数中。 现在此插件功能为在当前视图开始处插入 "Hello, World!" 字符串。

#### 保存并修改

在 Sublime 的 Packages 文件夹中， 创建新的文件夹 ``eval_sel`` 。 Packages 文件夹可以通过菜单 Preferences->Browse Packages 打开。

将已生成的文件保存在 ``eval_sel`` 文件中，命名为 ``eval_sel.py`` 。 将

        class ExampleCommand(sublime_plugin.TextCommand):

重命名为：

        class evalselCommand(sublime_plugin.TextCommand):

#### 快捷键配置

在 eval_sel 文件夹下面建立文件：

* Default (Linux).sublime-keymap
* Default (OSX).sublime-keymap
* Default (Windows).sublime-keymap

可以在这些文件中以json格式定义快捷键映射：

        [
            {
                "keys": ["ctrl+alt+e"], "command": "evalsel"  
            }
        ]

这样每次按 ctrl + alt + e 时，就会执行 evalsel 命令。

#### 具体实现

##### 获取选中文本

``view.sel()`` 能够返回选中的区域集合（有可能存在多个选中区域）。获取第一个选中区域。

        sel = self.view.sel()[0]

``view.substr`` 则能获取区域所包含的文本 
        
        expression = self.view.substr(sel)

##### 传递给解释器

在 Sublime 中，可以使用 Python 的大部分标准类库。这种情况可以使用 subprocess 启动一个子进程，传递字符串到子进程的 stdin ，并从子进程的 stdout 获取结果。

###### 启动子进程

        self.process = subprocess.Popen(evaluator, 
                    stdin=subprocess.PIPE, 
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT)

evaluator 是用来启动解释器的参数列表，一般是解释器的路径，比如使用 [Racket] 时为 ``["racket"]`` （racket.exe 已经加入系统路径）。 但这里需要注意一点，使用某些解释器的时候，需要加入额外的参数，让其采用交互模式，比如使用 [Python] 时为 ``["python", "-u", "-i"]``。

将 ``stdin/stdout`` 设置为 ``subprocess.PIPE`` ，则表明打开指向 ``stdin/stdout`` 管道。

###### 将表达式传递给子进程

子进程的 ``stdin/stdout`` 可以当做标准的文件对象进行读写。 采用交互模式时，在写入后，要注意调用 ``flush`` 刷新缓存。

        self.process.stdin.write(expression + "\n")
        self.process.stdin.flush()

###### 从子进程获取结果

从 ``stdout`` 读取内容时，需注意读取时会被阻塞，所以要在另一个线程中读取。这里实现了简单的读取线程。

        class readThread(threading.Thread):  
            def __init__(self, process, file_io, output):  
                self.file_io = file_io
                self.output = output
                self.process = process
                threading.Thread.__init__(self)
            
            def run(self):
                if not self.file_io:
                    return

                while True:
                    line = self.file_io.readline()
                    
                    if len(line) == 0:
                        break;

                    sublime.set_timeout(functools.partial(self.output, 
                                "%s" % (line)), 0)

##### 输出结果

Sublime 为插件提供了 ``output_panel`` ，相当一个特殊的 view 对象。 需要通过 window 对象的接口，获取 ``output_panel`` 对象。

        def show_output_view(self):
            if not self.output_view:
                self.output_view = self.view.window().get_output_panel("evalsel")
            self.view.window().run_command('show_panel', {'panel': 'output.evalsel'})

插入代码：

        def output(self, info):
            self.output_view.set_read_only(False)
            edit = self.output_view.begin_edit()
            
            self.output_view.insert(edit, self.output_view.size(), info)
            self.scroll_to_view_end()

            self.output_view.end_edit(edit)
            self.output_view.set_read_only(True)

### 发布

最简单的方法是将插件发布到网上，让用户自己下载到 Packages 文件夹中。

但有更方便的方法就是，通过 [Packages control] 发布。参考 [Submitting a Package] 介绍，只需要简单地几步即可。

[Sublime text 2]: http://www.sublimetext.com/2
[DrRacket]: http://racket-lang.org/
[Racket]: http://racket-lang.org/
[github]: https://github.com
[Python]: http://www.python.org
[Eval Sel]: https://github.com/lvkun/eval_sel
[API Reference]: http://www.sublimetext.com/docs/2/api_reference.html
[How to Create a Sublime Text 2 Plugin]: http://net.tutsplus.com/tutorials/python-tutorials/how-to-create-a-sublime-text-2-plugin/
[Packages control]: http://wbond.net/sublime_packages/package_control
[Submitting a Package]: http://wbond.net/sublime_packages/package_control/package_developers#Submitting_a_Package