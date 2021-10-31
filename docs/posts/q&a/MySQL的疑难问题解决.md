---
title: MySQL的疑难问题解决
id: course-mysql42701
tags:
    - MySQL
categories:
    - 笔记
    - 教程
abbrlink: 42701
date: 2018-07-04 13:26:51
updated: 2018-07-04 13:26:51
comments: true
---

#### 前置条件

 1. ubuntu 16.04
 2. mysql-server-5.7

----

<!--more-->

#### 安装步骤


```
apt-get update
apt-get installl mysql-server-5.7
```


对于出现的提示选择 y 就好 ，然后输入root密码。安装完成

----
#### 操作使用

1. 远程连接mysql
```
mysql -h IP -P port -u root -p

mysql -h 127.0.0.1 -P 3306 -u root
```


>以下内容为转载



1.https://www.cnblogs.com/xujishou/p/6306765.html（MySQL5.7 添加用户、删除用户与授权）
2.https://www.cnblogs.com/SQL888/p/5748824.html（mysql 用户及权限管理 小结）



-----




#### 疑难问题解决 （后续更新）

###一、ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)
```
复现
root@itlvgo:~# mysql
ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)
root@itlvgo:~# mysql -uroot
ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)

```

![lvgo star dust](/images/posts/course-mysql42701/20180704102409229.png)

**恩。原因是因为需要输入输入密码的命令，少输入了一个-p using password：NO 正确操作如下**
```
root@itlvgo:~# mysql -uroot -p
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 14
Server version: 5.7.22-0ubuntu0.16.04.1 (Ubuntu)

Copyright (c) 2000, 2018, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> 

```

###二、配置用户无法外网访问（本地可以）

```
/etc/mysql/mysql.conf.d

配置如下信息
port=3306

// 原来的注释掉，默认127.0.0.1
bind-address=0.0.0.0
```
如果还不可以，进行下面的检查操作

1. 检查一下是否有开启防火墙；（云服务器的安全组配置）
2. 如果开启不想关闭，需要开放mysql的占用端口，默认3306；
3. 关闭防火墙。。
###三、无法存储中文
修改mysql配置文件
```
cd /etc/mysql
vi my.cnf
```
```
[client]
default-character-set=utf8
[mysqld]
character-set-server=utf8
```
重起mysql即可
```
sudo /etc/init.d/mysql restart
```
