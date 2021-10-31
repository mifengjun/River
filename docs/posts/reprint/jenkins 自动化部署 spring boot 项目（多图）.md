---
title: jenkins 自动化部署 spring boot 项目（多图）
id: course-jenkins-auto-deploy-springboot
tags: 
    - 教程
categories:
    - 笔记
    - 教程
abbrlink: 34512
date: 2018-05-14 15:57:51
updated: 2018-05-14 15:57:51
comments: true
---


**前置条件**
 

 - jenkins与部署项目所用服务器为同一台

## 1、下载并运行  [jenkins.war](http://mirrors.jenkins.io/war-stable/latest/jenkins.war)
```
将下载好的war包，放在tomcat的webapps目录下，启动tomcat 默认 8080 端口

wget http://mirrors.jenkins.io/war-stable/latest/jenkins.war

启动之后访问jenkins项目进行账号设置进行下一步操作

安装jenkins所需插件，安装推荐的即可
```

<!--more-->

![启动jenkins](/images/posts/course-jenkins-auto-deploy-springboot/20180514150207538.png)

## 2、配置jenkins所需插件 ##

```
执行这一步之前，我们在第一次启动jenkins的时候，已经安装过大部分插件，所以我们只需要检查是否安装了以下插件即可

1.Maven Integration 使我们可以开始一个maven项目作为任务

2.Git plugin 使我们可以读取存放在git仓库的项目
```

![配置jenkins](/images/posts/course-jenkins-auto-deploy-springboot/20180514151243623.png)

![配置jenkins](/images/posts/course-jenkins-auto-deploy-springboot/20180514152100394.png)

## 3、配置jenkins全局工具 ##

```
配置jenkins的全局工具主要是我们所使用到的 jdk、git、maven等
```

![](/images/posts/course-jenkins-auto-deploy-springboot/20180514152706764.png)
![](/images/posts/course-jenkins-auto-deploy-springboot/20180514152841580.png)

**jdk在选取安装的时候，如果在我们的服务器上已经安装好的话，直接填写JAVA_HOME路径即可，否则jenkins自动安装的话，需要提供Oracle的账号以及密码。**

![](/images/posts/course-jenkins-auto-deploy-springboot/20180514153051307.png)

**git和maven使用jenkins自动默认配置即可**
![](/images/posts/course-jenkins-auto-deploy-springboot/20180514153209524.png)

## 4、新建任务并配置任务相关设置 ##
![](/images/posts/course-jenkins-auto-deploy-springboot/20180514153550388.png)

```
配置任务相关参数
```

1.源码管理

![](/images/posts/course-jenkins-auto-deploy-springboot/20180514154017440.png)

如果出现 ：
```
Failed to connect to repository : Error performing command: git ls-remote -h https://gitee.com/lvgo/sandbox.git HEAD
```
请检查服务器是否安装了git
```
apt-get install git
```

2.jenkins执行内容和操作成功后执行shell

```
clean package -Dmaven.test.skip=true

# 将应用停止
echo "Stopping SpringBoot Application"
pid=`ps -ef | grep dofun-api.jar | grep -v grep | awk '{print $2}'`
if [ -n "$pid" ]
then
   kill -9 $pid
fi
mv -f /root/.jenkins/workspace/dofunStreet/api/target/dofun-api.jar /usr/local/dofun/dofun-api.jar
chmod 777 /usr/local/dofun/dofun-api.jar
#bash /usr/local/dofun/start.sh
BUILD_ID=dontKillMe /usr/local/dofun/start.sh
```
对应sh脚本内容
```
nohup java -jar /usr/local/dofun/dofun-api.jar > /usr/local/dofun/dofun.log 2>1&
```


![](/images/posts/course-jenkins-auto-deploy-springboot/20180514154515871.png)
