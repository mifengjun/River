---
title: 解决 PLSQL Developer 中文乱码
id: problem-plsql-garbled
tags:
  - 教程
categories:
  - 笔记
  - 教程
abbrlink: 64995
date: 2019-03-08 10:19:50
updated: 2019-03-08 10:19:50
comments: true
---


# 当前中文显示
![](/images/posts/problem-plsql-garbled/20190308101902235.png)

# 解决后
![](/images/posts/problem-plsql-garbled/20190308101925588.png)

<!--more-->

### 1. 查询当前数据库编码集
```sql
select userenv('language') from dual;
```
![](/images/posts/problem-plsql-garbled/20190308101212690.png)

### 2. 设置系统环境变量
右击计算机选择属性
![](/images/posts/problem-plsql-garbled/20190308101322676.png)
![](/images/posts/problem-plsql-garbled/20190308101410401.png)

![](/images/posts/problem-plsql-garbled/20190308101523374.png)

1 处填 : NLS_LANG
2 处填 : 刚刚数据库查出来的值 AMERICAN_AMERICA.ZHS16GBK
![](/images/posts/problem-plsql-garbled/20190308101610281.png)

#### 检查当前数据库中文显示

![](/images/posts/problem-plsql-garbled/20190308101849623.png)
