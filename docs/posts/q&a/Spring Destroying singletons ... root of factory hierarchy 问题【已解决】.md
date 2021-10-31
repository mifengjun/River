---
title: Spring Destroying singletons ... root of factory hierarchy 问题【已解决】
id: problem-spring-destroying-singletons
tags: 
    - Spring
categories: 
    - 笔记
    - 问题解决
abbrlink: 22200
date: 2018-09-21 12:05:03
updated: 2018-09-21 12:05:03
comments: true
---

### 问题


```java
Destroying singletons in org.springframework.beans.factory.support.DefaultListableBeanFactory@13d740f: 
defining beans [dataSource,sessionFactory,dccDAO,groupueDAO,groupbasDAO,olcsDAO,hibernateTemplate,dccService,
groupueService,groupbasService,olcsService]; root of factory hierarchy
```

<!-- more-->

#### 问题描述
我遇到该问题的原因在公司的Eclipse项目移到IDEA上面时候报的这个错,虽然Eclipse用着也还好,但是更习惯用IDEA,这里就不对编辑器做过的内容了.

然后我再Eclipse上面运行没有什么问题,但是放在IDEA上面跑就行,最早的时候就去google百度了一圈.结果寥寥草草,因为这种情况也不是很常见的问题,所以无果.草草了事.

今天有空,就又回去看了一下这个问题,大致排查过程如下.

注释掉了所有的其他spring-...xml文件,只加载了一个spring application context,然后运行起来之后终于能够看到错误了,就逐个在去加载spring-...xml,直到多加载一个就出现这个错误的时候开始了问题分析.

#### 分析过程略

#### 分析结果:
JVM内存的锅,设置了虚拟机参数,完美解决
```
-Xms2048M -Xmx2048M -XX:PermSize=256M -XX:MaxPermSize=512M
```
其实最开始的时候想到了是虚拟机内存大小的问题,但是当时只设置了堆内存,并没有设置方法区的内存大小,知道我多加载一个配置文件就报错,才考虑到这个地方,而且已经打印出来了报错信息
```
java.lang.OutOfMemoryError: PermGen space
```
看见这个错误开心的不得了. 至此问题完美解决.

