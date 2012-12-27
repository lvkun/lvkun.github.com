## 自然语言处理 简介

在[Coursera]上面有两门自然语言处理课程：

* [自然语言处理 Dan Jurafsky & Christopher Manning]
* [自然语言处理 Michael Collins]

因为都还没有开课，而[自然语言处理 Dan Jurafsky & Christopher Manning]提供了[Preview]。只能先从此看起。

### 自然语言处理应用

* 自动问答系统（Question answering）：IBM's Watson

  2011-2-16 在 [Jeopardy!]（美国的电视智力竞赛节目）上获胜

* 信息提取（Information Extraction）：

  例如：根据邮件内容创建日历条目

  还包括情感分析（Sentiment Analysis）：从大量对某一款相机的评论，提取并总结出评论者对该款相机的各方面特性的满意程度。

* 机器翻译

  * 自动翻译
  * 帮助翻译者纠正错误

现状

* 基本解决

  * 垃圾邮件检测（Spam detection）
  * 词性标注（Part-of-Speech Tagging）
  * 命名实体识别（Named Entity Recognition）

* 有很大进展

  * 情感分析（Sentiment Analysis）
  * 指代消解（Coreference resolution）
  * 词义消歧（Word Sense Disambiguation）
  * 句法分析（Parsing）
  * 机器翻译（Machine Translation）
  * 信息提取（Information Extraction）

* 仍然很困难

  * 自动问答系统（Question answering）
  * 释义（Paraphrase）
  * 总结归纳（Summarization）
  * 对话（Dialog）

### 为什么自然语言处理那么困难

歧义（Ambiguity），并且在自然语言文本中是普遍的。

其他原因：

* 非标准英语（non-standard English）

  如：twitter上面的网络语言，错误拼写，缩写等

* 分割问题（segmentation issue）
* 习语（idioms）
* 新词（neologism）
* 常识（world knowledge）
* 麻烦的实体名称（tricky entity names） 如：Where is *A Bug's Life* playing...

### 如何处理

* 从语言数据中建立的概率模型
* 粗糙的文本特征

### 课程目标

自然语言处理的关键性的理论和方法：

* 维特比算法（Viterbi）
* 朴素贝叶斯（Naive Bayes），最大熵分类器（maxent classifiers）
* 多元语言建模（N-gram language modeling）
* 统计句法分析（statistical parsing）
* 倒排索引（inverted index），TF-IDF，vector models of meaning（?）

实际应用

* 信息提取（Information Extraction）
* 拼写校正（spelling correction）
* 信息检索(information retrieval)
* 情感分析（Sentiment Analysis）

[Coursera]: https://www.coursera.org/
[自然语言处理 Dan Jurafsky & Christopher Manning]: https://www.coursera.org/course/nlp
[自然语言处理 Michael Collins]: https://www.coursera.org/course/nlangp
[Preview]: https://class.coursera.org/nlp/lecture/preview

[Jeopardy!]: http://en.wikipedia.org/wiki/Jeopardy!
