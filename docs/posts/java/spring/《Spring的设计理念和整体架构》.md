---
title: 《Spring的设计理念和整体架构》
id: spring-structure-concept
tags: 
    - Spring
categories: 
    - informal
abbrlink: 64394
date: 2018-08-16 15:54:17
updated: 2018-08-16 15:54:17
excerpt: spring 官方文档的一点点翻译理解
comments: true
---

### Spring的设计理念


``以下为官方文档内容``

>When you learn about a framework, it’s important to know not only what it does but what principles it follows. Here are the guiding principles of the Spring Framework:[传送门](https://docs.spring.io/spring/docs/current/spring-framework-reference/overview.html#overview-philosophy)

- Provide choice at every level. Spring lets you defer design decisions as late as possible. For example, you can switch persistence providers through configuration without changing your code. The same is true for many other infrastructure concerns and integration with third-party APIs.

	提供各个层面的选择。Spring允许您尽可能晚地推迟设计决策。例如，您可以通过配置切换持久性提供程序，而无需更改代码。许多其他基础架构问题以及与第三方API的集成也是如此。

- Accommodate diverse perspectives. Spring embraces flexibility and is not opinionated about how things should be done. It supports a wide range of application needs with different perspectives.

	适应不同的观点。Spring拥抱灵活性，并不认为应该如何做。它以不同的视角支持广泛的应用需求。

- Maintain strong backward compatibility. Spring’s evolution has been carefully managed to force few breaking changes between versions. Spring supports a carefully chosen range of JDK versions and third-party libraries to facilitate maintenance of applications and libraries that depend on Spring.

	保持强大的向后兼容性。Spring的演变经过精心设计，可以在版本之间进行一些重大改变。Spring支持精心挑选的JDK版本和第三方库，以便于维护依赖于Spring的应用程序和库。

- Care about API design. The Spring team puts a lot of thought and time into making APIs that are intuitive and that hold up across many versions and many years.


	为代码质量设定高标准。Spring Framework强调有意义，最新且准确的Javadoc。它是极少数项目之一，可以声称干净的代码结构，包之间没有循环依赖。

- Set high standards for code quality. The Spring Framework puts a strong emphasis on meaningful, current, and accurate Javadoc. It is one of very few projects that can claim clean code structure with no circular dependencies between packages.

	关心API设计。Spring团队投入了大量的思考和时间来制作直观的API，并且可以支持多个版本和多年。
	
----

	官方给出的解释更像是说明了Spring的开发方向定义，而我们在真正的使用过程中远远不止这些。Spring为我们真正带来的价值，
	更像是一个引路人，带我们更轻松的“上道”。


#### 翻译

1. Spring为开发者提供了一站式的轻量级开发平台。它抽象出了我们在许多应用中常常遇到的共性问题，并且Spring在Java EE的应用开发中，支持POJO和使用JavaBean的开发方式，使应用面向接口开发。充分支持OO的设计方法。
  : 
  POJO其实是比javabean更纯净的简单类或接口。
  POJO严格地遵守简单对象的概念，而一些JavaBean中往往会封装一些简单逻辑。
  POJO主要用于数据的临时传递，它只能装载数据， 作为数据存储的载体，而不具有业务逻辑处理的能力。
  Javabean虽然数据的获取与POJO一样，但是javabean当中可以有其它的方法
  

2. 简化开发，Spring中的核心IoC和AOP有效的帮我们大幅简化开发成本，对象间的依赖耦合关系，使用Spring的IoC便可以轻松的实现。AOP则把我们开发过程中可能出现的大量重复代码在AOP内完成，比如应用日志，安全控制等。
3. 应用集成，Spring的设计使其与生俱来的能够与其他第三方框架无缝结合，使我们的开发更加灵活，比如与Struts框架，hibernate框架，redis框架，mybatis框架等。

----

### 整体架构

>Spring框架一共模块有20+，大体可分为五大类

![lvgo star dust](/images/posts/spring-structure-concept/20180505214030958.png)

#### 一、核心模块

- Core（Spring的核心实用程序，为Spring其他模块奠定了基础）

- Beans（Spring的核心bean，以及bean工厂的支持）

- Contexts（该模块构建在core和beans之上，集成了beans的特性，为Spring核心提供了大量扩展）

- Expression（提供了一个强大的表达式语言用于在运行时查询和操纵对象。它是 JSP 2.1 规范中定义的 unifed express language 的一个扩展）

#### 二、AOP模块

- Aspects（ AspectJ 的集成支持，提供了AOP 实现方法）

- Instrumentation（提供了 class instrumentation 支持和 classloader 实现，使得可以在特定应用服务器上使用）

- Messaging（ Spring4之后增加，为集成一些基础的报文传送应用）

#### 三、数据访问/集成模块

- JDBC （提供了一个 JDBC 抽象层，它可以消除冗长的 JDBC 编码和解析数据库厂商特有的错误代码。此模块包含了 Spring 对 JDBC 数据访问进行封装的所有类。）
- ORM （为流行的对象－关系映射 API ，例如 JPA、JDO、 Hibernate、 iBatis等，提供了一个交互层。利用 ORM 封装包，可以混合使用 Spring 提供的特性进行 O/R映射(Object/Relation)。）
- OXM （提供了一个对 Object/XML映射实现的抽象层，Object/XML 映射实现包括 JAXB、Castor 、XMLBeans 、JiBX 和 XStream。）
- JMS (Java Messaging Service) 模块主要包含了一些制造和消费消息的特性。
- (tx)Transaction 模块支持编程和生命性的事务管理，这些事物必须实现特定的接口，并且对所有的 POJO 都适用。

#### 四、Web模块

- web

- webflux（Spring5新增，非堵塞函数式 Reactive Web 框架，可以用来建立异步的，非阻塞，事件驱动的服务）

- webmvc

- websocket

#### 五、Test模块



----

参考资料

1. [Spring](http://spring.io/)
2. [Spring技术内幕（第二版）](https://book.douban.com/subject/10470970/)
2. [Spring整体架构](https://www.cnblogs.com/EnzoDin/p/6556825.html)
3. [Spring5 系统架构](https://blog.csdn.net/lj1314ailj/article/details/80118372)
4. [Spring源码-整体架构](https://blog.csdn.net/panweiwei1994/article/details/76529086)

