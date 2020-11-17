## 引用类型是一种数据结构
1. 但是他不是类。技术讲js是面向对象的。但不具备所支持的类和接口等结构。
2. 对象是某个特定引用类型的==实例==。使用`new`操作符+`构造函数`创建。

## Object
1. 使用`new`创建 `var obj = new Object()` => 创建的函数对象，有原型链，有`prototype`属性
2. 使用`对象字面量`创建 `var obj = {}` => 实际不会调用Object构造函数，只是一个对象，没有`prototype`属性

## Array
1. 创建方式和对象一样
2. 数组的`length`是可写的，所以可以增加删除元素

   ```js
    arr[arr.length] = 'new item'; // push
    arr[99] = 'new item'; // length=100
   ```
3. 判断一个数组<br>
  `instanceof`:可能存在两个不同的Array构造函数。网页包含多个框架frame。
    所以es6新增了`isArray`来判断

    ```js
    var a = [];
    a instanceof Array; // true
    Array.isArray(a); // true
   
    ```

4. 每个对象都有`toString, toLocaleString, valueOf`三个方法

    ```js
    var a = [1,2,3];
    a.toString(); // 逗号分隔的字符串"1,2,3"
    a.toLocaleString(); // 一般和toString一样"1,2,3"
    a.valueOf(); // 返回数组[1,2,3]
    [null,4, undefined].toString(); // ",4," 用空字符串
    ```
### 栈方法 - LIPO后进先出，只发生在栈顶
`pop`: 头部移除，返回移除项
`push`: 头部增加，返回数组长度

### 队列方法 - FIFO先进先出
`shift`: 移除第一个返回该项
`unshift`: 前端任意增加个项返回长度

### TIPS
`shift+pop => 队列`
`unshift+pop => 反向队列`
`push+pop => 栈`

### 排序
`reverse()`: 改变原数组
`sort()`: 调用每个数组项的`toString()`方法，从小到大
    ```js
    var value = [0, 1, 5, 10, 15];
    value.sort(); // 按照字符串排序反而错了
    console.log(value); // [0, 1, 10, 15, 5]
    ```

### 其他API

api | result
---|---
concat | 返回新的数组
slice | slice(str, end) [str, end)
splice | splice(str, nums, ...append) 返回删除的数组
indexOf, lastIndexOf | 用的全等符比较
every | 全部true返回true
filter | 返回true的数组
forEach | 没有返回值
map | 结果组成的新数组
some | 任一项true,返回true
reduce, reduceRight | 缩小数组，返回一个值
==tips:== 除了`splice`,都不修改原数组的值


## Date
1. Date重写了`toString, toLocaleString, valueOf`三个方法。`toLocaleString`当地时间可能带`am,pm`这类。`toString`带时区的军用时间。`valueOf`返回毫秒数`=== getTime`，可以用来直接比较两个Date

## RegExp
1. 字面量创建和构造函数创建

    ```js
    var pattern1 = /[bc]at/i;
    var pattern2 = new RegExp("[bc]at", 'i'); // 第一个参数要是字符串，所有元字符要双重转义
    
    /\.at/ ==> "\\.at"
    ```
2. RegExp每个==实例==都有5个属性. `global, ignoreCase, lastIndex, multiline, source`. source返回的是字面量形式

   ```js
   console.log(pattern1.global, pattern2.global); // false
   ```
3. `toString, toLocaleString`返回字面量。`valueOf`返回正则本身
4. `typeof /.ab/g === 'object'`

### API
api | result
--- | ---
exec(reg) | 拿来捕获组。返回数组。有全局模式会依次返回，增加`lastIndex`
test(string) | 返回true/false

### RegExp构造函数属性
注： 最近是从后往前看哦，不是第一个括号
长属性名 | 短属性名 | 说明
--- | --- | ---
input | $_ | 最近一次匹配字符串
lastMatch | $& | 最近一次匹配项
lastParen | $+ | 最近捕获组
leftContext | $` | lastMatch之前的字符串
multiline | $* | 是否==所有表达式?==多行模式
rightContext | $' | lastMatch之后的字符串

```js
const str = 'name=foo&age=10;';
const isMatch = /name=([^=;]*)&/.test(str); // isMatch === true
console.log(RegExp.input); // ===str 是在构造函数上的

RegExp['$&'] === 'name=foo&' === RegExp.lastMatch
RegExp['$+'] === 'foo'
RegExp['$`'] === ''
RegExp["$*"] === 'undefined'
RegExp["$'"] === 'age=10;'
```

## Function
1. 函数实际上是对象。所以函数名是一个指向函数对象的指针，不会与某个函数绑定。

    ```js
    // 举个栗子加深理解
    var sum = new Function('num1', 'num2', 'return num1 + num2');
    // 和变量赋值是一样的，所以函数是对象，函数名是指针~~
    
    function sum(a, b) {
        return a + b;
    }
    console.log(sum(1, 2)); // 3
    
    var another = sum; // 复制函数指针sum,不是调用sum()哦
    sum = null; // sum没有指向啦
    console.log(another(1, 2)); // 3 // 一样能返回~
    ```
2. 参考前面说的重载。相同名字的函数，以后面的为准。事实是改变了函数名(指针)的指向。前一个就丢啦
3. 函数声明会提升。函数表达式不会。除了访问的时候，二者的语法是等价的。

### 函数内部属性
1. `arguments`有`callee`属性，这个属性是指针，指向拥有这个`arguments`对象的函数。

    ```js
    // 用arguments.callee指向自身，即使后面换名字了，这个函数还能正确使用
    function factorial(num) {
        if (num <= 1) {
            return 1;
        } else {
            return num * arguments.callee(num - 1);
        }
    }
    ```
2. `caller`这个属性保存着调用当前函数的函数的引用。如果在全局作用域中调用该函数，返回`null`

    ```js
    function outer() {
        inner();
    }
    function inner() {
        console.log(inner.caller); // 会输出outer的源码，因为是他调用inner的
        // 如果参上解耦可以这样写：
        //console.log(arguments.callee.caller);
    }
    outer();
    ```
3. 严格模式下，`arg.callee,arg.caller`都会报错。只是为了区分arg.caller和函数的caller属性。安全考虑，第三方不能在一个环境看到其他代码。

### 函数属性和方法 
1. 每个函数都有两个属性`length`和`prototype`
2. prototype是保存==所有实例方法==的真正所在
3. ES6里，prototype属性不可枚举，for-in拿不到
4. 都有`apply()`,`call()`两个非继承方法。拿来设置函数体内`this`对象的值。=》 对象不用和方法有耦合。不需要在对象里面新增一个方法，然后再调用它
5. ES6新增`bind()`,返回一个函数
6. 每个函数继承的`toString, toLocaleString, valueOf`返回函数代码，格式看浏览器

## 5.6基本包装类型 - 不推荐使用New创建
三种类型`Boolean, Number, String`为了让他们有方法。不过生命周期不一样，当前行就销毁了。
```js
var s1 = 'some text';
var s2 = s1.substring(2); //基本类型String拥有了方法
```
1. 创建一个String类型的一个实例 `new String('some text')`
2. 在实例上调用指定的方法
3. 销毁实例(`s1 = null`)
4. 所以：基本类型就变得像对象一样了
 
==但是不要用New来实例化使用==

New以后就是对象了，typeof和instanceof都和本来的意思有区别。而且比较时，永远是true.


String的API | 参数
---|---
slice | [start, end) 返回子串
substring | [start, end) 返回子串
substr | [start, num) 返回子串
charAt | 返回字符
charCodeAt | 返回字符编码 
match | 和RegExp对象的exec()效果一样，接受一个正则，返回数组
search | 接受正则，返回索引
replace | 替换，支持正则里面的特殊字符序列，比如$,$&...


slice和substring的区别
1. 相同点：
    - start = end : 返回空串
    - end为空，返回到字符串结束
    - 超过字符串长度，就用字符串长度带入
2. substring区别：
    - start > end, 会交换两个参数
    - 参数为负数或NAN，当0处理
3. slice区别：
    - start > end, 返回空串`""`
    - start < 0, 从后面数，类似`substr()`
    - end < 0, 重设 `end = Math.max(0, string.length - Math.abs(end))`



## 5.7 单体内置对象
内置对象，Global(约等于window)，Math
