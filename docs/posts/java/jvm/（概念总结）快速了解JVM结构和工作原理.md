---
title: （概念总结）快速了解JVM结构和工作原理
id: jvm-theory-concept
tags: 虚拟机
categories: 虚拟机
abbrlink: 45274
date: 2018-09-05 14:48:24
updated: 2018-09-05 14:48:24
comments: true
---


>以下内容为阅读由周志明编著的《深入理解Java虚拟机JVM高级特性与最佳实战》（第二版）自行总结记录，算不上完全解读了大神的意思，但也没有瞎写。如果写的不清楚的地方，还望能够自行阅读原著。这里写记只为巩固学习。

<!--more-->

### 什么是Java虚拟机（JVM）？


Java 虚拟机是一个可以执行 Java 字节码的虚拟机进程，相当于一个普通应用程序。Java 源文件被编译成能被 Java 虚拟机执行的字节码文件。 java要在应用平台上执行，需要先安装执行虚拟机，java虚拟机屏蔽了平台操作系统的底层硬件信息，抽取整理了各平台公共的处理硬件的接口提供给开发用户使用，java开发用户只要基于JVM开发接口开发java程序而不需要关注执行平台的系统特性。
如果JAVA比喻火车, 那虚拟机可以理解为轨道. 它是JAVA的一个允许载体.为JAVA提供了运行环境.跨平台是因为虚拟机可以在多平台运行. 所以JAVA就可以在多平台运行.这也是JAVA的一个优点和特点. 跨平台运行.

---

### JVM的结构

JVM由类加载子系统，执行器引擎，本地方法库和运行时区域（内存空间）组成。这里着重说下内存空间。

JVM的内存空间是指：

- 堆（线程共有）
- 方法区（线程共有）
- 虚拟机栈（线程私有）
- 本地方法栈（线程私有）
- 程序计数器（线程私有）

下面简单讲一下这几个地方都是干什么的。

#### 堆（线程共有）

JVM堆中主要存储的就是我们所有实例化的对象。

#### 方法区（线程共有）

主要存储的是虚拟机加载的类信息，常量，静态变量，常量池

#### JVM栈（线程私有）

保存我们程序运行时调用方法分配的栈帧，包括局部变量表（所需空间实在编译期完成分配的，分配之后的大小不能改变）、操作数栈、动态链接、方法出口等。

#### 本地栈（线程私有）

与JVM栈一样，只不过服务对象不同，JVM服务于Java方法，本地栈服务于虚拟机使用到的Native方法。

#### 程序计数器（线程私有）

这块内存比较小，它主要负责的内容就是字节码解释器工作的时候负责记录字节码的行号和位置。就比如我们程序的多线程切换，都是需要通过这个计数器来确定，所以每一个线程都有一个自己的程序计数器。

---

### JVM的工作原理

这一块内容比较好理解，可以像我这样简单的对其有个了解，具体的实现我们不做过多的说明。

首先Java程序经过编译，生成class格式文件，而这个class的文件就是我们虚拟机所需要的的，虚拟机通过加载class文件来运行我们的Java程序。这里还要特别说明一点。JVM不光可以运行Java程序！JVM不光可以运行Java程序！JVM不光可以运行Java程序！同样的当初设计就没想着让虚拟机只能运行Java程序，在它上面还可以运行其他语言的程序。具体我就不去搜索了，需要了解的大家可以自行学习。


---

可能总结的不够深入，不过由于个人学习能力有限，希望可以能在以后读的更通透的时候回来继续维护修正。

抱着和大家共同学习的目的，记录学习总结。不足之处还希望能够指出共同进步！
