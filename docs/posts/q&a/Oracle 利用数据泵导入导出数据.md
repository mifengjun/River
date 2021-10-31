---
title: Oracle 利用数据泵导入导出数据
id: course-oracle-import-export
tags:
    - Oracle
categories:
    - 笔记
    - 教程
abbrlink: 3368
date: 2019-03-12 16:04:57
updated: 2019-03-12 16:04:57
comments: true
---


目的：使用数据泵，将一台电脑上的数据库导出，导入到另一台电脑上的数据库。

<!--more-->

#### A电脑上的操作。expdp数据导出

1、运行cmd；

2、登录数据库，输入命令：
```
sqlplus system/密码；
```
3、创建目录路径：
```
create directory backup_path as ‘E:\app\tws\oradata\orcldv’;  
```
(backup_path为路径名称，可自命名（必须是已存在路径），E:\app\tws\oradata\orcl为源数据库路径)

5、导入导出操作授权：
```
grant exp_full_database,imp_full_database to dmuser;  (dmuser为数据库用户名)
```
6、退出：exit;    

7、数据导出，执行命令：
```
expdp  dmuser/***** directory=backup_path dumpfile=dmuser_schema.dmp logfile=dmuser_schema_29.log;
```
dmuser为用户名
*****为密码
dmuser_schema.dmp为导出数据库文件，可自命名，但格式要为.dmp，dmuser_schema_29.log为日志文件，可自命名

----

#### B电脑上的操作。impdp 数据导入

将导出的数据库文件复制到目标数据库路径下。

1、运行cmd；

2、登录数据库，输入命令：
```
sqlplus system/密码；
```
3、创建目录路径：
```
create directory goup_path as ‘E:\app\tws\oradata\orcl’;   
```
(goup_path为路径名称，可自命名，E:\app\tws\oradata\orcl为目标数据库路径)

4、退出：exit;    

5、数据导入，执行命令：
```
impdp  dmuser/*****  directory=goup_path  dumpfile=dmuser_schema.dmp  logfile=dmuser_schema_29.log;
```

#### 完整演示
```
create directory backup_path as 'E:\XPAD';
grant exp_full_database,imp_full_database to xpad706;
expdp xpad706/xpad706 directory=backup_path dumpfile=xpad706.dmp logfile=xpad706.log;
impdp  xpad706/xpad706  directory=backup_path   dumpfile=xpad706.dmp  logfile=impxpad706.log;
```

#### Oracle 数据泵（IMPDP/EXPDP）导入导出总结

Oracle数据泵导入导出是日常工作中常用的基本技术之一，它相对传统的逻辑导入导出要高效，这种特性更适合数据库对象数量巨大的情形，因为我日常运维的数据库对象少则几千，多则几万甚至几十万，所以传统exp/imp就会非常耗时，而数据泵方式就因此脱引而出，下面就详细总结一下数据泵的使用方法，希望能给初学者带来帮助。

一、新建逻辑目录

   最好以system等管理员创建逻辑目录，Oracle不会自动创建实际的物理目录“D:\oracleData”（务必手动创建此目录），仅仅是进行定义逻辑路径dump_dir；
       
```sql
     sql> conn system/123456a?@orcl as sysdba;

     sql>create directory dump_dir as 'D:\oracleData';
```
二、查看管理员目录（同时查看操作系统是否存在该目录，因为oracle并不关心该目录是否存在，假如不存在，则出错）
```sql
     sql>select * from dba_directories;
```
三、用expdp导出数据

1)导出用户及其对象
```
expdp scott/tiger@orcl schemas=scott dumpfile=expdp.dmp directory=dump_dir;
```
2)导出指定表
```
expdp scott/tiger@orcl tables=emp,dept dumpfile=expdp.dmp directory=dump_dir;
```
3)按查询条件导
```
expdp scott/tiger@orcl directory=dump_dir dumpfile=expdp.dmp tables=empquery='where deptno=20';
```
4)按表空间导
```
expdp system/manager@orcl directory=dump_dir dumpfile=tablespace.dmptablespaces=temp,example;
```
5)导整个数据库
```
expdp system/manager@orcl directory=dump_dir dumpfile=full.dmp full=y;
```
四、用impdp导入数据

   在正式导入数据前，要先确保要导入的用户已存在，如果没有存在，请先用下述命令进行新建用户
```sql
--创建表空间
create tablespace tb_name datafile 'D:\tablespace\tb_name.dbf' size 1024m AUTOEXTEND ON;

--创建用户
create user user_name identified by A123456a default tablespace tb_name temporary tablespace TEMP;

--给用户授权

sql>grant read,write on directory dump_dir to user_name;

sql>grant dba,resource,unlimited tablespace to user_name;
```
1)导入用户（从用户scott导入到用户scott）
```
impdp scott/tiger@orcl directory=dump_dir dumpfile=expdp.dmp schemas=scott;
```
2)导入表（从scott用户中把表dept和emp导入到system用户中）
```
impdp system/manager@orcl directory=dump_dir dumpfile=expdp.dmptables=scott.dept,scott.emp remap_schema=scott:system;
```
3)导入表空间
```
impdp system/manager@orcl directory=dump_dir dumpfile=tablespace.dmp tablespaces=example;
```
4)导入数据库
```
impdb system/manager@orcl directory=dump_dir dumpfile=full.dmp full=y;
```
5)追加数据
```
impdp system/manager@orcl directory=dump_dir dumpfile=expdp.dmp schemas=systemtable_exists_action
```
    以上是日常工作中实际工作中用到的，希望能够给你得到帮助。
