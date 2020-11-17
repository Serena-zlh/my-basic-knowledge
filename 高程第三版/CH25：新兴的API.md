### requestAnimationFrame()
#### 早期动画循环-setInterval
一般电脑刷新频率是60Hz, 每秒钟重绘60次。所以最平滑的循环间隔是1000ms/60 ≈ 17ms.不过定时器有前面说的问题，不一定能保证在需要的时间执行

#### 标准
`window.requestAnimationFrame()`: 要求浏览器在===下次重绘之前===调用指定的回调函数更新动画
```js
const element = document.getElementById('some-element-you-want-to-animate'); 
let start;

// timestamp: DOMHighResTimeStamp参数。当前这个回调执行的时间，单位毫秒
function step(timestamp) {
  if (start === undefined) {
    start = timestamp;  
  }
  const elapsed = timestamp - start;

  //这里使用`Math.min()`确保元素刚好停在200px的位置。
  element.style.transform = 'translateX(' + Math.min(0.1 * elapsed, 200) + 'px)';

  if (elapsed < 2000) { // 在两秒后停止动画
    window.requestAnimationFrame(step);
  }
}

window.requestAnimationFrame(step);
```

### Page Visibility API
1. 页面是否对用户可见： 最小化， 被其他标签隐藏. 可以停掉定时器或动画
2. `document.addEventListener('onvisibilitychange', function() {});` 监听事件，然后用`document.hidden`属性判断是否隐藏。


### Geolocation API 地理定位
1. 访问到用户的当前位置信息，前提用户同意共享信息
2. `var watchId = watchPosition()`函数是用来监听用户，和getCurrentPosition传参一样，类似轮询但是他是等系统推送变化的位置，能使用`clearWatch(watchId)`取消监控


```js
navigator.geolocation.getCurrentPosition(function(postion) {
    const { coords: { latitude, longitude } } = postion;
    console.log('经度:', longitude, '纬度:', latitude);
    //上海 经度: 121.45210139999998 纬度: 31.1823807
}, function(error) {
    console.log(error.code);
    console.log(error.message);
})
```

### File API
1. `list = e.target.files`返回file集合。每个file对象对应一个文件. `name, size(字节大小), type(MIME类型)`属性
2. `FileReader`类型实现了异步文件读取机制。可以类比成XHR。
    - `readAsText(file, encoding)`: 以纯文本形式读取文件，将读取的文本保存在`FileReader.result`属性
    - `readAsDataURL(file)`: 读取文件并将以数据URI形式保存(读图片保存成URI)
    - `readAsBinaryString(file)`: 将一个字符串保存，字符串的每一个字符表示一个字节
    - `readAsArrayBuffer(file)`: 将一个包含文件内容的ArrayBuffer保存在result属性里
    - 支持三个事件监听`onerror, onload, onprogress`, 进度事件和XHR的进度事件一样，提供`e.lengthComputable, e.loaded, e.total`属性


3.  代码举例:

```js
    const fileInput = document.getElementById('J_input');
    fileInput.onchange = function (e) {
    	const fileReader = new FileReader();
    	const currentFile = e.target.files[0];
    	const { type } = currentFile;
    	
    	if (/image/g.test(type)) { // type: "image/jpeg"
    		fileReader.readAsDataURL(currentFile); // 图片就可以转成base64啦
    	} else if (/text\/plain/.test(type)) { // type: text/plain txt文件
    		fileReader.readAsText(currentFile, 'gbk');
    	}
    	
        fileReader.onload = function(re) {
    		console.log('读取成功:', fileReader.result); //<img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAE......" />
    	}
    }
```

4. `File`对象支持一个`slice()`方法读取部分内容，返回一个`Blob`实例(file的父类型).

```js
// 兼容写法
function blobSlice(blob, startByte, length) {
    // 起始字节和要读取的字节
    if (blob.slice) {
        return blob.slice(startByte, length);
    } else if (blob.webkitSlice) {
        return blob.webkitSlice(startByte, length);
    } else if (blob.mozSlice) {
        return blob.mozSlice(startByte, length);
    } else {
        return null;
    }
}

// 只读取头部文件32B，可以用来判断特定部分
const blob = blobSlice(currentFile, 0, 32);
fileReader.readAsText(blob, 'gbk');
```


5. 对象URL，引用保存在File或Blob中数据的URL。使用`window.URL.createObjectURL(File)`即可。因为放在内存，所以可以用`window.URL.revokeObjectURL(url)`释放。`blob:http://admin.mihoyo.com:8080/8c25b657-0dcb-4611-94df-5f92a3e55f5c` 前缀是域名


#### 拖放文件
桌面上把文件拖放到浏览器也会触发`drop`事件。而且从`e.dataTransfer.files`读取到被放置的文件。所以可以结合XHR做一个文件上传
```html

<div draggable="true" id="J_dropArea">拖到此处上传文件</div>

<script>
const dropArea = document.getElementById('J_dropArea');
dropArea.addEventListener('dragover', dragoverHandler);
dropArea.addEventListener('drop', dropHandler);

function dragoverHandler(e) {
	e.preventDefault();
	e.stopPropagation();
}

function dropHandler(e) {
	e.preventDefault();
	e.stopPropagation()
	const dropFile = e.dataTransfer.files[0];
	console.log('拖过来的文件是:', dropFile.name, '(' + dropFile.type + ')'); //eg: test.png (image/png) 拿到的信息和上传一样
}

// draggable=true 此元素可被拖拽
// 一个元素变成可释放区域，该元素必须设置 ondragover 和 ondrop 事件处理程序属
</script>
```

#### 利用XHR上传文件
借助`FormData`用表单的方式上传文件。`data = new FormData(); data.append('my_file', file)`


### Web计时 window.performance对象

window.performance.timing | 属性解释(都是具体时间戳) - 不满足条件都为0
---|---
unloadEventEnd, unloadEventStart | 前一个页面(同域)unload事件开始和结束时间
redirectStart, redirectEnd | 到当前页面的重定向开始结束时间(同域)
fetchStart | 开始通过http get取得页面的时间
domainLookupStart, domainLookupEnd | 查询当前页面DNS的开始结束时间
connectStart, connectEnd | 浏览器尝试连接-成功连接服务器的时间
secureConnectionStart | 浏览器尝试以SSL方式连接服务器的时间(https)
- | -
requestStart | 浏览器开始请求页面的时间
responseStart | 浏览器接收到页面第一字节的时间
responseEnd | 浏览器接收到页面所有内容的时间
- | -
domContentLoadedEventStart, domContentLoadedEventEnd | 发生`DOMContentLoaded`事件和执行完所有事件处理程序的时间
loadEventStart,loadEventEnd | 发生`load`事件和执行完所有事件处理程序时间


### Web Workers - 让js在后台运行，不阻塞页面
1. worker里面执行的js代码完全在另一个作用域中，和网页中代码无关。只能通过`postMessage()`交互
2. 在worker里面，`this`指向也是worker对象，有一些限制的对象，比如`navigator(userAgent, platform, onLine), location, setTime系列, XHR`
3. 无法直接操作DOM和外观，全靠异步的message沟通，传递时是复制而不是引用
4. 专用: `new Worker()`, 同源下共享：`new SharedWorker()`


```js
// main.js
const largeArr = [];
const outerWorker = new Worker('myutil.js'); // 专用
outerWorker.onmessage = function(e) {
    console.log('拿到的处理好的数据：', e.data);
}
outerWorker.postMessage(largeArr);

// outerWorker.terminate(); 终止

// myutil.js
// 然后worker里面静默处理大数据, 不阻塞页面. 写不写this都行，因为worker就是全局作用域
onmessage = function(e) {
    const largeData = e.data;
    // do thing
    postMessage(largeData);
}
// close(); 终止
```
