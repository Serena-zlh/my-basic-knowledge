
## script元素
属性 | 功能
---|---
async | 异步脚本：立即`下载`脚本。只对外部脚本有效
defer | 延迟脚本：立即下载。脚本延迟到文档完全解析之后执行-遇到`</html>`之后
src | 外部脚本地址
type | MIME类型，默认是`text/javascript`

**defer说会按照出现顺序执行，async不能保证。但实际情况defer也不一定**

**`script`标签嵌入的代码片段，会阻塞页面其他内容加载和显示**

==不存在async和defer属性时，会按照script出现的先后顺序依次对他们解析。(但执行顺序不保证)==

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!--外部脚本-->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular/10.1.2/core.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.13.1/umd/react.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.13.1/umd/react-dom.production.min.js"></script>
    <!--弱网环境。下载解析执行完成。走不到body标签了-->
    <!--嵌入脚本-->
    <script>
        function loop() {
            console.log('loop')
            for(var i = 0; i < 100000; i++) {
                console.log('')
            }
            setTimeout(function () {
                alert('settimeout不影响loop2执行')
            }, 1000 * 20)
        }
        loop()
    </script>
    <script>
        function loop2() {
            console.log('我被loop的for循环阻塞掉了')
            setTimeout(function () {
                alert('loop2')
            }, 1000 * 20)
        }
        loop2()
    </script>
</head>
<body>
我被阻塞展示了 
</body>
</html>
```

## 文档模式
标准模式：
`<!DOCTYPE html>`表示文档类型`doctype`是`HTML 5`

