```js
const supportDOM3Core = document.implementation.hasFeature('Core', '3.0'); // true
```

1. 可以用`a.isSameNode(a); a.isEqualNode(b);` 来判断两个节点是否相同 or 只是相等属性
2. 访问iframe下的文档实例 
   ```js
      const a  =document.getElementsByTagName('iframe');
      const documentEle = a[0].contentDocument;
      // 直接访问: documentEle.body
   ```

### 样式
1. 访问`style`只是内联样式，要用驼峰设置,比如`fontSize`。
2. 赋值前可以先`removeProperty('')`移除属性再设置
3. `document.defaultView.getComputedStyle(myEle, null)` 第二个参数可以传伪元素。返回这个元素实际的style值。IE是用`currentStyle`属性返回当前元素全部计算后的样式
4. 所有计算的样式都是只读的，而且会返回系统预设的值，这也许每个浏览器是不一样的
5. 通过`document.styleSheets`属性返回文档所有样式表 -> 会影响层叠效果和全局，所以谨慎使用吧
   ```js
      const sheet =  document.styleSheets[0];
      const rules = sheet.cssRules || sheet.rules;
      const rule = rules[0];
      rule.style.color = 'red';
      
      sheet.insertRule('body {color: red}', 0); // 0表示插入到第一条规则
      //ie用的addRule('body', 'color: red', 0);
      
      //删除规则
      sheet.deleteRule(index);
      // ie: removeRule(index)
   ```

### 元素大小
#### 偏移量
1. offsetHeight: 元素高度+可见水平滚动条+上下边框高度
2. offsetWidth: 元素宽度+可见垂直滚动条+左右边框高度
3. offsetLeft: 左外边框到包含元素的左内边框
4. offsetTop: 上外边框至包含元素上内边框
5. 计算元素页面偏移，要循环到根元素，加对应的Left，Top
![image](https://s1.ax1x.com/2020/10/20/Bp7uhd.png)


#### 客户区大小
clientHeight: 内容区高度+上下内边距
clientWidth: 内容区宽度+左右内边距

#### 滚动大小
包含滚动内容的元素的大小
1. scrollHeight: 在没有滚动条的情况下，元素内容的总高度
2. scrollWidth: 在没有滚动条的情况下，元素内容的总宽度
3. scrollLeft: 被隐藏在内容区域左侧的像素数。这个属性可设置改变滚动位置
4. scrollTop: 被隐藏在内容区域上方的像素数。这个属性可设置改变滚动位置
5. 不含滚动条时，scrollWidth/scrollHeight和clientWidth/clientHeight在不同浏览器表示的值不一样。所以最好取其中最大的 `Math.max(document.documentElement.clientWidth, document.documentElement.scrollWidth)`

#### 确定元素大小
有一个`getBoundingClientRect()`方法，返回矩形对象`left,top,right,bottom`表示元素在页面相对于视口的位置。
一般情况下，`right-left=offsetWidth; bottom-top=offsetHeight`


### DOM树遍历 - 深度优先
#### NodeIterator - 一步一步走 createNodeIterator
#### TreeWalker - 可以跳着走 createTreeWalker
```html
<div id="div1">
    <p>
        <b>hello</b>
        <b>javascript</b>
    </p>
    <ul>
        <li>1</li>
        <li>2</li>
    </ul>
</div>
```
```js
// 都是4个参数，搜索起点，哪些节点，过滤函数filter，无用false
const div = document.getElementById('div1');
const iterator = document.createNodeIterator(div, NodeFilter.SHOW_ELEMENT, null, false);
const node = iterator.nextNode(); //<p>
const node = iterator.previousNode(); //body

// 只返回li元素
const filter = function(node) {
    return node.targetName === 'LI' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
}
// createTreeWalker 支持parentNode(),firstChild(), lastChild(),nextSibling(),previousSibling()
```

### 范围range
使用`document.createRange()`创建一个范围
```html
<body>
    <p id='p1'>
        <b>hello</b>
        <b>javascript</b>
    </p>
</body>
```

```js
const range1 = document.createRange();
range1.selectNode(p1); //选中全部节点
range2.selectNodeContents(p1); // 选中p1的所有子节点
```
每个range实例自带属性

属性 | 介绍 | selectNode-range1 | selectNodeContents-range2
---|--- | --- | ---
startContainer | 选区第一个节点的父节点
startOffset | 选区第一个节点在父节点中childNodes的索引
endContainer | 选区最后一个节点的父节点
endOffset | 选区最后一个节点在父节点中childNodes的索引


#### setStart(startContainer, startOffset), setEnd(endContainer, endOffset)
可以用这个实现文本的切割，细粒度处理

#### 控制选中的内容
1. `range.deleteContents()`和键盘删除键delete一样
2. `range.extractContents()` 和键盘cut一样，删除但返回这个片段，还能再处理
3. `range.cloneContents()`和键盘copy一样
4. `range.insertNode(nodeEle)`在选区开始处插入节点
5. `range.surroundContents(nodeEle)`在选区周围包一层元素，比如高亮啥的
6. `range.collapse(collapseToStart:true)`选中再点击的效果，光标停在开始还是结束，通过`range.collapsed`属性判断两个节点是否相邻
7. `range.detach(); range=null`解除引用，回收内存

