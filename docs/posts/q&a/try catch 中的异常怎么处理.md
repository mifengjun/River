---
title: try catch 中的异常怎么处理
id: try-catch-right-operation
tags: 
    - 编码技巧
categories: 
    - Java
    - 编码技巧
abbrlink: 30670
date: 2019-06-26 11:14:30
updated: 2019-06-26 11:14:30
comments: true
---

### 背景介绍
在我们日常开发中, 经常会遇到一些异常需要去手动处理, 或者说是一些可能出现的异常去处理, 又或者说你不知道的异常, 等着暴露出来发现后去处理, 无论哪种异常, 当它出现的时候都是头疼的. 

### 实况
在我们开发过程中对一些可能出现异常的地方, 也就是非检查型异常, 需要我们自己凭经验去做异常处理, 当然你也可以大手一挥任其随意抛出.(佛系异常, 道系领导). 下面我们把镜头转向正在加班开发需求的几位选手, 看看他们是如何对待异常处理逻辑的;

<!--more-->

----

#### round one
这是来自一个对try catch第一次使用的 #$%^选手
```java
try {
	......
	// 中间嵌套10个业务处理方法
	fun1();
	fun2();
	......
	.
	.
	.
} catch (Execption e) {
	
}
```

该选手使用的**不动声色管你用户死活开发法**(魔法伤害), 一招制胜, 此招会使问题分析陷入僵局数天, 客户因体验极差流失等异常状态, 此招杀伤力极强, 伤害值 : ∞;

##### 伤害分析
伤人于无形, 破坏力 ? 视具体功能而定;

当在try中出现异常后, catch无反应, 相当于你作为一个bug负责人, 知道有问题, 但你谁都不告诉.

此招式可使问题永远藏在 #$%^ 的代码中, 永远做一个"优秀的开发者", 相信他会在自己的梦想道路上渐行渐远


----

#### round two
这是来自一个对try catch第二次使用的 *&^% 选手
```java
try {
	......
	// 中间嵌套10个业务处理方法
	fun1();
	fun2();
	......
	.
	.
	.
} catch (Execption e) {
	syso("出现异常");
	sout("处理***业务出错了");
}
```

我们看到, 同样这位选手使用了**不动声色随风飘摇记录知道问题不知道问题在哪抓心挠肝难受开发法**(魔法伤害), 伤害值 : ∞;

##### 伤害分析
这种伤害类似于什么呢? 相当于你看见你给物业说你办公室灯坏了. 物业心里阴影面积.
不修灯被投诉, 修不知道修哪一个.

这种写法可以知道有问题, 但不知道哪有问题.

----

#### round three
这是来自一个对try catch第三次使用的 3号选手
```java
try {
	......
	// 中间嵌套10个业务处理方法
	fun1();
	fun2();
	......
	.
	.
	.
} catch (Execption e) {
	log.error("处理***业务出错了", e.getMessage());
	// 写你自己的异常处理逻辑
}
```

我们看到, 这位选手使用了**化骨绵掌**伤害值 : 能够知道错误信息, 具体位置仍需分析;

##### 伤害分析
这种操作对于我们自定义异常是有一定的帮助, 但单业务内出现异常位置多的时候, 这种方式就有一些不适用了.

业务中如果出现非检查型异常那么恭喜你, 你又可以加班了.

空指针, 数组越界, 类型转换, ..... 一个一个排查吧.

----

#### round four (划重点, 最常见, 隐患最多的一种写法)
这是来自一个对try catch第三次使用的 4 号选手
```java
try {
	......
	// 中间嵌套10个业务处理方法
	fun1();
	fun2();
	......
	.
	.
	.
} catch (Execption e) {
	e.printStackTrace()
	// 写你自己的异常处理逻辑
}
```

#### 伤害分析
这个时候同学会问了, 兄弟, 这有什么伤害呢? 这还不行吗? 是因为我没写注释吗, 
```java
} catch (Execption e) {
	sout("出错了", e.getMessage());
	e.printStackTrace();
	// 写你自己的异常处理逻辑
}
```
这样吗? 其实这个堆栈打印的没毛病, 但是这个底层有问题. 不推荐这样使用, 这样使用的结果就是系统日志内容与堆栈日志会并行输出, 造成抢话
```
system.log : 今天是
exception.stack : 我有
system.log : 好
exception.stack : 问
system.log : 天气
exception.stack : 题了
```
具体日志随便取一个, 大家随便感受一下

```java
static void genException() {
        int nums[] = new int[4];
        System.out.println("Before exception is generated.");
        nums[7] = 10;
        System.out.println("this won't be displayed");
    }
    public static void main(String args[]){
        try {
            genException();
        }
        catch (ArrayIndexOutOfBoundsException exc){
            System.out.println("Standard message is:");
            System.out.println(exc);
            System.out.println("\nStack trace:");
            exc.printStackTrace();
        }
        System.out.println("After catch");
    }
```
输出日志
```
Before exception is generated.
java.lang.ArrayIndexOutOfBoundsException: 7
Standard message is:
java.lang.ArrayIndexOutOfBoundsException: 7

Stack trace:
After catch
	at com.erayt.xpad.ipdp.service.IpdpServiceImpl.genException(IpdpServiceImpl.java:47)
	at com.erayt.xpad.ipdp.service.IpdpServiceImpl.main(IpdpServiceImpl.java:52)
```

同时当堆栈深度较深时, 当该方法被多线程访问时. 会出现内存爆掉系统瘫痪.

关于堆栈打印直接调用的相关文章列几篇
https://my.oschina.net/sxgkwei/blog/825700
https://zsk-china.iteye.com/blog/1133918



----


#### 标准写法. 不接受反驳
这是来自一个对try catch第n次使用以上几种方法后的 X 选手
```java
try {
	......
	// 中间嵌套10个业务处理方法
	fun1();
	fun2();
	......
	.
	.
	.
} catch (Execption e) {
	log.error("处理***业务出错了", e);
	// 写你自己的异常处理逻辑
}
```

### 结尾再说两句

使用log框架中方法.进行日志输出. 保证异常使用的输出流与系统日志一致, 同时将异常信息内容输出到日志文件中, 不占用字符缓冲区大小




同时与大家共勉, 为我们热爱的代码做一点贡献, 发现自己的项目中有以上列举的缺陷代码能够及时完善.
