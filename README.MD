# FormVerify

FormVerify是一个超级轻量的表单校验组件，支持创建自定义封装的表单控件


## 使用说明
> FormVerify暂不支持在类似于Vue,React等MVVM框架中运行。

### 1.引入脚本和样式

```html
<!-- domquery是一个精简版本的jquery,支持部分jquery api -->
<script type="text/javascript" src="domquery.js"></script>
<link rel="stylesheet" type="text/css" href="formverify.css">
<script src="formverify.js"></script>
```

### 2.创建表单
```html
<form id="form">
    <div class="form-group">
        <label>文本框<i class="help">必填，必须是英文</i></label>
        <div class="form-element">
            <input class="form-control" name="input" data-rule=".+###^[a-zA-Z]+$" data-error="必填###只能填英文" />
        </div>
    </div>
</form>
```
### 3.交互校验
```javascript
document.getElementById('button).onclick = function(){
    var res = FormVerify.verify( $("#form") )
    if( !res || res.result == false ){
       console.error("验证失败")
       return
    }
    var params = FormVerify.params($("#form"));
    //submit form ...
}
```

## 演示地址


[index.html](https://kyomic.github.io/formverify/src/index.html "Editor.md")

HomePage
<http://www.shareme.cn>

[mailto:kyomic@163.com](mailto:kyomic@163.com)
> @kyomic

### End