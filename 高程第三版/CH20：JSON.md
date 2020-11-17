### 语法,解析，序列化
1. 表示三种类型： 简单值(string, number, bool, null)，对象，数组
2. 对象属性要包双引号
3. ES6规范定义了全局对象`JSON`, 两个方法`stringify(), parse()`
4. `stringify`的时候`undefined`的值会被忽略 `JSON.stringify({a: undefined, b:1}) === '{"b":1}' === true`
5. `JSON.stringify(json, 过滤器replaceer，是否保留缩进)` 可以自定义序列化的结果，再处理json
6. 可以在对象上自定义`toJSON()`函数，定义想要的序列化结果
7. 调用`JSON.stringify`时，会优先执行顺序`toJSON, 过滤器，序列化`
8. `JSON.parse(str, 过滤器reviver)` 都是接受`key,value`返回新值
