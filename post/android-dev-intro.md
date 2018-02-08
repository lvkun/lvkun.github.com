# Android 应用开发简介

从 2014 年到现在一直在做 Android 平台上的应用开发。在这里简单整理一下 Android 应用开发需要了解的相关知识。[更新中]

## 基础

### Linux

首先需要明白 Android 本身是建立在 Linux 之上的。对 Linux 以及操作系统需要有一定的了解。从实用角度来讲，至少要知道 shell 如何使用。

而理解下列 Linux 相关机制会促进对 Android 开发的掌握

- 进程/线程
- 进程间通信
- IO
- 内存

推荐书籍：[UNIX环境高级编程]

### Java

虽然目前应用开发逐渐向 Hybrid 迁移，但是 Java 还是应用开发工程师必须要掌握的。

我认为应用开发需要掌握的 Java 基础知识：

- 基础语法
- 并发
- 常用类库
- 虚拟机
- JNI

推荐书籍：[Effective java 中文版]，[The Java Language Specification]，[深入理解java虚拟机]

## Android

Android本身包含非常广泛

### 四大组件

无论如何，Android 四大组件是必须掌握

- Activity
- Service
- Broadcast
- Content Provider

### UI

应用开发中有一大部分工作是 UI，UI 相关知识必须牢牢掌握

- 布局
- View
- 事件处理
- Theme & Style
- 动画

### 网络访问

- 并发
- 网络请求

### 编译

Android 编译流程

### 自动化测试

### 工具

- [adb]
- [logcat]
- [systrace]

### Hybrid

#### Web 开发

[UNIX环境高级编程]:https://book.douban.com/subject/1788421/
[Effective java 中文版]:https://book.douban.com/subject/3360807/
[The Java Language Specification]:https://docs.oracle.com/javase/specs/jls/se7/html/index.html
[深入理解java虚拟机]:https://book.douban.com/subject/24722612/
[adb]:https://developer.android.com/studio/command-line/adb.html
[logcat]:https://developer.android.com/studio/command-line/logcat.html
[systrace]:https://developer.android.com/studio/command-line/systrace.html