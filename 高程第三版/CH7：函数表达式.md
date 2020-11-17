### 两种定义
### 函数声明
tips: 声明会发生`提升`
```js
function foo(arg0, arg1) {
    // do things
}
```
### 函数表达式
1. 这个函数是匿名函数，因为`function`关键字后面没有标识符。
2.不会提升，所以要先赋值再调用 


```js
const foo = function(arg0, arg1) {
    // do things
}
```

### 递归
```js
function foo(num) {
    if(num <= 1) {
        return num;
    }
    return num * foo(num - 1);
    // 以防foo=null的调用，内部最好用argumrnts.callee这个指针指向正在执行的函数
}
```

### 闭包
含义： 有权访问另一个函数作用域中的变量的函数。最常见的创建方法是在一个函数内部创建另一个函数。
==tips: 图7.2了解关系链==
[什么是活动对象，什么是作用域链？](https://www.cnblogs.com/linxd/p/4499813.html)
```js
function a(key) {
    return function (obj) {
        return obj[key];
    }
}
const foo = a('name'); // 1. 创建函数
const result = foo({name: 'lily'}); // 2. 调用函数

foo = null; // 3. 手动解除对匿名函数的引用-释放内存

/**
* 第一步：创建返回以后，a执行环境的作用域链被销毁。但活动对象还在内存。
第二步：foo调用的函数被清除，才算把a销毁
**/
```

### 7.2.2 变量
闭包保存的是整个变量对象
```js
// foo() => [0,1,2,3,4,5]

function foo() {
    let re = [];
    for(let i = 0; i < 6; i ++ ) {
        re[i] = (function (val) {
             return val;
        })(i)
    }
    return re;
}
```

### this
```js
const name = 'window name';
const obj = {
    name: 'obj name',
    getName: function() {
      //返回一个匿名函数, 除非这里 const self = this; 定义一下，匿名函数才能拿到obj name
        return function () {
            return this.name;
        }
    },
    getLocalName: function() {
        return this.name; // 'obj name'
    }
}

obj.getName()(); // 调用返回是window name;
```

## 7.3 匿名函数模仿块级作用域
```js
 // 函数表达式方式
 const foo = function() {
     // 这里是块级作用域
 }
 foo()
 
 // 立即执行匿名函数
 (function () {
      // 这里是块级作用域
 })();
 
 // 闭包形式
 function loop(count) {
     (function () {
         // 这是块级
         for(var i = 0; i < count; i++) {
         // 能访问count因为这是个闭包
             console.log(i);
         }
     })();
     // 执行完匿名函数内的变量i被销毁了
     console.log(i); // 报错
     console.log(count); //正确 因为count在私有作用域
 }
```

## 7.4 私有变量
任何在函数中定义的变量，都可以认为是私有变量。包括参数，局部变量和在函数内部定义的其他函数。

### 特权方法 - 有权访问私有变量和私有函数的共有方法
目的：外部访问函数内部私有属性时，只能通过特权方法，这样会安全些。但要注意原型链上修改会影响所有实例。


