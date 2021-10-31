---
title: Intellij IDEA 配置 tomcat 远程 debug 模式
id: problem-idea-remote-debug
tags: 
    - 教程
categories: 
    - 转载
abbrlink: 33365
date: 2018-07-20 21:44:40
updated: 2018-07-20 21:44:40
comments: true
---


### 一.配置服务器

在catalina.sh 中添加 address 调试端口 9999  **catalina.sh的位置在tocmat下的bin目录**

> 以下方法任选其一

第一种方法

<!--more-->

```
JAVA_OPTS="-agentlib:jdwp=transport=dt_socket,address=9999,suspend=n,server=y"
```
第二种方法
```
CATALINA_OPTS="-server -Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=9999" 
```

### 二.配置IDE
![编辑启动配置](/images/posts/problem-idea-remote-debug/20180720213720867.png)

![点击+号,选择remote](/images/posts/problem-idea-remote-debug/2018072021380811.png)

![将host改成服务器的ip地址,port改成刚配置好的端口.](/images/posts/problem-idea-remote-debug/20180720213902702.png)


----
以debug模式运行

当控制台出现“Connected to the target VM, address: ‘xx.xx.xx.xx:9999’, transport: ‘socket’”的字样即可,记得加入要调试的断点.

----
#end
