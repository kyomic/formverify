# FormVerify

FormVerify是一个超级轻量的表单校验组件，支持创建自定义封装的表单控件


## 使用说明
> FormVerify暂不支持在类似于Vue,React等MVVM框架中运行。

#### 1.引入脚本和样式

```html
<!-- domquery是一个精简版本的jquery,支持部分jquery api -->
<script type="text/javascript" src="domquery.js"></script>
<link rel="stylesheet" type="text/css" href="formverify.css">
<script src="formverify.js"></script>
```

#### 2.创建表单
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
#### 3.交互校验
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
## 技术文档

#### 1.模板
```html
<!--
   class: FormVerify的选择器，可以通过option.elementClass 配置
   data-name/name：描述表单组件的名称，它决定了提交后的表单参数名
   data-value/value: 描述表单的组件值，即表单参数值（对于checkbox/radio组，数组类型用","分隔）
   data-rule:描述验证规则，支持正则和函数名(支持命名空间写法，如：window.com.func)，多条用"###"分隔，可以通过option.divider 配置
   data-message:描述验证失败的消息，多条用"###"分隔，可以通过option.divider 配置
-->
<any class="form-control" data-name="" data-value="" data-rule="" data-message="" ></any>
```

#### 2.API

```javascript
/*
校验表单下所有表单控件
@param {DOM} selector - 表单父容器
@param {object} 参数 {divider:多条校验规则/多条错误消息分隔符，elementClass：表单组件选择器 }
@return {result:true/false 成功或失败，error:异常消息，target:目标表单组件}  或 Boolean
*/
FormVerify.verify( selector, option)


/*
验证单条控件
@param {DOM} selector - 表单控件
@return {result:true/false 成功或失败，error:异常消息，target:目标表单组件}  或 Boolean
*/
FormVerify.verifyElement(element);


/*
得到表单所有参数
@param {DOM} selector - 表单父容器
*/
FormVerify.params( selector )
```

## 演示地址


[index.html](https://kyomic.github.io/formverify/src/index.html "Editor.md")

HomePage
<http://www.shareme.cn>

[mailto:kyomic@163.com](mailto:kyomic@163.com)
> @kyomic

### End