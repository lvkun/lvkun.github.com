## 在MFC程序中显示WPF窗口

最近想要在原有系统（基于MFC，非托管）中加入WPF的界面。
搜索了一段时间，发现大部分文章都是在谈托管程序C++中调用WPF，还是不太适合我的需要。于
是自己尝试着从本机C++的MFC程序中调用WPF，使用C# 实现一个COM组件作为中间层。
目标是在MFC程序中弹出一个WPF窗口。

* 建立WPF UserControl library工程

  添加一个Window，命名为MainWindow，实现具体的界面。
  
* 建立C# Library工程

  在工程中添加以下引用:
  
  * WindowsBase
  * PresentationCore
  * PresentationFramework
  * System.Xaml
  * 上面的WPF工程
  
* 定义COM接口（参考[用C#创建COM对象]、[C++调用C# 的COM]）

  添加using System.Runtime.InteropServices; 
  定义接口：ShowMainWindow.
  代码如下：

        [Guid("B5229C49-F49D-4A2C-A9F5-CA1249DE3890")]//使用工具生成的GUID
        public interface UI_Interface
        {
            [DispId(1)]
            void ShowMainWindow();
        }
        
* 实现接口

        [Guid("85512BED-C76D-4163-9454-F32EE634C4B2"),//使用工具生成的GUID
        ClassInterface(ClassInterfaceType.None),
        ComSourceInterfaces(typeof(UI_Events))]
        public class UI_Class : UI_Interface
        {
            public void ShowMainWindow()
            {
                MainWindow main = new MainWindow();
                main.ShowDialog();
            }
        }

* 注册COM接口

  生成强名称文件：
  
        sn –k UI_Interface.snk
        
  在AssemblyInfo.cs中，添加下面一行：
  
        [assembly: AssemblyKeyFile("UI_Interface.snk")]

  将dll加入GAC：
  
        gacutil /i UIInterface.dll
        
  注册：
  
        REGASM UIInterface.dll
        
* 在MFC中添加代码，调用COM组件

  引用COM组件：
  
        #import “<Full Path>\UIInterface.tlb"
        
  添加调用代码：
  
        CoInitialize(NULL);
        UI_InterfacePtruiInterfacePtr;
        HRESULThr= uiInterfacePtr.CreateInstance(__uuidof(UI_Class));
        
        if(hr== S_OK)
        {
            uiInterfacePtr->ShowMainWindow();
        }
        
        CoUninitialize(); 

[用C#创建COM对象]: http://www.yesky.com/378/1615378.shtml
[C++调用C# 的COM]: http://www.cppblog.com/mzty/archive/2007/05/30/25157.html
