### 跨文档消息传递
1. 来自不同域的页面间相互传递消息 => `from.postMessage(msg, toFrame)`
2. 接受到消息的一方，会触发`window.onmessage`事件，异步事件event包括`data, origin, source`三个属性
3. 第一个参数是字符串，所以注意`JSON.parse(), JSON.stringify()` 

```js
window.addEventListener('message', function(e) {
    const {data, origin, source} = e;
    if (origin === 'http://www.baidu.com') {
        console.log(data); // 收到的消息
        e.source.postMessage('我收到了', 'http://map.baidu.com');
    }
})
```

### 原生拖放
1. 被按住拖放的元素触发： `dragstart -> drag -> dragend`
2. 被放在有效的目标上时，目标触发： `dragenter -> dragover -> dragleave(离开了) | drop(放下了)`
3. 系统不支持放置的目标，可以给他加一个`dragenter, dragover`事件，然后`preventDefault()`就可以放置了
4. 通过`e.dataTransfer`属性在拖放元素之间传递数据 `e.dataTransfer.getData("text")`
5. 默认下，图像链接文本是可拖动的。可以为元素设置`draggable`属性改变是否可拖动


### 媒体元素 <video/> <audio/>
1. 不同音视频编码格式支持不同，内包加入`<source src="a.mp3">`指定多种格式来源
2. 属性和事件参考 [api](https://www.runoob.com/tags/ref-eventattributes.html)
3. 可以调用`new Audio('a.mp3')`创建一个音频，然后在他`canplaythrough`时，直接`audio.play()`
4. 使用`audio.canPlayType('audio/mpeg')`判断是否支持mp3格式


### 历史状态管理
1. 不加载新页面的情况下，改变浏览器的url =》 人工插入历史记录和修改地址栏
2. 使用`history.pushState({}, ''), history.replaceState()`
3. 新的状态信息加入栈，但不会走浏览器请求，此刻`location.href`变了, 也能后退，会触发`window.popstate()`事件
4. 首选`window.hashchange`事件
