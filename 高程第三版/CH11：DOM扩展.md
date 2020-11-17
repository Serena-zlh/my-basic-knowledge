## 选择符 - 浏览器支持CSS查询
1. 区别于 `document.getElementById, getElementsByClassName, getElementsByTagName`
2. 即： `document.querySelector, querySelectorAll` 入参是选择器格式
3. querySelector: 返回一个或null
4. querySelectorAll: 返回NodeList或[]
5. `document.body.webkitMatchesSelector('body') === true; //matchesSelector(selector) 注意兼容`

## 元素遍历
1. 前文说过遍历可能拿到空白节点，需要`nodeType === 1`来过滤
2. 新增五个属性，返回非空白节点
   - `childElementCount` 返回子元素(不包含文本和注释)个数
   - `firstElementChild` 第一个子元素 firstChild可能是空节点
   - `lastElementChild`,  lastChild
   - `previousElementSibling`,  previousSibling
   - `nextElementSibling`,  nextSibling


## HTML5
1. `document.getElementsByClassName('foo bar') //出现先后无所谓, 返回NodeList`
2. 不同于className返回字符串，新增classList属性，支持`add(), contains(), remove(), toggle()`方法。toggle是有就删除无就新增。
3. 获取焦点元素 `document.activeElement`，刚加载完是`body`。
4. 还能元素调用`hasFocus()`判断是够正在交互
5. 焦点管理是提高web的无障碍性，能确切的知道哪个元素获得焦点，正在被交互
6. `document.readyState` === ('loading' / 'complete') 文档是否加载完成，而不用`onload`啦
7. `document.compatMode` === ('CSS1Compat' / 'BackCompat') 渲染页面是标准or混杂的
8. `document.head`引用<head>
9. `document.charset`表示文档使用的字符集，也能直接设置。 document.charset === "UTF-8"
10. 自定义属性`data-`, 通过`ele.dataset`访问,返回键值对。也能直接设置
11. `innerHTML`属性，返回所有子节点。直接设置dom树，支持读写。但是`script`和`style`如果要插入的话，可能需要前置加一个符号，变成`有作用域的元素`,然后再`removeChild(el.firstChild)`
12. `outerHTML`属性，包含自身+所有子节点
13. `insertAdjacentHTML('location', 'html str')` 插入位置和HTML文本
14. 上面三种方法，直接插入文档，会创建一个html解析器(浏览器级别的)，比用document.create类的DOM操作快很多，但是要控制次数，而且要注意上面绑定的事件处理是否清除


#### scrollIntoView(default = true)
true: 元素顶部和视口顶部尽可能平齐
false: 元素出现在视口中，可能的话，底部和视口顶部平齐
这个方法体验不一，特别是手机浏览器中。不过要比自己算scrollTop好很多


## 专有扩展 - todo待确认是否现在还未纳入规范
#### 文档模式 document mode
决定了可以使用哪些功能，可以通过`<meta>`标签设置

### children属性
去掉了空白节点。childNodes属性是包含空白节点

### contains()方法
`document.body.contains(document.head); === false` 判断是否父子关系

### innerText, outerText, textContent属性
取所有文本节点拼接(格式不同浏览器可能不同)，然后设置文本节点。只会生成一个文本节点，所以会转义符号

### 滚动 
1. scrollIntoViewIfNeeded()
2. scrollByLines()
3. scrollByPages()