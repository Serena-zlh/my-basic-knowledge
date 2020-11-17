## 一些小知识点
- 标识符以`/[a-zA-Z]_$/`开头，用驼峰命名法`myTestProject`
- 严格模式`use strict`，一个给js引擎的编辑指示`pragma`
- 不用`var`声明的变量是全局变量。严格模式会报`referenceError`
- 基本数据类型：`Number, Undefined, Null, Boolean, String`
- 复杂数据类型：`Object`
 
### typeof - 6种返回可能
in | out | 备注
---|--- | ---
function() {} | 'function' | 虽然函数不是一种数据类型，但可以用typeof来区分
undefined | undefined | 表示值未定义： 为了区分空对象指针和未经初始化的变量 `undefined === undefined === true`
null | 'object' |
{} | 'object'
1 | 'number'
'1' | 'string'
false | 'boolean'

### Undefined
无需显式初始化变量为undefined
```JavaScript
var name; // 未初始化
// var age; 未声明
alert(name); // undefined
alert(age); // Uncaught ReferenceError: age is not defined

typeof name; // undefined
typeof age; // 不会报错，返回undefined
```
所以无法通过`typeof`区分变量是否被声明还是未初始化

### Null 一个空对象指针
undefined值是派生自null值的，所以非严格模式下 `null == undefined`
如果变量用来保存对象，推荐把其初始化为`null`.这样可以直接检查`null`就可以知道对应变量是否保存了引用
```javascript
var car = null;
if(car !== null) {
    // do something
}
```

### Boolean
用`Boolean()`转换

数据类型 | 转换成true的值 | 转换成false的值
---|--- | ---
Boolean | true | false
String | 任何非空字符串 | ''
Number | 任何非0数字 | 0和NaN
Object | 任何对象 | null (注: typeof null === 'object')
Undefined | - | undefined


### Number
1. 浮点数的精度问题
2. 不区分整数和浮点数
3. 最大`Number.MAX_VALUE` 最小`Number.MIN_VALUE` 有效值`isFinite(1) === true`
4. NaN (not a number)
   1. 任何数和NaN操作都返回NaN
   2. NaN和任何值都不相等，包括自身
   3. `isNaN()` 判断输入值是否能转换成数字
5. Number()规则
    输入 | 输出
    ---|---
    Boolean | false => 0 true => 1
    Number | 输入值 `Number(1.2) => 1.2 Number(20) => 20`
    null | 0
    undefined | NaN
    String | 1. `'010' -> 10` <br> 2. `'012.60' -> 12.6` <br> 3. `'0x70' -> 112`<br> 4. `'' -> 0` <br> 5. 包含其他字符，转成`NaN`
    Object | valueOf(), toString()
6. `function parseInt(s: string, radix?: number): number` (默认十进制)
7. `function parseFloat(string: string): number` (只解析十进制)
8. `parseInt('123test') = 123` `parseFloat`会自动忽略不合法的字符


### String
`toString()` 默认十进制，除了null和undefined都有这个方法

`String()` 覆盖所有情况 `String(null) === 'null'` `String(undefined) === 'undefined'`

### Object
Object的每个实例都具有一些属性和方法
```javascript
var o = new Object();
o = {
    constructor() {},
    hasOwnProperty(name) {
        // 当前对象原型中
    },
    isPrototypeOf(object) {
        // 对象是否是另一个对象的原型
    },
    propertyIsEnumerable(name) {
        // 是否能用for-in枚举
    },
    toLocaleString() {
        // 返回字符串表示
    },
    toString() {
        
    },
    valueOf() {
        // 一般同toString
    }
}
```
## 操作符
### 逻辑非 `！`
做`Boolean()`运算

### 逻辑与 `&&` 
`A&&B` - 他是短路操作. 不一定返回Boolean哦
```javascript
if (typeof a === 'object' 
    || (Boolean(a) && typeof b === 'object')
    || (typeof a === 'object' && typeof b === 'object')) {
    // 我觉得三种情况都能理解成，第一个是对象，就返回第二个管他是啥
    return b;
}
var a = {};
var b = 'test';
a && b === 'test';
```
如果**有一个**操作数是`a`,则返回`a` (a可以为： null, NaN, undefined)

### 逻辑或 `||`
和与刚好相反，如果第一个是对象，就返回第一个，除非第一个求值结果是`false`才会看第二个数。

如果**两个**操作数是`a`,则返回`a` (a可以为： null, NaN, undefined)
```js
var a = {};
var b = 'test';
b || null === b === null || b;
```
### 乘法
存在`Infinity`和`-Infinity`. 如果不是数值会调用`Number()`转换，失败就是`NaN`
```js
Infinity * 1 === Infinity
Infinity * 0 === NaN
Infinity * Infinity === Infinity
```
### 除法
```js
Infinity / 0 === Infinity === 2 /0
0 / 0 === NaN
Infinity / Infinity === NaN
```
### 取模%

### 加 +
记住有字符串会调用`toString()`拼接即可

### 减 -
有字符串，布尔，null，undefined先调用`Number()`转换成数值。如果存在`NaN`则结果是`NaN`
对象就调用`valueOf()`,如果没有就用`toString()`

### 小于 <
存在数值就转换成两个数值进行比较
如果都是字符串，就按照字符编码值比较
如果转换失败成NaN，那始终返回false
```js
'Black' < 'alphabet' === true; // [A-Za-z]
'23' < '3' === true; // 走的字符串比较
'23' < 3 === false; // 会把'23'转换成数值
'a' >= 3 === false; // NaN和任何比较都是false
'a' < 3 === false;
```
由上知，比较字符串要全部转换成大写或小写。

### 相等
#### 相等==和不相等!=
1. 布尔值转换成数值
2. 字符串和数值：字符串转换成数值 `'5' == 5 => true`
3. 对象和非对象，对象用`valueOf()`转换再比较
4. `null == undefined  => true 因为是类似的值`
5. 不会转换null和undefined
6. 如果存在==NaN==(不是null哦), 则 == 时始终返回false，!= 始终返回true
7. 两个对象，就判断指针是否指向同一个对象
8. 举例：
    表达式 | 结果
    ---|---
    null == undefined | true
    'NaN' == NaN | false
    5 == NaN | false
    NaN == NaN | false
    NaN != NaN | true
    false == 0 | true
    true == 1 | true
    true == 2 | false
    undefined == 0 | false  ===tips:不会转换===
    null == 0 | false
    '5' == 5 | true


#### 全等=== 和不全等!==
关键就是不转换操作数

`null === undefined  => false 因为是不同类型`

## 3.6语句
```js
// do-while用的比较少. 后测试循环语句。至少执行一次
var i = 0;
do {
    i += 2;
} while(i < 10);
// while是前测试循环语句
while(i < 10) {
    i += 2;
}
// for也是前测试。和while一样的，只是写法不同
// for-in遍历枚举对象的属性，顺序不可测。不能遍历null和undefined
```

### break和continue
1. 只在for循环里面用哦,forEach是不行滴
2. 多层嵌套，可以用`label`语句联合使用，返回代码中特定的位置
```js
var num = 0;
labelName: for(var i = 0; i < 10; i++) {
    for(var j = 0; j < 10; j++) {
        if(i == 5 && j == 5) {
            break labelName;
        }
        num++;
    }
}
alert(num); // 55
// 如果改成continue, num = 95
// 都会回到labelName: for()这一行重新来
``` 

### switch
```js
switch (exp) {
    case val1:
    case val2:
        // handler
        break;
    case val3:
        // handler
        break;
    default:
        // handler
        break;
}
// 比较用的全等，不会进行数值转换
```

## 3.7函数
```js
function name(arg0) {
    return; // 这种接住的是undefined
}
```
### 函数参数`arguments`
他是一个对象，只是与数组类似，并不是`Array`的实例。可以用`[]`和`length`操作
```js
// 备注：严格模式下，arguments是不能赋值的
// 非严格模式
function add(num1,num2) {
    arguments[1] = 20;
    console.log(num1 + num2);
}
add(10, 40); // 30
// 这个例子，修改arguments[1]就修改了num2,但他们内存空间是独立的，只是值的同步
```
==!注：所有参数的传递都是值，不可能通过引用传递参数==

### 没有重载(参考java)
因为不存在`函数签名`特性
重名函数以后面的为准。只能通过检查传入参数的数量和类型并执行不同逻辑，来模拟重载
