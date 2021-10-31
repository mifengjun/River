---
title: Android 显示图片的指定位置图像 ImageView ImageButton
id: problem-android-imageView
tags:
    - Android
categories:
    - 笔记
    - 问题解决
abbrlink: 8437
date: 2018-08-12 19:19:22
updated: 2018-08-12 19:19:22
comments: true
---


### 问题出现

UI提供了一些图标素材，但是是在一张图片上 如图：

<!--more-->

![UI提供的图](/images/posts/problem-android-imageView/20180812183216164.png)

``产品需要在页面下方横排显示三个按钮``

![产品需要的图](/images/posts/problem-android-imageView/2018-08-12_183322.png)

### 解决方案 

废话不多说，网上搜了一下，大多都是通过代码重新绘制。因为我比较粗俗，所以自己找到了一种解决办法。



#### 心历路程

> 设置scaleType的值来实现

根据查阅资料了解Image相关view的属性值了解到

对于android:scaleType属性，因为关于图像在ImageView中的显示效果，所以有如下属性值可以选择：

- matrix：使用matrix方式进行缩放。
- fitXY：横向、纵向独立缩放，以适应该ImageView。
- fitStart:保持纵横比缩放图片，并且将图片放在ImageView的左上角。
- fitCenter：保持纵横比缩放图片，缩放完成后将图片放在ImageView的中央。
- fitEnd：保持纵横比缩放图片，缩放完成后将图片放在ImageView的右下角。
- center：把图片放在ImageView的中央，但是不进行任何缩放。
- centerCrop：保持纵横比缩放图片，以使图片能完全覆盖ImageView。
- centerInside：保持纵横比缩放图片，以使得ImageView能完全显示该图片。

由于我这里UI提供的图片比较特殊，所以第一张和第二张的图片分别可以通过设置 ``matrix``和``center``获取到

```
  <ImageButton
        android:id="@+id/qq_login"
        android:layout_width="wrap_content"
        android:layout_height="47dp"
        android:layout_marginBottom="100dp"
        android:layout_marginLeft="100dp"
        android:layout_marginStart="100dp"
        android:background=""
        android:contentDescription="@string/qq_login_content_description"
        android:scaleType="matrix"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:srcCompat="@drawable/login" />
```
![](/images/posts/problem-android-imageView/2018-08-12_184259.png)

```
    <ImageButton
        android:id="@+id/wx_login"
        android:layout_width="wrap_content"
        android:layout_height="47dp"
        android:layout_marginBottom="100dp"
        android:layout_marginEnd="8dp"
        android:layout_marginLeft="8dp"
        android:layout_marginRight="8dp"
        android:layout_marginStart="8dp"
        android:background=""
        android:contentDescription="@string/wb_login_content_description"
        android:scaleType="centerCrop"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toStartOf="@+id/wb_login"
        app:layout_constraintStart_toEndOf="@+id/qq_login"
        app:srcCompat="@drawable/login" />

```

![](/images/posts/problem-android-imageView/2018-08-12_184312.png)

到上面的时候,心里还是美滋滋,只要这样下去,不超过5分钟,我的图就画好了.**可是接着尴尬的问题出现了**

第三张的图片怎么取?? WTF??? <s>此处省略18分钟</s>

----

#### 终极方案,完美解决
```
    <ImageButton
        android:id="@+id/qq_login"
        android:layout_width="47dp"
        android:layout_height="47dp"
        android:paddingTop="94dp"
        android:layout_marginBottom="100dp"
        android:layout_marginLeft="100dp"
        android:layout_marginStart="100dp"
        android:background="@null"
        android:contentDescription="@string/qq_login_content_description"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:srcCompat="@drawable/login" />

    <ImageButton
        android:id="@+id/wx_login"
        android:layout_width="47dp"
        android:layout_height="47dp"
        android:layout_marginBottom="100dp"
        android:layout_marginEnd="8dp"
        android:layout_marginLeft="8dp"
        android:layout_marginRight="8dp"
        android:layout_marginStart="8dp"
        android:background="@null"
        android:contentDescription="@string/wx_login_content_description"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toStartOf="@+id/wb_login"
        app:layout_constraintStart_toEndOf="@+id/qq_login"
        app:srcCompat="@drawable/login" />

    <ImageButton
        android:id="@+id/wb_login"
        android:layout_width="47dp"
        android:layout_height="47dp"
        android:layout_marginBottom="100dp"
        android:layout_marginEnd="100dp"
        android:layout_marginRight="100dp"
        android:paddingBottom="94dp"
        android:background="@null"
        android:contentDescription="@string/wb_login_content_description"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:srcCompat="@drawable/login" />
```
![最终效果](/images/posts/problem-android-imageView/2018-08-12_191847.png)


