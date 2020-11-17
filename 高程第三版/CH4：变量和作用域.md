## 基本类型和引用类型
基本类型：`按值访问` `undefined, null, boolean, number, string`

引用类型：`按引用访问` 值是保存在内存中的对象，不允许直接访问内存中的位置，不能操作内存空间，只能操作对象的引用。 `object`

1. 复制的时候，都是副本。一个是`值`，一个是`指针`，指向`堆内存`的同一个对象

## 参数传递
所有函数参数 =》 ==按值传递== 等同于==复制==到另一个变量
```js
// 基础类型
const a = 20;
function add(num) {
    num += 10;
    return num;
}
const result = add(a); // 30
console.log(a); // 20 没有变化

// 引用类型 example1
const person = new Object();
function setName(localObj) {
    localObj.name = 'lily';
}
setName(person);
console.log(person.name); // lily ==不是undefined！==

// 引用类型 example2
const person = new Object();
function setName(localObj) {
    localObj.name = 'lily';
    localObj = new Object(); // 对这个变量进行重写 => 新增一个指针
    localObj.name = 'tom';
}
setName(person);
console.log(person.name); // 还是lily，不是tom
```
1. 对象也是==按照值来传递==（从example2看出来），但是`localObj`会==按照引用来访问==对象
（example1）。于是内部改了属性，对外部的person也有影响。因为`person`指向的对象在堆内存里面只有一个。
2. 改成tom的这个变量，因为在函数内部，所以引用的是一个`局部对象`。在函数执行完毕后会立即销毁。而`person`是一个`全局对象`。
3. 总结一下：按值传递参数，等同复制新建一个局部变量。



## 4.2作用域
1. 执行环境（全局+函数）定义了变量或函数有权访问的其他数据，决定了他们各自的行为。每个执行环境都有一个与之关联的==变量对象variable object==，环境中定义的所有变量和函数都保存在这个对象中。
2. 每个函数都有自己的执行环境。当==执行流==进入一个函数时，函数的环境推入==环境栈==。执行完成再弹出，把控制权返回之前的执行环境。
3. 执行时，会创建变量对象的一个==作用域链scope chain== 前端存的当前执行代码的变量对象。如果环境是函数，就将其==活动对象activation object==作为变量对象。一开始只包含一个`arguments`对象。
4. 标识符解析沿着`作用域链`往上解析，直到`window`对象。是`线性+有序`的

## 4.3 垃圾收集
js有自动垃圾收集机制：`标记清除mark-and-sweep`。在运行时给存储在内存的所有变量加标记，然后去掉环境中和被引用的变量的标记。

如果一个数据不再用，最好设置为`null`,解除引用`dereferencing`。