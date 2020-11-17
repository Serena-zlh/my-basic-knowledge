## window对象
1. 是访问浏览器窗口的一个接口
2. 是ECMAScript规定的`Global`对象

### 窗口大小 - 注意兼容性

api | 兼容
---| ---
window.innerWidth |
window.innerHeight |
window.outerWidth |
window.outerHeight |
document.documentElement.clientHeight |document.body.clientHeight

### iframe
1. top对象始终指向最外围框架
2. parent对象表示当前框架的框架，而self对象则回指window

### 导航 window.open
`const newWin = window.open(href, target, attrstr, replace);`

属性 | 含义
---|---
href | 打开的地址
target | 新开框架的名称，有=》覆盖，无=》新建。常用参数`_self, _parent, _top, _blank`
attrstr | 新开窗口的设置特性，比如宽高状态栏之类

浏览器安全限制： 只能用户行为才能打开窗口。如果被拦截，`newWin`返回的是`null`

### setTimeout vs setInterval
1. 都是在全局作用域中执行的，所以函数中的`this`在非严格模式是`window`对象，严格模式下是`undefined`
2. js是单线程语言，所以等待时间不一定是传进去的时间，参见事件队列

### 系统对话框
1. `alert(), confirm(), prompt(), window.find(), window.print()`
2. 都是系统自带，无法用CSS控制样式


## location对象
1. `window.location === document.location === true` 引用是一样的
2. http://www.test.com:8080/index.html?id=1#/log
tips: 不同源(origin) => 跨域

属性 | 例子 | 是否影响===跨域===
---|--- | ---
hash | #/log | X
host | www.test.com:8080 | Y (ps:返回会包括端口号) 
hostname | www.test.com | Y (不带端口)
href | 全部 | -
pathname | /index.html | X
port | 8080 | Y
protocol | http: | Y
search | ?id=1 | X
origin | http://www.test.com:8080 | ==Y== protocol+//+host

3. 获取search query的函数

    ```js
    // 记得转义哦： decodeURIComponent('%2b') === '+'
    function getQueryValueByKey(key) {
    	const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`);
    	const searchStr = window.location.search.substr(1);
    	const matchGroup = searchStr.match(reg);
    	console.log(matchGroup);
    	// [0]是整个key=val匹配项, [1]: (^|&)
    	if (matchGroup && matchGroup[2]) {
    		return decodeURIComponent(matchGroup[2]);
    	}
    	return '';
    }
    ```
4. location.assign('')和window.location =''和location.href=''等同的,都会重载页面并新增历史记录
5. location.replace('');不会新增历史记录
6. location.reload(force = false); 默认是缓存中记载

## navigator对象
识别客户端浏览器的标准。

## screen对象
用户显示器信息，每个浏览器不一样，了解下就行=。=

## history对象
1. history.go(num|str); go(-1) === back(); go(1) === forword();
2. history.length 拿用户历史记录长度，判断是否首页
3. 某些浏览器设置hash也会新增一条记录





