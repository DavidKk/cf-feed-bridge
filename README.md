# Fedd Bridge

项目属于 `cloudflare worker`

## 豆瓣 转 Sonarr RSS

将豆瓣 RSS 订阅转换成 Sonarr 可消费的`导入列表`。

豆瓣 RSS 链接格式：`https://www.douban.com/feed/people/{Your_Douban_ID}/interests`


### 路径

`/api/douban/sonarr/`

### 参数

| 参数 | 描述 | 示例 |
| --- | --- | --- |
| url | 豆瓣 RSS 订阅链接 | `/api/douban/sonarr/?url=${encodeURIComponent("https://www.douban.com/feed/people/{Your_Douban_ID}/interests")}` |
