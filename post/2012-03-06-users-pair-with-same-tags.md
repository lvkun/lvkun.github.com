## 找到拥有相同标签的用户对

### 问题

给定sina微博的全部用户（1亿以上）和标签（uniq的标签30万左右）的关系，
系统找出共有2个或以上标签的用户对，并给出这些标签是哪些。

* input：

        userid,taglist

* output:

        userid,userid,con-taglist (sizeof(con_taglist)>=2)


### 数据示例

* 输入

        AA，体育 新闻 清华 百年校庆
        BB，娱乐 八卦 清华 新闻
        CC，体育 娱乐 新闻
        DD，八卦 新闻 娱乐

* 输出

        AA，BB 清华 新闻
        AA，CC 体育 新闻
        BB，CC 娱乐 新闻
        BB，DD 娱乐 八卦 新闻
        CC，DD 娱乐 新闻
        
### 生成测试数据

编写 datagen.py 生成测试数据。

* 命令行参数

  * --userNumber  -u 测试数据中包含的用户数量(默认： 100000000)
  * --tagNumber   -t 测试数据中包含的标签数量(默认： 3000000)
  * --maxUserTags -m 每个用户能够拥有的最大标签数量(默认： 10)
  * --outfile     -o 输出文件名(默认： data.txt)
  
### 问题分析

可以将用户对看做为一个矩阵: 

        *  AA        BB             CC          DD
        AA 0         清华 新闻      体育 新闻    0
        BB 清华 新闻  0             娱乐 新闻    娱乐 八卦 新闻
        CC 体育 新闻  娱乐 新闻      0           娱乐 新闻
        DD 0         娱乐 八卦 新闻  娱乐 新闻   0
        
该矩阵存在以下特征：

* 横轴和纵轴都是以用户名作为坐标
* 对角线上的元素都为空
* 矩阵元素的值以对角线对称，可以只考虑上半部分。
* 考虑实际情况，应该会有很多元素为空，即大部分用户不存在相同标签。

### 解决方法

* 按行读取输入数据
* 针对每一行进行如下操作
  
  * 解析出当前用户名 `user_name` , `tag_text_list`
  * 记录行号，作为用户的唯一 id （假定用户名可能重复），将用户名保存在数组 `users_name` 中， 如：

            users_name[0] = 'AA'
            users_name[1] = 'BB'
            ......

  * 更新标签字典 `tags_id` ，为每个新遇到标签分配一个唯一递增的数字 id 。

            tags_id["体育"] = 0
            tags_id["新闻"] = 1
            tags_id["清华"] = 2
            ......

  * 更新标签数组文本属性 `tags.text`

            tags[0].text = "体育"
            tags[1].text = "新闻"
            tags[2].text = "清华"
            ....  

  * 标签用户数组 tags ，该数组保存的是每一个 tag 对应的用户 id 列表。（假设当前读入行 CC ）

            tags[0].users = [0]    ## 体育    AA
            tags[1].users = [0, 1] ## 新闻    AA BB
            tags[2].users = [0, 1] ## 清华    AA BB
            tags[3].users = [0]    ## 百年校庆 AA
            tags[4].users = [1]    ## 娱乐    BB
            tags[5].users = [1]    ## 八卦    BB

  * 获取当前用户所有对应的标签的用户列表（假设当前读入行 CC ）

            user_tag_list = []
            for tag_text in current_user.tag_text_list:
                tag_id = tags_id["tag_text"]
                user_tag_list.append([(user_id, tag_id) for user_id in tags[tag_id].users])
            user_tag_list[0] =  [(0, 0)] ## (AA 体育)
            user_tag_list[1] =  [(1, 4)] ## (BB 娱乐)
            user_tag_list[2] =  [(0, 1), (1, 1)] ## (AA 新闻) (BB 新闻)
  
  * 将 `user_tag_list` 按照 `user_id` 合并排序， 生成新的 `user_tag_list`

            user_tag_list = [(0, 0), (0, 1), (1, 4), (1, 1)]
  
  * 然后遍历该列表， 找到相同 `user_id` 出现过两次以上， 并输出即可

  * 将当前用户插入标签用户数组 `tags_users` （假设当前读入行 CC ）
        
            tags[0].users = [0]    ## 体育    AA
            tags[1].users = [0, 1] ## 新闻    AA BB
            tags[2].users = [0, 1] ## 清华    AA BB
            tags[3].users = [0]    ## 百年校庆 AA
            tags[4].users = [1]    ## 娱乐    BB
            tags[5].users = [1]    ## 八卦    BB
        
  * 继续下一循环

### 实际应用需解决问题

* 考虑内存消耗，使用数据库保存
  
  * 输入文件 > 30G
  * 内存占用 > 50G

* 将计算过程线程化

  * 暂停
  * 存储当前进度后退出
  * 从上次计算的位置继续进行

* 用户界面以了解计算进度

### 进一步解决方案

使用MapReduce方案