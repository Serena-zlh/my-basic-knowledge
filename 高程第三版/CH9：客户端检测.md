### 能力检测
通过`if-else`判断不同`API`.比如：IE可能和别的api是不一样的

### 怪癖(bug)检测
```js
try {
    // 尝试使用
} catch(e) {
    throw(e)
}
```

### 用户代理检测(userAgent)
1. engine：识别呈现引擎 `IE, Gecko, Webkit, KHTML, Opera`
2. browser： Safari和Chrome都用的WebKit做呈现引擎，但是js引擎却不一样
3. system： Windows，Mac，Unix -> 用`navigator.platform`
4. mobile: ios，Android，winMoblie
5. 游戏系统： 任天堂Nitendo Wii (定制版Opera), PS4：PlayStation(自研)
6. 9.3.3有完整代码。就不附了。大致逻辑还是按照引擎和关键字来遍历