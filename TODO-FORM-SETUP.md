# ⚠️ 待办：启用预约表单的真·邮件投递（FormSubmit）

> **现状**：联系页 `/contact/` 的预约表单目前用 **mailto 兜底**（点提交会调起访客自己的邮件 App）。
> **目标**：拿到接收邮箱后，改成 **FormSubmit AJAX**，访客提交后内容**直接发进指定邮箱**，且**留在本页显示成功提示**（无需访客自己发邮件）。
> 已选方案：**FormSubmit**（免费、无需注册、无密钥）。

---

## ✅ 启用步骤（拿到邮箱后，约 1 分钟）

### 1. 填邮箱（改 1 行）
打开 **`js/main.js`**，找到这一行（在「Contact form」注释下面）：

```js
var FORM_ENDPOINT = ""; // <-- paste FormSubmit AJAX URL here when you have the inbox
```

改成（把邮箱换成你的实际收件邮箱）：

```js
var FORM_ENDPOINT = "https://formsubmit.co/ajax/换成你的邮箱@example.com";
```

> 注意：是 `/ajax/` 这个地址（AJAX 模式，提交后不跳转、留在本页显示成功）。
> 想隐藏真实邮箱防爬虫？先用真实邮箱激活一次（见第 3 步），FormSubmit 会给你一个随机别名 `https://formsubmit.co/ajax/随机串`，再把上面换成这个别名即可。

### 2. 部署
```bash
cd auroradental-clinic
git add -A && git commit -m "Enable FormSubmit on contact form"
vercel deploy --prod      # 或推 GitHub 触发自动部署
```

### 3. 首次激活（仅一次）
部署后去**线上联系页填一次表单提交**。FormSubmit 会往你填的邮箱发一封 **「Activate Form」确认邮件**，点里面的链接激活。**激活后所有提交才会真正进邮箱。**

### 4. 验证
再提交一次 → 页面应显示绿色「Thank you! Your appointment request has been sent.」→ 你的邮箱应收到一封含 姓名/电话/邮箱/就诊事由 的邮件。

---

## 🔁 以后想换邮箱
就改 `js/main.js` 里 `FORM_ENDPOINT` 那一行的邮箱 → 重新部署 → 新邮箱首次提交再激活一次即可。**随时可改。**

## ↩️ 想退回 mailto
把 `FORM_ENDPOINT` 改回 `""`（空字符串）即可，代码会自动用回 mailto 兜底。

---

## 📌 收件邮箱待定
- [ ] 接收邮箱：__________________（你的测试 Gmail？诊所 info@auroradental.clinic？两个都收？）
- [ ] 是否启用随机别名隐藏真实邮箱

## ⚠️ 隐私提醒（牙医站）
表单含「就诊事由」，可能涉及健康信息。FormSubmit 是第三方中转服务，**适合演示/自测/轻量使用**。若正式交付给诊所长期收病人信息，建议改用 **Vercel 函数 + Resend**（自有域名发件、数据不经第三方）——需要时告诉我，我来接。

---

## 涉及文件
- `js/main.js` —— `FORM_ENDPOINT` 配置 + 提交逻辑（FormSubmit AJAX 主路径 + mailto 兜底）
- `contact/index.html` —— 表单结构 `#booking-form`（字段：your-name / tel-598 / your-email / your-message）
- `css/style.css` —— `.form-status.ok` / `.form-status.err` 成功/失败提示样式
