# 🗒️ 匿名留言板 (Docker 版本)

## 啟動方式
1. 複製 `.env.example` 為 `.env`（可直接用預設值）
2. 執行：
   ```bash
   docker-compose up --build
   ```
3. 開啟瀏覽器到 [http://localhost:4000](http://localhost:4000)

留言會儲存在 MongoDB 容器中，重新啟動仍保留。
