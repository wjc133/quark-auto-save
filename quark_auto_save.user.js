// ==UserScript==
// @name         Quark Disk Button Adder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在夸克网盘页面添加一个按钮，点击后打印当前页面URL到控制台
// @author       wjc133
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @resource   layui_css https://unpkg.com/layui@2.6.8/dist/css/layui.css
// @match        https://pan.quark.cn/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

(function () {
    'use strict';

    const baseUrl = "http://localhost:5005"

    // 用于判断 DOM 是否 Ready 的选择器
    const initSelector = '#ice-container .share-info-wrap'
    const getUrlBtn = '<div style="background-color: #0d53ff;border-radius: 6px;" class="open-client-button" id="addToAutoSave"><div class="open-share"><span style="width: 16px; height: 16px; display: inline-block; margin-right: 4px; background-image: url(\'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzQzMDkwMzQxOTY2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM0OTAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik05NiA1MTJjMC0yMjkuNzYgMTg2LjI0LTQxNiA0MTYtNDE2YTMyIDMyIDAgMCAxIDAgNjRBMzUyIDM1MiAwIDEgMCA4NjQgNTEyYTMyIDMyIDAgMCAxIDY0IDBjMCAyMjkuNzYtMTg2LjI0IDQxNi00MTYgNDE2Uzk2IDc0MS43NiA5NiA1MTJ6IiBmaWxsPSIjZmZmZmZmIiBwLWlkPSIzNDkxIj48L3BhdGg+PHBhdGggZD0iTTI4OCA1MTJjMC0xMjMuNzMzMzMzIDEwMC4yNjY2NjctMjI0IDIyNC0yMjRhMzIgMzIgMCAwIDEgMCA2NEExNjAgMTYwIDAgMSAwIDY3MiA1MTJhMzIgMzIgMCAwIDEgNjQgMCAyMjQgMjI0IDAgMSAxLTQ0OCAweiIgZmlsbD0iI2ZmZmZmZiIgcC1pZD0iMzQ5MiI+PC9wYXRoPjxwYXRoIGQ9Ik02NjkuMDEzMzMzIDM1NC44NTg2NjdhMzIgMzIgMCAwIDEgMCA0NS4yMjY2NjZsLTEzNC40IDEzNC41MjhhMzIgMzIgMCAwIDEtNDUuMjI2NjY2LTQ1LjIyNjY2NmwxMzQuNC0xMzQuNTI4YTMyIDMyIDAgMCAxIDQ1LjIyNjY2NiAweiIgZmlsbD0iI2ZmZmZmZiIgcC1pZD0iMzQ5MyI+PC9wYXRoPjxwYXRoIGQ9Ik03NzMuODg4IDk4LjQzMmEzMiAzMiAwIDAgMSAxOS43OTczMzMgMjkuNTY4djEwMi40SDg5NmEzMiAzMiAwIDAgMSAyMi42OTg2NjcgNTQuNjEzMzMzbC0xMTQuNjg4IDExNS4yYTMyIDMyIDAgMCAxLTIyLjY5ODY2NyA5LjM4NjY2N0g2NDYuNGEzMiAzMiAwIDAgMS0zMi0zMlYyNDMuNzU0NjY3YTMyIDMyIDAgMCAxIDkuMzAxMzMzLTIyLjU3MDY2N2wxMTUuMjg1MzM0LTExNS43NTQ2NjdhMzIgMzIgMCAwIDEgMzQuOTAxMzMzLTYuOTk3MzMzek02NzguNCAyNTYuOTgxMzMzVjM0NS42SDc2OGw1MC45ODY2NjctNTEuMmgtNTcuMzAxMzM0YTMyIDMyIDAgMCAxLTMyLTMyVjIwNS40ODI2NjdMNjc4LjQgMjU2Ljk4MTMzM3oiIGZpbGw9IiNmZmZmZmYiIHAtaWQ9IjM0OTQiPjwvcGF0aD48L3N2Zz4=\');"></span><span style="color: white;">添加追踪</span></div></div>'

    const model = `
    <form class="layui-form" action="" lay-filter="auto_save_form" style="padding: 20px;">
        <div class="layui-form-item">
            <label class="layui-form-label">资源名</label>
            <div class="layui-input-block">
            <input type="text" name="resourceName" lay-verify="required" placeholder="资源名，剧叫什么就输入什么"  class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">分享链接</label>
            <div class="layui-input-block">
            <input type="text" name="shareLink" lay-verify="required" placeholder="资源链接"  class="layui-input" disabled>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">周几更新</label>
            <div class="layui-input-block">
                <select name="updateDate" lay-verify="required">
                    <option value="">请选择更新日期</option>
                    <option value="1">星期一</option>
                    <option value="2">星期二</option>
                    <option value="3">星期三</option>
                    <option value="4">星期四</option>
                    <option value="5">星期五</option>
                    <option value="6">星期六</option>
                    <option value="7">星期日</option>
                </select>
            </div>
        </div> 
        <div class="layui-form-item">
            <div class="layui-input-block">
            <button type="submit" class="layui-btn" lay-submit lay-filter="demo1">立即提交</button>
            <button type="reset" class="layui-btn layui-btn-primary">重置</button>
            </div>
        </div>
    </form>
    `

    // 如果存在则执行
    function ifExist(selector, func) {
        console.log('check ifExist ...')
        if ($(selector)[0] == null) {
            setTimeout(function () {
                ifExist(selector, func);
            }, 1500);
        } else {
            func()
        }
    }

    function init() {
        // 找到合适的位置插入按钮
        $('.share-info-wrap').append('<div id="cst-btn-wrap"></div>');
        $('.open-client-button').appendTo('#cst-btn-wrap');
        $('#cst-btn-wrap').append(getUrlBtn);
        $('#cst-btn-wrap').css({
            'display': 'flex',
            'gap': '10px',
        })
        $('#addToAutoSave').on('click', function () {
            // alert(window.location.href)
            // 在此处输入 layer 的任意代码
            layer.open({
                type: 1, // page 层类型
                area: ['800px', '400px'],
                title: '追更资源',
                shade: 0.6, // 遮罩透明度
                shadeClose: true, // 点击遮罩区域，关闭弹层
                maxmin: true, // 允许全屏最小化
                anim: 0, // 0-6 的动画形式，-1 不开启
                content: model
            })
            var thisPageUrl = window.location.href
            layui.use(['form'], function () {
                var form = layui.form;
                form.render(); // 渲染全部表单
                var layer = layui.layer;
                form.val('auto_save_form', {
                    "resourceName": getResourceName(thisPageUrl), // "name": "value"
                    "shareLink": thisPageUrl,
                });
                // 提交事件
                form.on('submit(demo1)', function (data) {
                    var field = data.field; // 获取表单字段值
                    const req = {
                        "taskname": field.resourceName,
                        "shareurl": field.shareLink,
                        "savepath": `/国产电视剧/${field.resourceName}`,
                        "pattern": "$TV",
                        "replace": "",
                        "enddate": "2099-01-30",
                        "update_subdir": "",
                        "runweek": [field.updateDate],
                        "addition": {
                            "emby": {
                                "media_id": ""
                            },
                            "aria2": {
                                "auto_download": true,
                                "pause": false
                            },
                        }
                    }
                    // Ajax 提交表单数据
                    $.ajax({
                        url: baseUrl + '/add_task',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(req),
                        success: function (res) {
                            console.log(res)
                            if (res == '0') {
                                layer.msg('保存成功', { icon: 1 });
                                return
                            }
                            layer.msg('保存失败', { icon: 0 });
                        },
                        error: function (err) {
                            layer.msg('保存失败', { icon: 0 });
                        }
                    });
                    return false; // 阻止默认 form 跳转
                });
            });
        })
    }

    function getResourceName(url) {
        // url中「-」后面的部分为资源名
        let index = url.lastIndexOf('-')
        if (index == -1) {
            return ''
        }
        const a = url.slice(index + 1)
        return decodeURI(a)
    }

    const css = GM_getResourceText('layui_css')
    GM_addStyle(css)
    GM_addStyle('.layui-form-label{width: 100px !important;} .layui-input-block{margin-left: 120px;}')

    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://unpkg.com/layui@2.6.8/dist/layui.js";
    document.body.appendChild(script);
    ifExist(initSelector, init);
})();