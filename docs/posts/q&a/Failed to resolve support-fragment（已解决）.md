---
title: Failed to resolve support-fragment（已解决）
id: problem-Failed-to-resolve-support-fragment
tags:
    - Android
categories:
    - 笔记
    - 问题解决
abbrlink: 10841
date: 2018-08-05 11:37:54
updated: 2018-08-05 11:37:54
comments: true
---


### 问题出现
在不同电脑Android Studio上运行同一个项目，出现
```
Could not find support-fragment.jar (com.android.support:support-fragment:27.1.1).
Searched in the following locations:
    https://jcenter.bintray.com/com/android/support/support-fragment/27.1.1/support-fragment-27.1.1.jar

Please install the Android Support Repository from the Android SDK Manager.
Open Android SDK Manager
```
```
Failed to resolve: support-fragment
Open File
```


----

<!--more-->



解决这个问题只需要在build.gradle文件里修改allprojects 里面的repositories，把google放到jcenter前面就可以了

**原文件**
```

allprojects {
    repositories {
        jcenter()
        mavenCentral()
        maven { url 'https://maven.google.com' }
        maven { url "https://dl.google.com/dl/android/maven2/"}
    }
}
```


**修改后**

```
allprojects {
    repositories {
        maven { url 'https://maven.google.com' }
        jcenter()
        mavenCentral()
        maven { url "https://dl.google.com/dl/android/maven2/"}
    }
}
```
