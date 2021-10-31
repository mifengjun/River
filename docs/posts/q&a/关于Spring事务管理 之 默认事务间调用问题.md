---
title: 关于Spring事务管理 之 默认事务间调用问题
id: spring-transaction-invocation
tags:
  - Spring
categories: 
    - Spring
    - 事务
abbrlink: 51341
date: 2019-12-24 15:59:17
updated: 2019-12-24 15:59:17
comments: true
---

由事务的传播行为我们知道, 如果将方法配置为默认事务(<b>REQUIRED</b>)在执行过程中Spring会为其新启事务(<b>REQUIRES_NEW</b>), 作为一个独立事务来执行. 由此存在一个问题.

如果使用不慎, 会引发  ``org.springframework.transaction.UnexpectedRollbackException: Transaction rolled back because it has been marked as rollback-only``

<!--more-->

---

具体原因见以下demo简例:

#### 部分关键代码

##### DemoService1

```java
public class DemoService1Impl implements DemoService1 {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Resource
    private DemoDao demoDao;
    @Resource
    private DemoService2 demoService2;

    /**
     * 业务逻辑 , 默认事务, 事务回滚异常 : Exception
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRED,rollbackFor = Exception.class)
    public void doService() {
        HashMap<String, Integer> param = new HashMap<>(2);
        param.put("applId", 19);
        param.put("code", 19);
        demoDao.insert1(param);
        try {
            demoService2.doService();
        } catch (Exception e) {
            logger.error("业务2处理异常,{}", e.getMessage());
        }

    }
}
```

##### DemoService2

```java
public class DemoService2Impl implements DemoService2 {

    @Resource
    private DemoDao demoDao;

    /**
     * 业务逻辑, 默认事务, 事务回滚异常 : Exception
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRED,rollbackFor = Exception.class)
    public void doService() {
        HashMap<String, Integer> param = new HashMap<>(2);
        param.put("applId", 10);
        param.put("code", 10);
        demoDao.insert2(param);
        throw new RuntimeException("因为一些原因,我处理失败了.");
    }
}

```


#### 单元测试

```java
public class DemoService1ImplTest extends BaseTest {

    @Resource
    private DemoService1 demoService1;

    @Test
    public void doService() {
        demoService1.doService();
    }
}
```

##### 说明

<i>这里用到的事务配置为注解方式, 目前我们项目开发过程中使用配置文件方式, 一般为以下方式 . 这种方式的事务配置, 更容易引起问题</i>

```
	<tx:advice id="txAdvice" transaction-manager="transactionManager">
		<tx:attributes>
        	...
			<tx:method name="do*"  />
            <tx:method name="doNew*"  propagation="REQUIRES_NEW" />
            ...
		</tx:attributes>
	</tx:advice>

```

#### 执行结果

```
27:38 [DEBUG] - [com.erayt.cms.cms.dao.DemoDao.insert1] prepare sql:[         insert into  ...
27:38 [DEBUG] - [com.erayt.cms.cms.dao.DemoDao.insert1] prepare parameters:[19, 19]  ...
27:38 [DEBUG] - {pstm-100001} Executing Statement:          insert into   ...
27:38 [DEBUG] - {pstm-100001} Types: [java.lang.Integer, java.lang.Integer]  ...
27:38 [DEBUG] - [com.erayt.cms.cms.dao.DemoDao.insert2] prepare sql:[         insert into   ...
27:38 [DEBUG] - [com.erayt.cms.cms.dao.DemoDao.insert2] prepare parameters:[10, 10]  ...
27:38 [DEBUG] - {conn-100002} Preparing Statement:          insert into   ...
27:38 [DEBUG] - {pstm-100003} Types: [java.lang.Integer, java.lang.Integer]  ...
27:38 [ERROR] - 业务2处理异常,因为一些原因,我处理失败了.
27:38 [WARN ] - Caught exception while allowing TestExecutionListener  ...
org.springframework.transaction.UnexpectedRollbackException: Transaction rolled back because it has been marked as rollback-only
	at org.springframework.transaction.support.AbstractPlatformTransactionManager.commit ...
	at org.springframework.test.context.transaction.TransactionContext.endTransaction ...
	at org.springframework.test.context.transaction.TransactionalTestExecutionListener.afterTestMethod ...
	at org.springframework.test.context.TestContextManager.afterTestMethod ...
	

```

#### 问题分析

问题出现的代码为
```java
	try {
            demoService2.doService();
        } catch (Exception e) {
            logger.error("业务2处理异常,{}", e.getMessage());
        }
```

问题原因是因为两个service中的方法doService均为默认事务(<b>REQUIRED</b>), 
默认事务再被调用时, 如外层方法无事务, 自身会新启事务. 此时``#demoService1.doService()``的事务则为新启事务(<b>REQUIRES_NEW</b>) , 之后再被调用的方法``#demoService2.doService()``会加入到调用者``#demoService1.doService()``事务中. 

又由于spring的事务回滚依托在异常之上, 当demoService2.doService()出现异常后它将事务标记为回滚. 异常抛出后被catch , demoService1.doService 没有接受到里面抛出的异常, 方法继续执行, 执行结束后, 事务提交. 

但当demoService1在做commit的时候检测到事务被标记为回滚, 与预期不符, 也就是``Unexpected`` 意想不到的

``UnexpectedRollbackException: Transaction rolled back because it has been marked as rollback-only``
