# Hướng dẫn Setup Frames cho Photobooth App

## Nguồn Frame Miễn Phí

### 1. Penci.vn

- URL: https://www.penci.vn/tin-tuc/tong-hop-cac-mau-frame-photobooth-hot-trend-chinh-sua-mien-phi-tren-penci.html
- Cung cấp nhiều mẫu frame photobooth hot trend
- Có thể chỉnh sửa miễn phí
- Tải về và upload lên server/CDN

### 2. Pixabay

- URL: https://pixabay.com/vi/images/search/photobooth%20background/
- Hơn 400,000 hình nền photobooth miễn phí
- License: Free for commercial use
- Tải về và chỉnh sửa thành frame

### 3. Pexels

- URL: https://www.pexels.com/vi-vn/tim-kiem/photobooth/
- Ảnh photobooth miễn phí chất lượng cao
- License: Free for commercial use

### 4. PhotoXinhh

- URL: https://photo.freehihi.com/
- Dịch vụ photobooth online
- Có thể tham khảo các frame designs

## Yêu Cầu Frame Design

### Format:

- **File Type**: PNG với alpha channel (transparency)
- **Resolution**:
  - Minimum: 800x1200px (cho 1 ảnh)
  - Recommended: 1600x2400px hoặc 2400x3600px (cho retina)
- **Aspect Ratio**: Phù hợp với ảnh photobooth (thường là 3:4 hoặc 2:3)

### Frame Structure:

```
┌─────────────────┐
│  Frame Border   │ ← Decorative border
│  ┌───────────┐  │
│  │           │  │ ← Transparent area (để hiển thị ảnh)
│  │   Photo   │  │
│  │           │  │
│  └───────────┘  │
│  Frame Border   │
└─────────────────┘
```

### Design Guidelines:

1. **Transparent Center**: Phần giữa frame phải transparent để ảnh hiển thị
2. **Border Width**: Border nên có độ dày phù hợp (không quá mỏng hoặc quá dày)
3. **Decoration**: Có thể thêm patterns, text, icons ở border
4. **Consistency**: Tất cả frames nên có cùng aspect ratio

## Cách Tạo Frame từ Template

### Option 1: Sử dụng Photoshop/GIMP

1. Tạo file mới với kích thước phù hợp (ví dụ: 800x1200px)
2. Design border và decoration
3. Xóa phần center để tạo transparent area
4. Export as PNG với transparency enabled

### Option 2: Sử dụng Canva

1. Tạo design mới
2. Thêm border và decoration
3. Export as PNG với transparent background

### Option 3: Sử dụng Online Tools

- Remove.bg: Xóa background
- Photopea: Online Photoshop alternative
- Canva: Design tool

## Upload Frames lên Server

### Backend API Endpoint:

```
POST /api/v1/assets/frames
Content-Type: multipart/form-data

{
  file: <frame-image.png>,
  frameType: "classic" | "modern" | "vintage" | "elegant",
  name: "Khung cổ điển",
  description: "Khung viền đơn giản"
}
```

### Response:

```json
{
  "id": "frame-uuid",
  "imageUrl": "https://cdn.example.com/frames/frame-1.png",
  "publicId": "frame-1",
  "type": "frame",
  "frameType": "classic",
  "name": "Khung cổ điển",
  "description": "Khung viền đơn giản",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

## Test với Mock Frames

Hiện tại app đang sử dụng mock frames với placeholder URLs. Để test với frames thực tế:

1. **Tải frames từ các nguồn trên**
2. **Upload lên CDN/server của bạn**
3. **Update URLs trong mock data** hoặc **implement API endpoint**

## Ví dụ Frame URLs

Sau khi upload frames lên server, URLs sẽ có dạng:

```
https://your-cdn.com/frames/classic-frame.png
https://your-cdn.com/frames/modern-frame.png
https://your-cdn.com/frames/vintage-frame.png
```

## Next Steps

1. ✅ Code đã sẵn sàng để hiển thị frames
2. ⏳ Tải frames từ các nguồn miễn phí
3. ⏳ Upload frames lên server/CDN
4. ⏳ Implement API endpoint `/assets/frames`
5. ⏳ Test với frames thực tế

## Lưu Ý

- Frames phải có transparent center để ảnh hiển thị
- Đảm bảo frame size phù hợp với photo dimensions
- Optimize file size để giảm load time
- Test trên nhiều device sizes
