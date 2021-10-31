---
title: AQS及相关内容
id: java-juc-aqs
tags: 
    - 并发编程
categories: 
    - Java
    - 并发编程
abbrlink: 25583
date: 2020-09-18 22:14:38
comments: true
---

# AQS

源码位置 : java.util.concurrent.locks.AbstractQueuedSynchronizer

AQS 意为队列同步器, 实际它就是 locks 包下的一个工具组件, 它出现的目的即为所有出现的自定义锁服务的.

<!-- more -->

![AQS所涉及的一些类](/images/posts/java-juc-aqs/20200918221401665.png)

## AQS所涉及的一些类

- AQS本身, AbstractQueuedSynchronizer.class
- AQS的队列元素 Node.class
- java的锁接口, Lock.class
- 自定义锁的监视器 Condition.class
- 自定义锁的实现基于 LockSupport



## AbstractQueuedSynchronizer.class

AQS中主要维护了一个由内部类Node组成的一个队列

同时有3个重要的变量 volatile Node head; volatile Node tail; volatile int state; 都是用 volatile 修饰保证其可见

![](/images/posts/java-juc-aqs/20200918221415153.png)



## Node.class

```
static final class Node {

		// 如果是共享节点, 等待队列后继节点为此常量
        static final AbstractQueuedSynchronizer.Node SHARED = new AbstractQueuedSynchronizer.Node();
        static final AbstractQueuedSynchronizer.Node EXCLUSIVE = null;
        // 标识为已取消
        static final int CANCELLED = 1;
        // 后继节点为等待状态, 可被唤醒, 同时也标识该状态下节点的后继节点应该被阻塞, 处于同步队列中
        static final int SIGNAL = -1;
        // 调用了 condition 的 awaite 方法, 使当前线程处在等待队列中
        static final int CONDITION = -2;
        // 共享锁
        static final int PROPAGATE = -3;
        volatile int waitStatus;
        // 前驱
        volatile AbstractQueuedSynchronizer.Node prev;
        // 同步队列后继
        volatile AbstractQueuedSynchronizer.Node next;
        // 同步状态线程
        volatile Thread thread;
        // 等待队列后继
        AbstractQueuedSynchronizer.Node nextWaiter;

        final boolean isShared() {
            return this.nextWaiter == SHARED;
        }

        final AbstractQueuedSynchronizer.Node predecessor() throws NullPointerException {
            AbstractQueuedSynchronizer.Node var1 = this.prev;
            if (var1 == null) {
                throw new NullPointerException();
            } else {
                return var1;
            }
        }

        Node() {
        }

        Node(Thread var1, AbstractQueuedSynchronizer.Node var2) {
            this.nextWaiter = var2;
            this.thread = var1;
        }

        Node(Thread var1, int var2) {
            this.waitStatus = var2;
            this.thread = var1;
        }
    }
```



## AQS的工作原理

AQS中的三个关键变量

```
    // 队列的头节点
    private transient volatile Node head;

    // 队列的尾结点
    private transient volatile Node tail;

    // 同步状态
    private volatile int state;
```



### 



当一条线程执行到一个同步代码块时, 会进行如下几步操作

### 第一种情况

1. 成功获取锁
2. 执行代码
3. 释放锁
4. 唤醒队首节点的下一个状态小于0的节点



### 第二种情况

1. 获取锁失败
2. 当前线程包装成Node对象, 将AQS中tail节点通过CAS指向自己
3. 死循环判断自己的前驱节点是否为头结点, 并且尝试获取锁, 如果前驱为头结点, 同时获取锁成功
   1. 将自己设置为头结点
   2. 将原头节点后继节点设置为null
   3. 执行代码
   4. 释放锁
4. 如果获取锁失败 (进行以下两件事, 同时返回boolean值. 条件为 1&& 2
   1. 将队列中状态为 1(超时等待或中断线程)移除队列 并将自身前驱节点状态改为 -1, 如果为 -1 返回 true 代表需要将当前线程阻塞(停留在同步队列中)
   2. 阻塞当前线程并判断当前线程是否被中断



### 总结

获取锁成功 -> 执行代码 -> 结束

获取锁失败 -> 进入同步队列 (在次获取锁条件: 等待前驱节点释放锁后唤醒自己) 同时在尝试获取锁失败的时候会做两件事

1. 将状态为 1 的Node节点从队列移除, 将自己的前驱节点状态改为 -1 .
2. 将当前线程通过自身线程阻塞, 同时判断自申是否被中断 (如果被中断, AQS 还会调用线程的 interrupte 方法

以上即非公平锁的处理过程, 在获取锁失败之后进行自循环的时候, 仍然会新线程去尝试通过 CAS 获取锁, 如果新线程获取成功, 那么同步队列的队首元素将不会被唤醒. 即非公平, 先来不一定先得. 但在队列中的线程, 是满足 FIFO 的. 即先到先得锁.

同时, 如果释放锁的线程, 再次尝试获取锁的概率, 会非常高.



```
sync = [Thread[Thread-2,5,main], Thread[Thread-3,5,main], Thread[Thread-4,5,main], Thread[Thread-5,5,main], Thread[Thread-6,5,main], Thread[Thread-7,5,main], Thread[Thread-8,5,main], Thread[Thread-9,5,main]]
sync = [Thread[Thread-2,5,main], Thread[Thread-3,5,main], Thread[Thread-4,5,main], Thread[Thread-5,5,main], Thread[Thread-6,5,main], Thread[Thread-7,5,main], Thread[Thread-8,5,main], Thread[Thread-9,5,main]]

Thread-1
Thread-0

sync = [Thread[Thread-3,5,main], Thread[Thread-4,5,main], Thread[Thread-5,5,main], Thread[Thread-6,5,main], Thread[Thread-7,5,main], Thread[Thread-8,5,main], Thread[Thread-9,5,main], Thread[Thread-0,5,main]]
sync = [Thread[Thread-3,5,main], Thread[Thread-4,5,main], Thread[Thread-5,5,main], Thread[Thread-6,5,main], Thread[Thread-7,5,main], Thread[Thread-8,5,main], Thread[Thread-9,5,main], Thread[Thread-0,5,main]]

Thread-1
Thread-2

sync = [Thread[Thread-3,5,main], Thread[Thread-4,5,main], Thread[Thread-5,5,main], Thread[Thread-6,5,main], Thread[Thread-7,5,main], Thread[Thread-8,5,main], Thread[Thread-9,5,main], Thread[Thread-0,5,main]]
sync = [Thread[Thread-3,5,main], Thread[Thread-4,5,main], Thread[Thread-5,5,main], Thread[Thread-6,5,main], Thread[Thread-7,5,main], Thread[Thread-8,5,main], Thread[Thread-9,5,main], Thread[Thread-0,5,main]]
Thread-2
Thread-1




sync = [Thread[Thread-3,5,main], Thread[Thread-4,5,main], Thread[Thread-5,5,main], Thread[Thread-6,5,main], Thread[Thread-7,5,main], Thread[Thread-8,5,main], Thread[Thread-9,5,main], Thread[Thread-0,5,main]]
sync = [Thread[Thread-3,5,main], Thread[Thread-4,5,main], Thread[Thread-5,5,main], Thread[Thread-6,5,main], Thread[Thread-7,5,main], Thread[Thread-8,5,main], Thread[Thread-9,5,main], Thread[Thread-0,5,main]]

Thread-2
Thread-1

sync = [Thread[Thread-4,5,main], Thread[Thread-5,5,main], Thread[Thread-6,5,main], Thread[Thread-7,5,main], Thread[Thread-8,5,main], Thread[Thread-9,5,main], Thread[Thread-0,5,main], Thread[Thread-2,5,main]]
sync = [Thread[Thread-4,5,main], Thread[Thread-5,5,main], Thread[Thread-6,5,main], Thread[Thread-7,5,main], Thread[Thread-8,5,main], Thread[Thread-9,5,main], Thread[Thread-0,5,main], Thread[Thread-2,5,main]]

Thread-1
Thread-3

sync = [Thread[Thread-4,5,main], Thread[Thread-5,5,main], Thread[Thread-6,5,main], Thread[Thread-7,5,main], Thread[Thread-8,5,main], Thread[Thread-9,5,main], Thread[Thread-0,5,main], Thread[Thread-2,5,main]]
sync = [Thread[Thread-4,5,main], Thread[Thread-5,5,main], Thread[Thread-6,5,main], Thread[Thread-7,5,main], Thread[Thread-8,5,main], Thread[Thread-9,5,main], Thread[Thread-0,5,main], Thread[Thread-2,5,main]]

Thread-1
Thread-3

sync = [Thread[Thread-4,5,main], Thread[Thread-5,5,main], Thread[Thread-6,5,main], Thread[Thread-7,5,main], Thread[Thread-8,5,main], Thread[Thread-9,5,main], Thread[Thread-0,5,main], Thread[Thread-2,5,main]]
sync = [Thread[Thread-4,5,main], Thread[Thread-5,5,main], Thread[Thread-6,5,main], Thread[Thread-7,5,main], Thread[Thread-8,5,main], Thread[Thread-9,5,main], Thread[Thread-0,5,main], Thread[Thread-2,5,main]]

Thread-1
Thread-3

sync = [Thread[Thread-4,5,main], Thread[Thread-5,5,main], Thread[Thread-6,5,main], Thread[Thread-7,5,main], Thread[Thread-8,5,main], Thread[Thread-9,5,main], Thread[Thread-0,5,main], Thread[Thread-2,5,main]]
sync = [Thread[Thread-4,5,main], Thread[Thread-5,5,main], Thread[Thread-6,5,main], Thread[Thread-7,5,main], Thread[Thread-8,5,main], Thread[Thread-9,5,main], Thread[Thread-0,5,main], Thread[Thread-2,5,main]]

Thread-1
Thread-3

sync = [Thread[Thread-5,5,main], Thread[Thread-6,5,main], Thread[Thread-7,5,main], Thread[Thread-8,5,main], Thread[Thread-9,5,main], Thread[Thread-0,5,main], Thread[Thread-2,5,main], Thread[Thread-1,5,main]]
sync = [Thread[Thread-5,5,main], Thread[Thread-6,5,main], Thread[Thread-7,5,main], Thread[Thread-8,5,main], Thread[Thread-9,5,main], Thread[Thread-0,5,main], Thread[Thread-2,5,main], Thread[Thread-1,5,main]]

Thread-3
Thread-4


```





## 非公平锁

在新获取锁线程与, 同步队列中的线程对锁的竞争是不公平的, 即后来的可以先获取到锁. 

加锁方法先cas获取锁, 失败后进入队列, 锁释放之后去唤醒队首节点争抢锁的时候, 锁可能已经被新到线程获取到了.

## 公平锁

绝对时间基础上的公平

与非公平锁不同, 首先进行的一步操作是

```
protected int tryAcquireShared(int acquires) {
            for (;;) {
            // 当前线程非队首节点的下一个节点 返回失败, 加入同步队列
                if (hasQueuedPredecessors())
                    return -1;
                ...
                ..
            }
        }
        
        
public final boolean hasQueuedPredecessors() {

        Node t = tail; // Read fields in reverse initialization order
        Node h = head;
        Node s;
        return h != t &&
            ((s = h.next) == null || s.thread != Thread.currentThread());
        
    }
```

完全遵循FIFO, 获取锁时先判断自己是不是下一个应该得到锁的线程.



## 重入锁

通过保存线程的引用地址来判断是否可以重入.



## 共享锁

通过定义信号量来做控制. 即同时可以有多少线程可以共享这把锁



## 锁降级

获取读锁 -> 获取写锁 -> 释放读锁 -> 获取读锁 -> 释放写锁 -> 释放读锁
