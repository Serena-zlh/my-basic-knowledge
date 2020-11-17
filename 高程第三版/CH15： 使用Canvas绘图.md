### 基本用法
[API备查](https://www.runoob.com/tags/ref-canvas.html)
```js
const draw = document.getElementById('myCanvas');
if (draw.getContext) {
    const context = draw.getContext('2d');
    
    // toDataURL导出canvas
    const imgUrl = context.toDataURL('image/png');
    const img = document.createElement('img');
    img.src = imgUrl;
    document.body.appendChild(img);
} else {
    console.log('浏览器不支持canvas');
}
```

### 2D上下文
类别 | 描述
---|---
绘制 | 描边`strokeStyle`, 填充`fillStyle`
矩形 | 唯一能直接绘制的图形->矩形。 `fillRect(x, y, w, h), strokeRect(), clearRect()`
线条 | 线条宽度 `lineWidth`, 线条末端形状`lineCap`, 线条相交方式`lineJoin`
圆弧 | 1. `arc(x, y, radius, startAngle, endAngle, counterclockwise=false)` 在(x,y)从顺时针(star, end)弧度画一个半径r的弧线 <br> 2. `arcTo(x1, y1, x2, y2, radius)` 画介于两个切线之间的弧
曲线 | 1.`bezierCurveTo(c1x, c1y, c2x, c2y, x, y)`三次贝塞尔曲线  <br> 2.`quadraticCurveTo(cx, cy, x, y)` 创建二次贝塞尔曲线
创建路径 | 1.开始路径 `beginPath()` <br> 2. `lineTo(x, y)` 从上一点开始，画一条到(x,y)的直线 <br> 3.`moveTo(x, y)` 画笔移动到(x, y)，不画线<br> 4.`closePath()`创建从当前点到开始点的路径
绘制路径 | 1.`rect(x, y, w, h)` 从(x,y)绘制一个w*h的矩形路径。实际需要fill和stroke绘制<br> 2.`fill(), stroke()` 描绘路径 <br> 3.`clip()` 创建剪切路径，但是之后的绘图也会被限制，所以注意`save()和restore()`
文本 | 1. `fillText(text, x, y), strokeText()`绘制文本  <br> 2.`textAlign, textBaseline`属性表示对齐方式，基线。提供`measureText(text)`方法计算fontsize,让文本不爆框  <br> 3.注意兼容性
变换 | 1. `rotate(angle)` 围绕原点旋转图像 <br> 2. `scale(scaleX, scaleY)`缩放图像 <br> 3. `translate(x, y)`原点移动到(x,y) <br> 4. `transform(m1_1, m1_2, m2_1, m2_2, dx. dy)`改变变换矩阵  <br> 5. `setTransform()`重置并创建新的变换矩阵
保存 | `save(), restore()` 栈结构保存上下文的设置和变换，而非内容
图像 | `drawImage(imgDom, x, y, w, h, x2, y2, w2, h2)` 图片从(x,y)裁剪w*h, 然后放在(x2,y2)处拉伸或缩小展示w2*h2  
导出 | `canvas.toDataURL("image/jpeg", 1.0) //data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...9oADAMBAAIRAxEAPwD/AD/6AP/Z"` 是canvas上的方法, 而非上下文
阴影 | `shadowColor`模糊颜色 `shadowBlur`模糊像素 `shadowOffsetX, shadowOffsetY` 阴影偏移量
渐变 | 1. 画布的渐变 后面的图形要注意匹配渐变的范围`grd=ctx.createLinearGradient(0, 0, 170, 0); ctx.fillStyle=grd;` <br> 2. `createRadialGradient(x1, y1, r1, x2, y2, r2)` 放射渐变 都是通过`addColorStop(percent, color)`设置阶段的颜色
重复 | `fillStyle = ctx.createPattern(img|video|canvas, repeat)` 重复绘制图像


#### 获取图像数据
通过`const info = getImageData(x, y, w, h)`获取原始图像数据. 截取画布上的数据，返回的`info`有三个属性`width, height, data`; 其中`data`是个数组，保存每个像素(红绿蓝透明度)的数据。按照像素处理然后再`putImageData()`更新回画布
```js
// 彩色变成灰白  4个色块，红黄蓝绿
const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
ctx.fillStyle = "red";
ctx.fillRect(10,10,50,50);
ctx.fillStyle = "yellow";
ctx.fillRect(60,10,50,50);
ctx.fillStyle = "blue";
ctx.fillRect(10,60,50,50);
ctx.fillStyle = "green";
ctx.fillRect(60,60,50,50);
function copy()
{
	const imgData = ctx.getImageData(10,10,100,100);
	const pixels = imgData.data;
	for(let i = 0; i < pixels.length; i+=4) {
		const red = pixels[i];
		const green = pixels[i+1];
		const blue = pixels[i+2];
		const alpha = pixels[i+3]; // 这个是透明度
		
		const grey = Math.floor((red+green+blue)/3);
		pixels[i] = grey;
		pixels[i+1] = grey;
		pixels[i+2] = grey;
	}
	imgData.data = pixels;
	ctx.putImageData(imgData,150, 10); // 把处理好的数据再放回画布
}
```


#### 合成
1. `ctx.globalAlpha= 0.2`设置后续绘图的透明度
2. `ctx.globalCompositeOperation`属性表示两个对象如何叠加，默认是`source-over`,后绘制的在上
3. 注意兼容性，要多看看浏览器



### WebGL - 3D上下文
非W3C制定的标准，而是Khronos Group制定，其设计了OpenGL ES2.0。 浏览器中使用的WebGL就基于此。

#### 类型化数组typed arrays
`ArrayBuffer`

#### 上下文
`const gl = canvas.getContext("webgl");`
视口坐标系，左下角开始(x=0, y=0)。 视口内部的坐标系，原点(0, 0)在视口中心

##### 着色器shader
1. 不是js写的，用GLSL(opengl shading language)写的，类C语言。
2. webGL基于opengl实现，所以着色器也能用，桌面图形应用可以移植到浏览器中
3. 顶点着色器：3D顶点转换成需要渲染的2D点
4. 片段(像素)着色器：每个像素的颜色 -> 只能通过uniform传入数据
5. 为着色器传递数据方式： 1. attribute 2. uniform
6. 去找额外的资料学习！另一个专业方向了