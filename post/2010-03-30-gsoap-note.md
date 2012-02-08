## gSoap使用笔记

(基于gsoap-win32-2.7版本，编译环境为VS2005)

### 客户端

访问自己定义的一个WebService（命名为AddService，对输入的两个整形参数求和，具体服务定义参见 AddService.wsdl）

* 转换WSDL

        wsdl2h.exe -s -o AddService.h AddService.wsdl

* 生成具体调用代码

  在命令行输入：
        
        soapcpp2.exe -C AddService.h

  生成代码后，AddService.h就没有用了，不用加入到工程中。

#### 生成的文件

  * soapStub.h 
  * soapAddServiceSoapBindingProxy.h：封装了调用webservice的类 
  * soapH.h 
  * soapClientLib.cpp：用不到 
  * soapClient.cpp 
  * soapC.cpp 
  * AddServiceSoapBinding.nsmap：namespaces声明，需要包含在一个cpp文件里面，
    比如放在 StdAfx.cpp里面，否则连接时报错：unresolved external symbol _namespaces 

还需要stdsoap2.cpp和stdsoap2.h文件，在gsoap-2.7soapcpp2目录下。

注意：#include "StdAfx.h"加到第一行，否则VC编译报错：
fatal error C1010: unexpected end of file
while looking for precompiled header directive

#### 实际调用代码

将这些文件加入到C++工程中，可以使用以下代码调用WebService：

  * 头文件 
    
        //包含代理类的头文件
        #include"gSoap\soapAddBindingProxy.h"

  * 声明访问代理对象 
    
        AddBinding serviceBinding;

  * 设置访问的WebServiceURL

        serviceBinding.endpoint=("http://LocalHost:8082/");

  * 调用接口

        int iResult;
        nRetCode = serviceBinding.__ns1__AddOperation(12, 22,iResult);

### 服务端

实现AddService（对输入的两个整形参数求和）

#### 生成调用代码

同客户端生成方法基本一致。需要注意的是以下几点：

* 由.h文件生成具体调用代码：soapcpp2.exe -S AddService.h 
* soapClient.cpp soapClientLib.cpp soapServerLib.cpp这三个文件不需要加入到C++工程中。 

#### 实现服务线程

* 在程序开始时，启动服务线程。

        UINT GSoapServiceThreadFunc(LPVOID p)

        {

        ...

        }

* 定义编码格式 

        //设置UTF-8编码方式
        soap_set_mode(&soap,SOAP_C_UTFSTRING);

* 设置服务的端口号 

        // 端口号
        int port = 8083;
        int backlog = 100; //
        int m = soap_bind(&soap, NULL, port, backlog);
        if(m < 0)
        {
            strOutput.Format(_T("GSoapServiceThreadFunc——在端口%d上启动服务失败！"), port);
            OutputDebugString(strOutput);
            soap_done(&soap); // close master socket and detach environment
            exit(-1);
        }

* 设置超时 

        soap.accept_timeout = 5;// 设置GSoap连接超时，单位：秒

* 创建循环，监听，如果有新连接进来则创建请求处理现场 

        while(TRUE)
        {
            if( WaitForSingleObject(g_eventTerminateService.m_hObject, 0) == WAIT_OBJECT_0 )
            // 结束GSoap服务线程
            {
                break;
            }
            int s = soap_accept(&soap);
            if( !soap_valid_socket(s) )
            {
                if( soap.errnum )
                {
                    soap_print_fault(&soap, stderr);
                    soap_done(&soap); // close master socket and detach environment
                    exit(1);
                }
                strOutput.Format(_T("\nGSoapServiceThreadFunc——等待客户端连接超时！"));
                OutputDebugString(strOutput);
            }
            else
            {
                struct soap* tsoap = soap_copy(&soap); // make a safe copy
                if( !tsoap )
                {
                    break;
                }
                AfxBeginThread(process_request, tsoap);
            }
        }

#### 实现请求处理线程

相应代码

        /// GSoap请求处理线程
        UINT process_request(LPVOID soap)
        {
            CoInitialize(NULL);

            soap_serve((struct soap*)soap);         // 会自动调用具体的接口函数
            soap_destroy((struct soap*)soap);       // dealloc C++ data
            soap_end((struct soap*)soap);           // dealloc data and clean up
            soap_done((struct soap*)soap);          // detach soap struct
            free(soap);

            CoUninitialize();

            return 0;
        }

#### 实现接口功能函数

* 在代码中定义相应的接口功能函数

        int __ns1__AddOperation(struct soap*, int A, int B, int &result)
        {
            result = A + B;
            return SOAP_OK;
        }

* 函数原型在soapStub.h中定义
  
        /******************************************************************************\
         *                                                                            *
         * Service Operations                                                         *
         *                                                                            *
        \******************************************************************************/

        SOAP_FMAC5 int SOAP_FMAC6 __ns1__AddOperation(struct soap*, int A, int B, int &result);

现在采用的是默认的命名空间前缀，可以使用typemap.dat文件赋予自定义的命名空间。

### 常见问题

#### 支持访问wsdl

* 首先要设置回调处理函数 

        soap.fget=http_get;
        soap.fpost=http_post;

* 两个回调函数的接口定义(stdsoap2.h) 
    
        int (*fpost)(struct soap*, const char*, const char*, int, const char*, const char*, size_t);
        int (*fget)(struct soap*);

* 根据接口定义实现相应的函数 
    
        int http_post(struct soap *soap, const char *endpoint, const char *host, 
                      int port,const char *path, const char *action, size_t count)
        {
            return http_get( soap ); // 简单处理，直接调用http_get
        }

        int http_get(struct soap *soap)
        {
             ...
        }

* 在http_get函数中解析外部访问路径，并且获取相应的wsdl文件名

        // 请求WSDL时，传送相应文件
        // 获取请求的wsdl文件名
        string fielPath(soap->path);
        size_t pos = fielPath.rfind("/");
        string fileName(fielPath, pos+1);

        // 将?替换为.
        size_t dotPos = fileName.rfind("?");

        if(dotPos == -1)
        {
            // 未找到
            return 404;
        }

        fileName.replace(dotPos,1, ".");    

* 打开WSDL文件发送到客户端

        // 打开WSDL文件准备拷贝
        FILE* fd = fopen(fileName.c_str(), "rb");
        if (!fd)
        {
            // return HTTP not found error
            return 404;
        }
        // HTTP header with text/xml content
        soap->http_content = "text/xml";
        soap_response(soap, SOAP_FILE);
        for(;;)
        {
            // 从fd中读取数据
            size_t r = fread(soap->tmpbuf, 1, sizeof(soap->tmpbuf), fd);
            if (!r)
            {
                break;
            }
            // 发送数据
            if (soap_send_raw(soap, soap->tmpbuf, r))
            {
                // can't send, but little we can do about that
                break;
            }
        }
        // 关闭fd
        fclose(fd);
        soap_end_send(soap);
        return SOAP_OK;

#### 修改命名空间前缀

修改gSoapServer工程使用的命名空间前缀。在wsdl中的命名空间为"http://new.webservice.namespace/"

* 在typemap.dat文件最后添加一行
    
        NSNEW="http://new.webservice.namespace"

* 转换wsdl文件时添加参数
    
        wsdl2h.exe -t typemap.dat -s -o AddService.h AddService.wsdl

* 查看函数原型(soapStub.h)，可以看到前缀已经被改变 
    
        SOAP_FMAC5 int SOAP_FMAC6 __NSNEW__AddOperation(struct soap*, int A, int B, int &result);
