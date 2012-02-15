## 初次尝试Chrome扩展开发——以幻灯片方式显示网页内的图片

使用Chrome浏览器很长时间了。每次在论坛里看图片的时候，总会觉得广告和文字太多，
心里想如果能够全屏看图片就好了。

于是准备开发一个Chrome扩展,命名为imageGallery：

* 能以全屏幻灯片的方式浏览图片
* 能将尺寸比较小的图片过滤掉
* 支持快捷键

本人在工作中做的是桌面和嵌入式开发，只用过C/C++/C#，对javascript/jQuery没有怎么接触过。
代码中如果存在什么问题，请大家原谅。

### 准备工作

首先是需要找一个jQuery的幻灯片插件。在比较几个插件之后，最后选择了[GALLERIA]。
主要是它提供的全屏模式，比较符合我心中的要求。同时学习下[Chrome扩展开发文档]，熟悉开发流程。

### 正式开始

#### 扩展清单文件（manifest.json）

创建imageGallery目录。在该目录下创建文件manifest.json。
这里面包含了扩展的相关信息，以供Chrome使用。本文只对用到的字段做简单解释，可参见详细的介绍。

        {
            // 插件名称
            "name": "imageGallery",
            // 插件版本,Chrome会根据插件的版本号大小，来判断是否需要升级
            "version": "1.0",
            // 插件描述，显示在扩展管理页面（chrome://extensions/）中
            "description": "show the images of the page in a slide",

            "icons": {"16": "icons\\gallery16.png", // 16*16, 作为扩展页面的favicon
            "48": "icons\\gallery48.png", // 48*48, 扩展管理页面（chrome://extensions/）中使用
            "128": "icons\\gallery128.png"}, // 128*128 安装过程以及Chrome WebStore中使用

            // 后台页面，本扩展中用来监控以下事件
            // 1. 用户点击浏览器工具栏的扩展图标
            // 2. Tab页更新事件
            "background_page": "background.html",
            // 配置页面
            "options_page": "options.html",
            // 权限
            "permissions": [
            "tabs", "http://*/*" // 允许扩展使用chrome.tabs或者chrome.windows模块
            ],
            // 在web页面满足某种条件时，注入js或者css（存在一些限制，后面详细讲）
            "content_scripts": [
            {
            "matches": ["http://*/*"], // 匹配任意web页面
            "js": ["jquery-1.4.3.min.js", "galleria.js", "imageGallery.js", "themes\\fullscreen\\galleria.fullscreen.js"]
            }
            ],
            // 定义扩展在浏览器工具栏的显示
            "browser_action": {
            "default_title": "Click to show image gallery", // 提示文本
            "default_icon": "icons\\gallery48.png" // 显示在浏览器工具栏的扩展图标
            }
        }

在imageGallery目录下，创建background.html和options.html，内容可以为空。
同时将不同分辨率（16*16,48*48,128*128）的图标拷贝到icons目录下。
确保manifest.json中指定的文件都存在，不然Chrome将无法载入该扩展。

#### 载入jQuery和Galleria

[下载jQuery]，保存在imageGallery目录下。本扩展中采用的版本是1.4.3。
[下载GALLERIA],将galleria.js保存在imageGallery目录下。使用fullscreen主题。
保存在themes\fullscreen\下。

创建imageGallery.js，在里面输入：

        if (Galleria){
            console.log("Galleria is imported");
        }

打开chrome://extensions/，选择开发人员模式，点击“载入正在开发的扩展程序...”，选择刚才创建的imageGallery目录。这样imageGallery扩展就被载入。

打开任意一个网页，比如http://www.google.com.hk,然后打开开发人员工具，可以看到Console输出“Galleria is imported”，说明Galleria已经被载入了。

#### 使用galleria显示页面中所有图片

移除imageGallery.js之前的测试代码，修改为如下：

        function showGallery(){
            if (Galleria){
                if($("#img_Gallery").length == 0){
                    // 1. 如果不存在id为img_Gallery节点，则创建
                    $('<div id="img_Gallery"></div>').appendTo($("body"));
                    
                    // 2. 将所有img节点附加img_Gallery
                    $("img").each(function(){
                        $("#img_Gallery").append($(this));
                    });
                    
                    // 3. 使用galleria显示
                    if($("#img_Gallery").children().length >0){
                        Galleria_loadTheme(); // 加载fullscreen theme，与正规的方式不同，
                                              // 对galleria.fullscreen.js做了点修改，方便使用，
                        
                        // 调用galleria
                        $('#img_Gallery').galleria({
                            transition: 'fade', // 过渡效果
                            image_crop: false
                        });
                    }
                }
            }
        }

在background.html中监听浏览器工具栏的扩展图标（browserAction）点击事件（onClicked），
调用showGallery函数。在background.html添加如下代码：

        <html>
        <head>
        <script>
        function loadImageSlide(tab) {
            if(tab){
                chrome.tabs.executeScript(null, {code: "showGallery()"});
            }
        }

        chrome.browserAction.onClicked.addListener(loadImageSlide);
        </script>
        </head>
        </html>

通过chrome.tabs.executeScript接口，可以在Tab页中执行脚本，null代表当前Tab页。
重新加载扩展后，单击扩展图标应该就可以将页面内的图片全屏显示。

#### 添加快捷键支持

在imageGallery.js中添加：

        $("body").keydown(function (event){
            // Alt + S
            if(event.keyCode == 83 && event.altKey){
                showGallery();
            }
        })

当用户按Alt+S时，执行showGallery，将页面内的图片全屏显示。　

#### 为扩展添加选项

在options.html添加：

        <html>
        <head>
            <script src="jquery-1.4.3.min.js"></script>

            <style>
                .main_div{
                    text-align: center;
                    width:500px;
                    margin-left: auto;
                    margin-right: auto;
                }
                .sub_div{
                    text-align: left;
                }
            </style>
            <title>options</title>
        </head>
        <body onload="reloadOptions()">
            <div class="main_div">
            <!-- 最小高度 -->
            <div class="sub_div">height &gt; <input id="min_height"/> px</div>
            <div class="sub_div">width  &gt; <input id="min_width"/> px</div>
            <div class="sub_div">width-height ratio &lt; <input id="wh_ratio"/> </div>
            <div class="sub_div" style="font-size: 10; ">(width/height and height/width)</div>
            <div class="sub_div">--------------------------------------------</div>
            <div class="sub_div"><b>shortcut key: </b>
                <ul>
                    <li>Alt + S: Show gallery</li>
                </ul>
            </div>
            <div class="sub_div">
                <button onclick="saveOptions()">Save</button>
            </div>
            </div>
            <script>
            function saveOptions(){
                localStorage["min_height"] = $("#min_height").val(); 
                localStorage["min_width"] = $("#min_width").val();
                localStorage["wh_ratio"] = $("#wh_ratio").val();
                
                reloadOptions();
            }
            
            function reloadOptions(){
                min_height = localStorage["min_height"] || 200; // 默认值
                min_width = localStorage["min_width"] || 200; // 默认值
                wh_ratio = localStorage["wh_ratio"] || 3; // 默认值
                
                $("#min_height").val(String(min_height));
                $("#min_width").val(String(min_width));
                $("#wh_ratio").val(String(wh_ratio));
            }
            </script>
        </body>
        </html>

在options.html中，将配置属性（最小高度，最小宽度，宽高比的最大值）保存在localStorage。
然后修改background.html， 添加如下代码：

        function loadOptions(tabId, changeInfo, tab) {
            var min_height = localStorage["min_height"] || 200;
            var min_width = localStorage["min_width"] || 200;
            var wh_ratio = localStorage["wh_ratio"] || 3;
            var options = "min_width = " + min_width + ";" +
                          "min_height = " + min_height + ";" +
                          "wh_ratio = " + wh_ratio + ";";
            chrome.tabs.executeScript(tabId, {code: options});
        }

        chrome.tabs.onUpdated.addListener(loadOptions);


监听tabs.onUpdated事件，将配置选项组成一段code，传到当前Tab页中。
临时想到的办法，不知道有没有更标准的做法。　　

最后在imageGallery.js里面根据图片的宽度和高度来过滤：

        $("img").each(function(){
            /* filter small image */
            if (this.width > min_width &&
                this.height > min_height &&
            (this.width / this.height) < wh_ratio &&
            (this.height / this.width) < wh_ratio) {
                $("#img_Gallery").append($(this));
            }
        });

### 感受

Chrome扩展的开发基本和网页开发一致，入门门槛还是很低的，也能利用到现有的很多js库。
简单研究下就可以做出很实用的扩展。大家有兴趣可以交流下。

[GALLERIA]: http://galleria.aino.se/
[Chrome扩展开发文档]: http://code.google.com/chrome/extensions/docs.html
[下载jQuery]: http://docs.jquery.com/Downloading_jQuery
[下载GALLERIA]: http://galleria.aino.se/download/
