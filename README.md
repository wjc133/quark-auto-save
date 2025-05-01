<div align="center">

![quark-logo](img/icon.png)

# 夸克网盘自动转存

夸克网盘签到、自动转存、命名整理、发推送提醒和刷新媒体库一条龙。

对于一些持续更新的资源，隔段时间去转存十分麻烦。

定期执行本脚本自动转存、文件名整理，配合 Alist, rclone, Emby 可达到自动追更的效果。🥳


[![wiki][wiki-image]][wiki-url] [![github releases][gitHub-releases-image]][github-url] [![docker pulls][docker-pulls-image]][docker-url] [![docker image size][docker-image-size-image]][docker-url]

[wiki-image]: https://img.shields.io/badge/wiki-Documents-green?logo=github
[gitHub-releases-image]: https://img.shields.io/github/v/release/Cp0204/quark-auto-save?logo=github
[docker-pulls-image]: https://img.shields.io/docker/pulls/cp0204/quark-auto-save?logo=docker&&logoColor=white
[docker-image-size-image]: https://img.shields.io/docker/image-size/cp0204/quark-auto-save?logo=docker&&logoColor=white
[github-url]: https://github.com/Cp0204/quark-auto-save
[docker-url]: https://hub.docker.com/r/cp0204/quark-auto-save
[wiki-url]: https://github.com/Cp0204/quark-auto-save/wiki

![run_log](img/run_log.png)

</div>

> [!CAUTION]
> ⛔️⛔️⛔️ 注意！资源不会每时每刻更新，**严禁设定过高的定时运行频率！** 以免账号风控和给夸克服务器造成不必要的压力。雪山崩塌，每一片雪花都有责任！

> [!NOTE]
> 因不想当客服处理各种使用咨询，即日起 Issues 关闭，如果你发现了 bug 、有好的想法或功能建议，欢迎通过 PR 和我对话，谢谢！

## 功能

- 部署方式
  - [x] 兼容青龙
  - [x] 支持 Docker 独立部署，WebUI 配置

- 分享链接
  - [x] 支持分享链接的子目录
  - [x] 记录失效分享并跳过任务
  - [x] 支持需提取码的分享链接 <sup>[?](https://github.com/Cp0204/quark-auto-save/wiki/使用技巧集锦#支持需提取码的分享链接)</sup>

- 文件管理
  - [x] 目标目录不存在时自动新建
  - [x] 跳过已转存过的文件
  - [x] 正则过滤要转存的文件名
  - [x] 转存后文件名整理（正则替换）
  - [x] 可选忽略文件后缀

- 任务管理
  - [x] 支持多组任务
  - [x] 任务结束期限，期限后不执行此任务
  - [x] 可单独指定子任务星期几执行

- 媒体库整合
  - [x] 根据任务名搜索 Emby 媒体库
  - [x] 追更或整理后自动刷新 Emby 媒体库
  - [x] **媒体库模块化，用户可很方便地[开发自己的媒体库hook模块](./plugins)**

- 其它
  - [x] 每日签到领空间 <sup>[?](https://github.com/Cp0204/quark-auto-save/wiki/使用技巧集锦#每日签到领空间)</sup>
  - [x] 支持多个通知推送渠道 <sup>[?](https://github.com/Cp0204/quark-auto-save/wiki/通知推送服务配置)</sup>
  - [x] 支持多账号（多账号签到，仅首账号转存）

## 部署

### Docker 部署

Docker 部署提供 WebUI 管理配置，图形化配置已能满足绝大多数需求。部署命令：

```shell
docker run -d \
  --name quark-auto-save \
  -p 5005:5005 \
  -e WEBUI_USERNAME=admin \
  -e WEBUI_PASSWORD=admin123 \
  -v ./quark-auto-save/config:/app/config \
  -v ./quark-auto-save/media:/media \ # 可选，模块alist_strm_gen生成strm使用
  --network bridge \
  --restart unless-stopped \
  cp0204/quark-auto-save:latest
  # registry.cn-shenzhen.aliyuncs.com/cp0204/quark-auto-save:latest # 国内镜像地址
```

docker-compose.yml

```yaml
name: quark-auto-save
services:
  quark-auto-save:
    image: cp0204/quark-auto-save:latest
    container_name: quark-auto-save
    network_mode: bridge
    ports:
      - 5005:5005
    restart: unless-stopped
    environment:
      WEBUI_USERNAME: "admin"
      WEBUI_PASSWORD: "admin123"
    volumes:
      - ./quark-auto-save/config:/app/config
      - ./quark-auto-save/media:/media
```

管理地址：http://yourhost:5005

| 环境变量         | 默认       | 备注     |
| ---------------- | ---------- | -------- |
| `WEBUI_USERNAME` | `admin`    | 管理账号 |
| `WEBUI_PASSWORD` | `admin123` | 管理密码 |
| `PLUGIN_FLAGS`   |            | 插件标志，如 `-emby,-aria2` 禁用某些插件 |

#### 一键更新

```shell
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower -cR quark-auto-save
```

<details open>
<summary>WebUI 预览</summary>

![screenshot_webui](img/screenshot_webui-1.png)

![screenshot_webui](img/screenshot_webui-2.png)

</details>

### 青龙部署

程序也支持以青龙定时任务的方式运行，但该方式无法使用 WebUI 管理任务，需手动修改配置文件。

青龙部署说明已转移到 Wiki ：[青龙部署教程](https://github.com/Cp0204/quark-auto-save/wiki/部署教程#青龙部署)

## 使用说明

### 正则整理示例

| pattern                                | replace      | 效果                                                                   |
| -------------------------------------- | ------------ | ---------------------------------------------------------------------- |
| `.*`                                   |              | 无脑转存所有文件，不整理                                               |
| `\.mp4$`                               |              | 转存所有 `.mp4` 后缀的文件                                             |
| `^【电影TT】花好月圆(\d+)\.(mp4\|mkv)` | `\1.\2`      | 【电影TT】花好月圆01.mp4 → 01.mp4<br>【电影TT】花好月圆02.mkv → 02.mkv |
| `^(\d+)\.mp4`                          | `S02E\1.mp4` | 01.mp4 → S02E01.mp4<br>02.mp4 → S02E02.mp4                             |
| `$TV`                                  |              | [魔法匹配](#魔法匹配)剧集文件                                          |
| `^(\d+)\.mp4`                          | `$TASKNAME.S02E\1.mp4` | 01.mp4 → 任务名.S02E01.mp4                                             |

> [!TIP]
>
> **魔法匹配**：当任务 `pattern` 值为 `$开头` 且 `replace` 留空时，实际将调用程序预设的正则表达式。
>
> 如 `$TV` 可适配和自动整理市面上90%分享剧集的文件名格式，具体实现见代码，欢迎贡献规则。

更多正则使用说明：[正则处理教程](https://github.com/Cp0204/quark-auto-save/wiki/正则处理教程)

### 刷新媒体库

在有新转存时，可触发完成相应功能，如自动刷新媒体库、生成 .strm 文件等。配置指南：[插件配置](https://github.com/Cp0204/quark-auto-save/wiki/插件配置)

媒体库模块以插件的方式的集成，如果你有兴趣请参考[插件开发指南](https://github.com/Cp0204/quark-auto-save/tree/main/plugins)。

### 更多使用技巧

请参考 Wiki ：[使用技巧集锦](https://github.com/Cp0204/quark-auto-save/wiki/使用技巧集锦)

## 用户指南

### 1. 登录系统
1. 打开浏览器访问 `http://yourhost:5005`
2. 使用默认账号密码登录（admin/admin123）
3. 建议首次登录后修改密码

### 2. 基础配置
1. 点击左侧菜单【系统配置】
2. 在【夸克Cookie】处填写你的夸克网盘Cookie
3. 如需推送通知，配置相应推送渠道
4. 如有Emby等媒体库，填写相关配置
5. 点击【保存配置】按钮

### 3. 添加转存任务
1. 点击左侧菜单【任务列表】
2. 点击【添加任务】按钮
3. 填写任务信息：
   - 任务名称：便于识别的名称
   - 分享链接：夸克网盘分享链接
   - 保存路径：转存到夸克网盘的路径
   - 文件名匹配规则：使用正则表达式匹配要转存的文件
   - 文件名替换规则：可选，用于整理文件名
   - 结束日期：任务自动停止的日期
4. 点击【保存】按钮

### 4. 油猴脚本使用
1. 安装油猴脚本管理器扩展
2. 安装夸克网盘一键转存脚本
3. 在夸克网盘分享页面点击【一键转存】按钮
4. 选择任务名称后点击确认

### 5. 常见问题
Q: 为什么任务没有执行？
A: 请检查Cookie是否有效、分享链接是否失效、任务是否已过期

Q: 如何获取夸克Cookie？
A: 登录夸克网盘网页版后，按F12打开开发者工具，在Application→Cookies中找到pan.quark.cn的Cookie

Q: 转存失败怎么办？
A: 检查网络连接、账号空间是否充足、分享链接是否需要提取码

## 声明

这个程序基于 Cp0204/quark-auto-save 魔改而成，主要是增加了给一键追剧的油猴脚本使用的接口，还有脚本的 LLM 推理（需要配合dify ai）。