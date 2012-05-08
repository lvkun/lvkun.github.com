## Cython 使用笔记

### 前言

最近 bug 改的差不多了，新项目也没有开始。闲不住，自己又开始折腾，准备使用 Cython 对当前使用的 C 库进行封装。目的有以下三个：

* 对该 C 库的接口及代码进行初步了解；
* 简化以后对该 C 库的单元测试开发；
* 对python和c之间的交互有一个初步了解；

### Cython 简介

> [Cython] 是一门基于 [Python] 的编程语言，
> 通过额外的语法允许可选择的静态类型声明。
> 它的目标是成为 [Python] 的超集，
> 而[Python] 赋予它高级，面向对象，函数式以及动态编程等特性。
> 使用 [Cython] 编写的源代码会被转换成优化过的 C/C++ 代码，
> 并且被编译成 Python 的扩展模块。
> 这样即有非常快的程序执行速度和与外部C程序库的紧密集成，
> 也可以保持 Python 语言所著称的高程序员生产力。

本文主要记录在使用 [Cython] 过程中遇到的问题。

[Cython]: http://www.cython.org/
[Python]: http://www.python.org/

### 使用 Cython 过程中的问题

#### 安装

可以直接下载 [windows 二进制安装包] 。

[windows 二进制安装包]: http://www.lfd.uci.edu/~gohlke/pythonlibs/#cython

#### Unable to find vcvarsall.bat

编译时提示 error: Unable to find vcvarsall.bat 。已经安装VC，并且将该 bat 文件路径加入 Path 环境变量也无法解决问题。在 [Cython FAQ] 中找到解决方案，如果没有使用 pyximport ，又安装了 cygwin ，可以在编译参数加上参数 --compiler=mingw32 来解决问题。

[Cython FAQ]: http://wiki.cython.org/FAQ#HowdoIworkaroundthe.22unabletofindvcvarsall.bat.22errorwhenusingMinGWasthecompiler.28onWindows.29.3F

#### Python undefined reference

编译时，出现很多错误信息如：

    undefined reference to `_imp__PyInt_Type'

需要参照 [InstallingOnWindows] 中的 Troubleshooting，编译 libpythonXX.a 。（XX 代表 Python 版本号，如 libpython27.a）

> 1. 下载 [pexport]
> 2. 找到 pythonXX.dll
> 3. 运行：
> 
>         pexports pythonXX.dll > pythonXX.def
> 
>   这样会提取 pythonXX.dll 的所有符号并将它们写入 pythonXX.def 。
> 
> 4. 运行：
> 
>         dlltool --dllname pythonXX.dll --def pythonXX.def --output-lib > libpythonXX.a
> 
>   这样会创建 libpythonXX.a
> 
> 5. 将 libpythonXX.a 拷入 python 路径中的 libs 文件夹下。

[InstallingOnWindows]: http://wiki.cython.org/InstallingOnWindows
[pexport]: http://www.emmestech.com/software/pexports-0.43/download_pexports.html

#### 读取二进制文件

1. 打开文件并读取所有内容为字符串

        data = open("data", "r")

2. 将字符串强制转换为 ``bytes`` ，赋值给 ``char*`` 类型指针

        cdef char* content = <bytes>data 

3. 将指针转换为指定类型传递给C库接口

        lib_interface(<TypePTR>content)

#### 导出头文件宏定义常量

假设在头文件 interface.h 中存在常量定义：

    #define IF_OK 0

将此定义导出需要：

1. 需要在 lib.pxd 文件中使用 ``enum`` 定义该常量

        cdef extern from "interface.h":
            enum: IF_OK

2. 在 lib.pyx 文件中：

        cimport lib

        IF_OK = lib.IF_OK

#### 动态内存分配

可以通过：

    from libc.stdlib cimport *

使用 ``malloc`` 、 ``free`` 等 C 标准库函数


