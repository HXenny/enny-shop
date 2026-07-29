# Enny China

双语（English / Português）移动优先的跨境时尚商城。项目使用 React + Vite、Node.js + Express、Neon PostgreSQL，可部署到 Render。支付、运费和验证码均按需求实现为人工确认/模拟流程；不会调用真实支付接口，也不会发送真实验证码。

## 本地运行

```bash
npm install
cp .env.example .env
# 将 DATABASE_URL 与 JWT_SECRET 填入 .env
psql "$DATABASE_URL" -f server/schema.sql
npm run dev
```

前端开发地址为 `http://localhost:5173`，API 为 `http://localhost:3000`。生产模式：`npm run build && npm start`。

## 环境变量

| 变量 | 必填 | 用途 |
|---|---:|---|
| `DATABASE_URL` | 是 | Neon PostgreSQL 连接字符串，建议带 `sslmode=require` |
| `JWT_SECRET` | 是 | 登录会话签名密钥 |
| `PORT` | 否 | Render 注入；本地默认 3000 |
| `SMTP_HOST` / `SMTP_PORT` | 否 | SMTP 主机和端口 |
| `SMTP_USER` / `SMTP_PASS` | 否 | SMTP 凭据 |
| `SMTP_FROM` | 否 | 通知邮件发件人 |
| `VITE_API_URL` | 否 | 前后端分域部署时填写 API 地址；同域 Render 留空 |
| `GOOGLE_ANALYTICS_ID` | 否 | 预留统计 ID 配置位 |

没有 SMTP 时下单接口仍会完成订单写入，但会跳过邮件发送；配置 SMTP 后会发送下单和发货状态通知。忘记密码接口可在此基础上接入同一 SMTP 服务，当前 UI 保留账号入口，不伪造已发送邮件。

## Render + Neon 部署

1. 在 Neon 新建项目，复制 pooled connection string。
2. 在 Neon SQL Editor 执行 `server/schema.sql`。
3. 将代码推送 GitHub，在 Render 创建 Web Service，运行时选 Node。
4. Build Command：`npm install && npm run build`；Start Command：`npm start`。
5. 在 Render Environment Variables 填写上表变量，至少设置 `DATABASE_URL`、`JWT_SECRET`；添加自定义域名并按 Render 提示配置 DNS。
6. 部署完成后访问 `/api/health`，应返回 `{ "ok": true }`。首次使用管理员面板可使用固定账号 `ennychina88` / `China88` 登录后继续扩展后台 UI。

## Excel 导入模板

后台接口 `POST /api/admin/import` 接收 `.xlsx/.xls` 的 multipart 字段 `file`。第一行字段如下：

`category,title_en,title_pt,description_en,description_pt,original_price,colors,images,sizes`

其中 `colors`、`images`、`sizes` 使用英文逗号分隔；`images` 仅接受外部网络 URL。导入任何商品都会更新 `settings.last_launch_at`，库存字段不会被读取或参与计算。

## 已实现的核心规则

- 商品售价固定为 Excel `original_price * 0.5`，支持 USD/EUR/GBP/BRL/CNY 手动切换与数据库汇率配置。
- 分类、关键词搜索、懒加载、价格排序接口、商品详情、购物车、地址/订单 API、固定尺码入口、收藏/账户页面基础结构已提供。
- 订单状态字段支持 `pending_payment`、`processing`、`shipped`、`completed`、`cancelled`；运费通过 WhatsApp 人工确认。
- `page_visits` 记录会话、页面、商品与停留时长，管理员统计接口提供访问量、汇总时长、用户数和订单数。
- 固定 WhatsApp：`+86 151 0203 5128`；客服邮箱：`598297898@QQ.com`。

## 自测

```bash
npm test
npm run build
```

生产上线前请补齐 Logo、Banner、WhatsApp 二维码、商品网络图片、SMTP 服务、Google Analytics ID，并将四份政策页的最终法务版本交由当地法律顾问审核后上线。当前站点已经包含双语政策导航和 Cookie 同意入口，政策正文建议按业务所在地复核后发布。
