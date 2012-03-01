## Python 对象内存占用

之前写的脚本中，需要估计程序的内存占用，所以简单研究下Python各种对象在内存中占用大小。

本人对 Python 一直处在使用的阶段，没有进行深入研究。所以有什么错误还请指出，欢迎交流。

### 一切皆是对象

在 Python 一切皆是对象，包括所有类型的常量与变量，整型，布尔型，甚至函数。
参见stackoverflow上的一个问题 [Is everything an object in python like ruby]

代码中即可以验证：

        # everythin in python is object
        def fuction():
            return

        print isinstance(True, object)
        print isinstance(0, object)
        print isinstance('a', object)
        print isinstance(fuction, object)

### 如何计算

Python 在 [sys] 模块中提供函数 ``getsizeof`` 来计算 Python 对象的大小。

> ``sys.getsizeof(object[, default])``

> 以字节（byte）为单位返回对象大小。 
> 这个对象可以是任何类型的对象。 
> 所以内置对象都能返回正确的结果 
> 但不保证对第三方扩展有效，因为和具体实现相关。

> ......

> ``getsizeof()`` 调用对象的 ``__sizeof__`` 方法，
  如果对象由垃圾收集器管理， 则会加上额外的垃圾收集器开销。

当然，对象内存占用与 Python 版本以及操作系统版本关系密切，
本文的代码和测试结果都是基于 windows7 32位操作系统。

        import sys
        print sys.version

``2.7.2 (default, Jun 24 2011, 12:21:10) [MSC v.1500 32 bit (Intel)]``

### 基本类型

* 布尔型

        print 'size of True: %d' % (sys.getsizeof(True))
        print 'size of False: %d' % (sys.getsizeof(False))

  输出：

        size of True: 12
        size of False: 12

* 整型
        
        # normal integer
        print 'size of integer: %d' % (sys.getsizeof(1))
        # long
        print 'size of long integer: %d' % (sys.getsizeof(1L))
        print 'size of big long integer: %d' % (sys.getsizeof(100000L))

  输出：

        size of integer: 12x
        size of long integer 1L: 14
        size of long integer 100000L: 16

  可以看出整型占用12字节，长整型最少占用14字节，且占用空间会随着位数的增多而变大。
  在2.x版本，如果整型类型的值超出``sys.maxint``，则自动会扩展为长整型。而 Python 3.0 之后，整型和长整型统一为一种类型。

* 浮点型

        print 'size of float: %d' % (sys.getsizeof(1.0))

  输出：

        size of float: 16

  浮点型占用16个字节。超过一定精度后会四舍五入。参考如下代码：

        print 1.00000000003
        print 1.000000000005

  输出：

        1.00000000003
        1.00000000001

* 字符串

        # size of string type
        print '\r\n'.join(["size of string with %d chars: %d" % (len(elem), sys.getsizeof(elem)) 
            for elem in ["", "a", "ab"]])

        # size of unicode string
        print '\r\n'.join(["size of unicode string with %d chars: %d" % (len(elem), sys.getsizeof(elem)) 
            for elem in [u"", u"a", u"ab"]])

  输出：

        size of string with 0 chars: 21
        size of string with 1 chars: 22
        size of string with 2 chars: 23
        size of unicode string with 0 chars: 26
        size of unicode string with 1 chars: 28
        size of unicode string with 2 chars: 30

  普通空字符串占21个字节，每增加一个字符，多占用1个字节。``Unicode``字符串最少占用26个字节，每增加一个字符，多占用2个字节。

### 集合类型

* 列表

        # size of list type
        print '\r\n'.join(["size of list with %d elements: %d" % (len(elem), sys.getsizeof(elem)) 
            for elem in [[], [0], [0,2], [0,1,2]]])

  输出：

        size of list with 0 elements: 36
        size of list with 1 elements: 40
        size of list with 2 elements: 44
        size of list with 3 elements: 48

  可见列表最少占用36个字节，每增加一个元素，增加4个字节。但要注意，``sys.getsizeof`` 函数并不计算容器类型的元素大小。比如：

        print 'size of list with 3 integers %d' % (sys.getsizeof([0,1,2]))
        print 'size of list with 3 strings %d' % (sys.getsizeof(['0','1','2']))
  
  输出：

        size of list with 3 integers 48
        size of list with 3 strings 48

  容器中保存的应该是对元素的引用。如果要准确计算容器，可以参考[recursive sizeof recipe] 。使用其给出的 ``total_size`` 函数：

        print 'total size of list with 3 integers %d' % (total_size([0,1,2]))
        print 'total size of list with 3 strings %d' % (total_size(['0','1','2']))

  输出为：

        total size of list with 3 integers 84
        total size of list with 3 strings 114

  可以看出列表的空间占用为 基本空间 36 + (对象引用 4 + 对象大小) * 元素个数。

  另外还需注意如果声明一个列表变量，则其会预先分配一些空间，以便添加元素时增加效率：

        li = []
        for i in range(0, 101):
            print 'list with %d integers size: %d, total_size: %d' % (i, getsizeof(li), total_size(li))
            li.append(i)

* 元组
  
  基本与列表类似，但其最少占用为28个字节。

* 字典

  字典的情况相对复杂很多，具体当然要参考代码 [dictobject.c]， 另外 [NOTES ON OPTIMIZING DICTIONARIES] 非常值得仔细阅读。

  基本情况可以参考[stackoverflow] 的问题 [Python's underlying hash data structure for dictionaries] 中的一些回答：

  > 1. 字典最小拥有8个条目的空间(PyDict_MINSIZE);
  > 2. 条目数小于50,000时，每次增长4倍;
  > 3. 条目数大于50,000时，每次增长2倍;
  > 4. 键的hash值缓存在字典中，字典调整大小后不会重新计算;

  > 每接近2/3时，字典会调整大小。

  其中一个回答的留言也很有意思： Python如此依赖字典且字典广泛地影响这门语言的性能， 我敢打赌他们的实现很难超越。

  暂时写这些，今后有时间会进一步研究字典的实现。

[sys]: http://docs.python.org/dev/library/sys.html
[Is everything an object in python like ruby]: http://stackoverflow.com/questions/865911/is-everything-an-object-in-python-like-ruby
[recursive sizeof recipe]:http://code.activestate.com/recipes/577504/
[dictobject.c]: http://svn.python.org/view/python/trunk/Objects/dictobject.c?view=markup
[NOTES ON OPTIMIZING DICTIONARIES]: http://svn.python.org/view/python/trunk/Objects/dictnotes.txt?view=markup
[Python's underlying hash data structure for dictionaries]:http://stackoverflow.com/questions/4279358/pythons-underlying-hash-data-structure-for-dictionaries
