Ajax：Asynchronous JavaScript + XML。 核心就是XMLHttpRequest对象

### XHR对象 xhr = new XMLHttpRequest()
```js
// 当前www.test.com
xhr.open('get', 'http://www.baidu.com', false); // 第三个参数是否异步发送
xhr.send(data = null); // 报错，跨域了

// 同步的请求，js会等返回再执行
// 异步请求，要监听onreadystatechange事件
```

1. `xhr.status`: HTTP响应状态 正常`code >= 200 && code < 300 || code === 304`
2. `xhr.responseText`: 作为响应主体被返回的文本 (无关类型，都能取到)
3. `xhr.responseXML`: 如果响应内容的类型是`text/xml, application/xml`，返回XML DOM文档
4. `xhr.onreadystatechange = function() {}` 监听异步请求状态，必须在`xhr.open()`之前指定以兼容。没有`event`,没有`this`。
5. `xhr.readyState === 4` 请求完成，接收到全部响应数据。 0-4分别：未初始化，启动，发送，接收，完成
6. `xhr.abort()` 取消异步请求，记得回收引用关系。
7. `get`请求后面跟的键值对记得`encodeURIComponent()`


### HTTP头部消息
支持`xhr.setRequestHeader(key, val)`自定义请求头信息，在`open`之后调用。用`xhr.getResponseHeader(key)`获取

字段 | 含义
---|---
Accept | 浏览器能够处理的内容类型
Accept-Charset | 浏览器能够显示的字符集
Accept-Encoding | 浏览器能处理的压缩编码
Accept-Language | 浏览器当前设置的语言
Connection | 浏览器与服务器之间连接的类型
Cookie | 当前页面设置的任何Cookie
Host | 发出请求的页面所在域
Referer | 发出请求的页面URI
User-Agent | 浏览器的用户代理字符串


### XHR 2级
#### FormData
针对表单数据的序列化`<form/>`, 创建和表单格式相同的数据
```js
const data = new FormData();
data.append('name', 'value');
const form = new FormData(document.getElementById('J_form'));
xhr.send(form); // 能直接传递。 不用设置Content-type = 'application/x-www-form-urlencoded'
```

### 进度事件 - 与客户端服务器通信

事件名称 | 触发时机
---|---
loadstart | 接收到响应数据，第一个字节
progress | 接受响应，持续触发
error | 请求发生错误
abort | 调用`abort()`终止连接
load | 在接受到完整的响应数据触发
loadend | 触发了error, abort, load之一时触发 - 兼容:不一定都支持

```js
// 进度条
xhr.onprogress = function(e) {
    // xhr === e.target
    if (e.lengthComputable) {
        console.log(`Received: ${e.position} of ${e.totalSize} bytes`);
    }
}
```


### 跨源资源共享 CORS ( Cross-Origin Resource Sharing )[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
默认情况下，XHR对象只能访问与包含它的页面在==同一个域==的资源。CORS草案定义了如何使用自定义头部信息，让浏览器和服务器能沟通
```js
// 浏览器先发 协议+域名+端口
Origin: http://www.test.com
// 服务器回发
Access-Control-Allow-Origin: http://www.test.com
// 浏览器确认OK，不会驳回请求。然后就能处理请求了。
```

==跨域时，请求和响应都不会包含cookie信息==

#### preflighted request - options方法
##### 简单请求：(满足所有下述条件)
1. 使用了`get, head, post`方法之一
2. 人为设置的首部字段： `Accept, Accept-Language, Content-Language, DPR, Downlink, Save-Data, Viewport-Width, Width`, 然后`Content-Type`的值仅限于`text/plain, multipart/form-data, application/x-www-form-urlencoded` 三个
3. 请求中的任意`XMLHttpRequestUpload` 对象均没有注册任何事件监听器
4. 请求中没有使用 `ReadableStream `对象。

##### 除了简单请求，其他都要预检请求

#### 带凭据的请求
跨域请求下，设置`withCredentials: true`指定请求发送`cookie, http认证`等凭据。服务器响应头也要设置`Access-Control-Allow-Credentials: true`.否则浏览器会触发`onerror`事件，拿不到xhr的返回

#### 兼容的CORS方案
```js
function createCORSRequest(method, url) {
    let xhr = new XMLHttpRequest();
    if ('withCredentials' in xhr) {
        xhr.open(method, url, true); // 主流浏览器
    } else if (typeof XDomainRequest !== 'undefined') { // ie
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}

const res = createCORSRequest('get', '/test');
if (res) {
    res.onload = function() { // ie 没有readystatechange, 只能用大家都有的load处理
        console.log(res.responseText);
    }
    res.onerror = function() {
        console.log('请求报错了，错误未知');
    }
    res.send();
}
```


### 其他跨域技术
#### 图像Ping
借用`<img/>`标签，`src`是可以跨域的，所以能用隐藏的img跟踪广告流量。get请求单向通信

#### JSONP
`<script src="http://getjson/?callback=handleInfo" />`
由回调函数和数据组成。算双向通信
核心则是动态添加`<script>`标签来调用服务器提供的js脚本


#### Comet - 服务器向页面推送数据
1. 长轮询： 短轮询的优化版本。但都是先发起对服务器的连接。短轮询是立刻响应，长轮询是等待有数据再响应。使用`XHR对象和setTimeout()`就能实现
2. HTTP流：整个生命周期只有一个http连接。服务器定期向浏览器发送数据，监听`readystate=3`来获取这次新增的部分
3. SSE(server-send events)服务器发送事件：支持轮询和http流，在断开连接时自动重连。使用`const source = new EventSource('test.php')`创建实例
4. Web Sockets：一个单独的持久连接上，提供全双工，双向通信。在服务器响应后，从http协议交换成web socket协议。需要专门支持的服务器。`new WebSocket(ws://), 加密wss://`, 绝对url，没有限制是否要同源。`s.send(str) `只能发文本，记得序列化。
5. 聊天室：WS, 实时股价展示：SSE。 不过XHR+SSE也能实现WS。 WS有自己的WS协议，注意抉择。


### 安全
CSRF(Cross-Site Request Forgery 跨站请求伪造): 未被授权系统伪装自己，去访问了资源。
XSS(Cross Site Script 跨站脚本攻击)：网页注入脚本
