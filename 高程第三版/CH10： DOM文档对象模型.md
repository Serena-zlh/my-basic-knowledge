### Node类型
`domA.nodeType === 1 === Node.ELEMENT_NODE`

数值常量(IE除外) | 实际枚举值 |
---|--- | ---
Node.ELEMENT_NODE | 1 | 比如<p>
Node.ATTRIBUTE_NODE | 2 | 
Node.TEXT_NODE | 3 | 文本，没有子节点
Node.CDATA_SECTION_NODE | 4 | xml文档
Node.ENTITY_REFERENCE_NODE | 5 | 
Node.ENTITY_NODE | 6 | 
Node.PROCESSING_INSTRUCTION_NODE | 7 | 
Node.COMMENT_NODE | 8 | 注释
Node.DOCUMENT_NODE | 9 | nodename:"#document" window.document
Node.DOCUMENT_TYPE_NODE | 10 | 
Node.DOCUMENT_FRAGMENT_NODE | 11 | 
Node.NOTATION_NODE | 12 | 

### 节点关系
```js
const first = domA.childNodes[0];
const second = domA.childNodes.item(1);
const formatArr = Array.prototype.slice.call(domA.childNodes, 0);
// childNodes这个属性跟随dom变化实时变动
```

每个节点的属性 | -
---|---
childNodes | 返回子节点集合，类数组
parentNode | 父节点
previousSibling | 同一列表中，同胞节点
nextSibling | 最后一个的next返回null
firstChild | -
lastChild | -

### 引申：相关的CSS选择器

选择器 | 举例 | 含义
---|--- | ---
==元素类== | - | -
element > element | div > p |选择所有父级是 <div> 元素的 <p> 元素
element + element |	div + p	|选择所有紧接着<div>元素之后的<p>元素
element1 ~ element2 |p ~ ul	|选择p元素之后的每一个ul元素
==属性类== | - | -
[attribute]	| img[src] |	选择所有带有`src`属性img元素
[attribute = value] |	[id=test]	| 选择所有使用id="test"的元素
[attribute ~= value] | [title~=flower] | 选择标题属性包含单词"flower"的所有元素
[attribute \|= language] |	[title\|=flower]	| 选择 lang 属性以flower为开头的所有元素, 要断词。flowers这种不匹配
[attribute ^= value] |	a[src^="https"] |	选择每一个src属性的值以"https"开头的元素
[attribute $= value] |a[src$=".pdf"]| 选择每一个src属性的值以".pdf"结尾的元素
[attribute *= value] |a[src*="static"] |	选择每一个src属性的值包含子字符串"static"的元素
==顺序type类== | - | type类，==只能跟标签==
:first-of-type <br> :nth-of-type(1) |	p:first-of-type	| 选择器匹配元素的父级是特定类型的第一个子元素p
:last-of-type <br> :nth-last-of-type(1) |	p:last-of-type |选择每个p元素是其父级的最后一个p元素
:only-of-type |	p:only-of-type|	选择每个p元素是其父级的唯一p元素
==顺序child类== | - | child类，==前面可以是selector==
:only-child	| .test:only-child	| 选择每个.test元素是其父级的唯一子元素
:first-child|p:first-child|指定只有当<p>元素是其父级的第一个子级的样式。
:nth-child(n) |	p:nth-child(2) |选择每个p元素是其父级的第二个子元素
:nth-last-child(n) | p:nth-last-child(2) |选择每个p元素的是其父级的第二个子元素，从最后一个子项计数
:last-child |p:last-child|选择每个p元素是其父级的最后一个子级。(并不是最后一个元素)
==其他== | - | 拿来过滤隐藏 `<img src=''/>`这类无效标签
:root | :root|选择文档的根元素,等同html
:empty |p:empty |选择每个没有任何子级的p元素（包括文本节点）
:not(selector) | p:not([id=test]) | 选择每个id不是test的p元素




#### 节点的操作是指针的操作。
API | -
---|---
appendChild | 如果已经存在，就只是挪位置
insertBefore | (newNode, referNode)
replaceChild | (newNode, replaceNode)
removeChild | (removeNode)
- | -
cloneNode | (deep=true) true还会复制子节点,false就只是节点本身。均不复制事件
normalize | 处理文本节点

### Document类型
是HTMLDocument的一个实例，表示整个HTML页面。
```js
//<html>
document.documentElement === document.childNodes[0] === document.firstChild;
// <body>
document.body
// 注意大小写
document.URL === location.href;
document.domain === location.hostname;
document.referrer //来源页面的url
document.images === document.getElementByTagName('img')

// 检查DOM的实现
const supportCSS2 = document.implementation.hasFeature('CSS2', '10'); // 但是不准=.=
```

### Element 类型
1. nodeType === 1
2. nodeName === tagName === '大写标签'
3. nodeValue === null
4. id, className, title, lang, attributes(动态集合)
5. node.getAttribute('my_special_attr'); // 但是html5规范用data-xx
6. 最好使用属性来获取dom上的数据
7. setAttribute(name, val); removeAttribute(name);
8. ==空白节点== 拿子节点的时候要过滤空白节点(只处理nodeType === 1)

```html
<div id="test" style="color: red" data-name="chapter">testAttr</div>
```
```js
const dom = document.getElementById('test');
dom.dataset.name === 'chapter';
dom.getAttribute('data-name') === 'chapter'

// style和事件处理不一样
dom.getAttribute('style') == ' color: red '; // 是一个文本，带换行格式
dom.style.color === 'red'; // 属性拿，返回对象

```

### Text类型
1. nodeType === 3
2. nodeName === '#text'
3. nodeValue === 文本， 可以修改nodeValue修改文本，会被转义
4. parentNode是一个Element节点
5. document.createTextNode()
6. 合并parentNode.normalize(); 分割 textNode.splitText(index);

### Comment类型-注释
1. nodeType === 8
2. nodeName === '#comment'
3. nodeValue === 注释的内容

### CDATASection类型-XML文档，继承自Text类型

### DocumentType类型
1. nodeType === 10
2. nodeName === doctype名称
3. nodeValue === null
4. parentNode === Document
5. 不能动态创建

### DocumentFragment类型
1. nodeType === 11
2. nodeName === '#document-fragment'
3. nodeValue === null
4. parentNode === null
5. 在文档中无标记，DOM规定其为定量级文档
6. `const fragment = document.createDocumentFragment(); fragemnt.appendChild(....); document.body.append(fragment); //自动删除fragment`
7. 可以用来保存DOM操作节点，最后调用appendChild()之类的API一次性更新文档树


### Attr类型
1. nodeType === 11
2. nodeName === 特性名称
3. nodeValue === 特性值
4. parentNode === null
5. 并不是DOM文档树的一部分，还是用getAttribute()类API访问吧


## DOM操作
```js
// 如果要内联的，用createTextNode(code)来做，ie要兼容下
function loadScript(src) {
    const domScript = document.createElement('script');
    domScript.type = 'text/javascript';
    domScript.src = src;
    document.body.appendChild(domScript); // 这步插入才开始下载脚本
}

function loadCSS(src) {
    const head = document.getElementByTagName('head')[0];
    const domLink = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = src;
    head.appendChild(link); // 插入head异步加载CSS
}
```

### 使用NodeList
主要知道NodeList, NamedNodeMap, HTMLCollection都是动态更新的，注意性能消耗