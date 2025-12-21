# Hướng dẫn Deploy dự án Car Parking lên Render

## Tổng quan
Dự án này là một NestJS API server kết nối với:
- MongoDB Atlas (Database)
- HiveMQ Cloud (MQTT Broker)
- WebSocket Server
- RESTful API

## Các bước Deploy

### 1. Chuẩn bị Repository trên GitHub

Đảm bảo code của bạn đã được push lên GitHub repository:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

**Lưu ý quan trọng**: File `.env` đã được gitignore, vì vậy các thông tin nhạy cảm sẽ KHÔNG được commit.

### 2. Tạo tài khoản Render

1. Truy cập [https://render.com](https://render.com)
2. Đăng ký tài khoản mới hoặc đăng nhập
3. Kết nối với GitHub account của bạn

### 3. Tạo Web Service mới

#### Option A: Sử dụng Dashboard (Khuyến nghị cho người mới)

1. Trên Render Dashboard, click **"New +"** → **"Web Service"**

2. **Connect Repository**:
   - Chọn repository `BE_Car_Parking` của bạn
   - Click **"Connect"**

3. **Configure Service**:
   - **Name**: `car-parking-api` (hoặc tên bạn muốn)
   - **Region**: `Singapore` (gần Việt Nam nhất)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**:
     ```
     npm install && npm run build
     ```
   - **Start Command**:
     ```
     npm run start:prod
     ```

4. **Instance Type**:
   - Chọn **Free** (cho testing)
   - Hoặc **Starter** ($7/tháng) nếu cần performance tốt hơn

5. Click **"Advanced"** để thêm Environment Variables

#### Option B: Sử dụng render.yaml (Tự động)

File `render.yaml` đã được tạo sẵn trong project. Render sẽ tự động detect và sử dụng file này.

### 4. Cấu hình Environment Variables

Trong phần **Environment Variables**, thêm các biến sau:

| Key | Value | Nguồn |
|-----|-------|-------|
| `NODE_ENV` | `production` | Manual |
| `MONGO_URI` | `mongodb+srv://22521618_db_user:VV5wlga1fnV8drPJ@cluster0.ak6tt6q.mongodb.net/?appName=Cluster0` | Từ file .env |
| `MQTT_BROKER_URL` | `mqtts://4493498903d14e23adba21cf6799663e.s1.eu.hivemq.cloud:8883` | Từ file .env |
| `MQTT_USERNAME` | `22521618` | Từ file .env |
| `MQTT_PASSWORD` | `Atng1234567890/` | Từ file .env |

**Cách thêm**:
1. Click **"Add Environment Variable"**
2. Nhập Key và Value
3. Lặp lại cho tất cả các biến

### 5. Deploy

1. Click **"Create Web Service"**
2. Render sẽ bắt đầu build và deploy
3. Quá trình này mất khoảng 5-10 phút

### 6. Kiểm tra Deployment

#### Theo dõi Build Log:
- Xem tab **"Logs"** để theo dõi quá trình build
- Chờ thông báo: `"Parking Management Server (NestJS) Started"`

#### Test API:
Sau khi deploy thành công, bạn sẽ nhận được URL dạng:
```
https://car-parking-api-xxxx.onrender.com
```

Test các endpoint:
```bash
# Test health check (nếu có)
curl https://car-parking-api-xxxx.onrender.com

# Test API endpoint (thay đổi theo route của bạn)
curl https://car-parking-api-xxxx.onrender.com/api/health
```

### 7. Cấu hình bổ sung (Tùy chọn)

#### A. Custom Domain
1. Vào **Settings** → **Custom Domain**
2. Thêm domain của bạn
3. Cấu hình DNS theo hướng dẫn

#### B. Auto-Deploy
Render tự động deploy khi bạn push code mới lên branch `main`:
- Settings → Build & Deploy → **Auto-Deploy**: `Yes`

#### C. Health Check Path
Nếu bạn có health check endpoint:
- Settings → Health & Alerts
- Thêm **Health Check Path**: `/health` hoặc `/api/health`

## Khắc phục sự cố thường gặp

### 1. Build Failed

**Lỗi**: `npm install` failed
- **Giải pháp**: Kiểm tra `package.json` có hợp lệ không
- Đảm bảo tất cả dependencies đều có trong `dependencies`, không chỉ `devDependencies`

### 2. Application Crashed

**Lỗi**: Port binding issue
- **Giải pháp**: Render tự động set biến `PORT`, cập nhật [main.ts](src/main.ts:19):
```typescript
const port = process.env.PORT || 3000;
await app.listen(port);
```

**Lỗi**: MongoDB connection failed
- Kiểm tra `MONGO_URI` đã được set đúng
- Kiểm tra MongoDB Atlas có whitelist IP `0.0.0.0/0` (allow all)

**Lỗi**: MQTT connection failed
- Kiểm tra HiveMQ credentials
- Kiểm tra URL có đúng protocol `mqtts://`

### 3. Slow Cold Start

Render Free tier có "spin down" sau 15 phút không hoạt động:
- First request sau đó sẽ mất 30-60 giây
- **Giải pháp**: Nâng lên Starter plan hoặc dùng cron job để ping server

## Lưu ý bảo mật

### 1. Bảo vệ Environment Variables
- **KHÔNG BAO GIỜ** commit file `.env` lên Git
- Sử dụng Render Environment Variables cho production
- Xem xét sử dụng Secret Management service

### 2. MongoDB Atlas Security
1. Truy cập MongoDB Atlas Dashboard
2. Network Access → Add IP Address → `0.0.0.0/0` (Allow from anywhere)
   - Hoặc thêm IP của Render (kiểm tra trong Render logs)

### 3. API Security
Xem xét thêm:
- Rate limiting
- CORS configuration (đã có trong code)
- API key authentication
- Helmet.js cho security headers

## Chi phí

### Free Tier
- **Giới hạn**: 750 giờ/tháng (đủ cho 1 service chạy 24/7)
- **Hạn chế**:
  - Spin down sau 15 phút không hoạt động
  - 512 MB RAM
  - Shared CPU

### Starter Plan ($7/tháng)
- Không spin down
- 512 MB RAM
- Shared CPU
- Tốt cho production nhỏ

### Standard Plan ($25/tháng)
- 2 GB RAM
- Dedicated CPU
- Tốt cho production có traffic cao

## Monitoring

### Built-in Monitoring
Render cung cấp:
- **Metrics**: CPU, Memory, Bandwidth usage
- **Logs**: Real-time application logs
- **Alerts**: Email notifications khi service down

### External Monitoring (Khuyến nghị)
- **UptimeRobot**: Miễn phí, ping server mỗi 5 phút
- **Better Uptime**: Alert nhanh hơn
- **Sentry**: Error tracking và performance monitoring

## Tài nguyên hữu ích

- [Render Documentation](https://render.com/docs)
- [NestJS Deployment Guide](https://docs.nestjs.com/deployment)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [HiveMQ Cloud Documentation](https://www.hivemq.com/docs/)

## Checklist Deploy

- [ ] Code đã được push lên GitHub
- [ ] File `.env` KHÔNG được commit
- [ ] MongoDB Atlas whitelist IP 0.0.0.0/0
- [ ] Tạo Web Service trên Render
- [ ] Thêm tất cả Environment Variables
- [ ] Build thành công
- [ ] Application khởi động thành công
- [ ] Test API endpoints
- [ ] Cấu hình Auto-Deploy
- [ ] Setup monitoring/alerts

## Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra **Logs** trên Render Dashboard
2. Kiểm tra MongoDB Atlas connections
3. Kiểm tra HiveMQ Cloud status
4. Liên hệ Render Support (nếu cần)
