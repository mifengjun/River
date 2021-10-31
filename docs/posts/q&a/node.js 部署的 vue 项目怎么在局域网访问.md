---
title: node.js 部署的 vue 项目怎么在局域网访问
id: node-LAN-deploy-vue
tags:
    - 教程
categories:
    - 笔记
    - 教程
abbrlink: 42312
date: 2018-07-20 21:18:06
updated: 2018-07-20 21:18:06
comments: true
---

#### 1.查看本机局域网ip
```
// windows系统
在cmd页面输入ipconfig命令即可查看
// linux系统
在终端输入ifconfig命令可查看
```

<!--more-->

#### 2.修改vue配置文件
```
// 进入到项目的config文件夹下,打开index.js 把host改成以上你查看到的本地ip地址

// Various Dev Server settings
host: '192.168.31.239', // can be overwritten by process.env.HOST
port: 8082
....
.
.
```
![lvgo star dust](/images/posts/node-LAN-deploy-vue/20180720212021564.png)

#### 3.在其他设备输入ip加端口号即可
电脑手机均可

http://192.168.31.239:8082 即可访问到我们项目
