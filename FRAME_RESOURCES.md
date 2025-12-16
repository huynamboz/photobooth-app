# Frame Resources và Download Links

## Nguồn Frame Miễn Phí

### 1. Penci.vn (Recommended cho Vietnamese frames)

**URL**: https://www.penci.vn/tin-tuc/tong-hop-cac-mau-frame-photobooth-hot-trend-chinh-sua-mien-phi-tren-penci.html

**Cách tải**:

1. Truy cập link trên
2. Chọn frame bạn muốn
3. Click "Tải về" hoặc "Download"
4. Chỉnh sửa để có transparent center (nếu cần)
5. Upload lên server/CDN

**Đặc điểm**:

- ✅ Nhiều mẫu frame hot trend
- ✅ Có thể chỉnh sửa miễn phí
- ✅ Phù hợp với thị trường Việt Nam

### 2. Pixabay

**URL**: https://pixabay.com/vi/images/search/photobooth%20background/

**Cách tải**:

1. Search "photobooth frame" hoặc "photo frame border"
2. Filter: Free images only
3. Download PNG files
4. Edit để tạo transparent center
5. Upload lên server

**Đặc điểm**:

- ✅ 400,000+ images miễn phí
- ✅ License: Free for commercial use
- ✅ High quality

### 3. Pexels

**URL**: https://www.pexels.com/vi-vn/tim-kiem/photobooth/

**Cách tải**:

1. Search "photobooth frame"
2. Download free images
3. Edit để tạo frame với transparent center
4. Upload lên server

**Đặc điểm**:

- ✅ Free stock photos
- ✅ High resolution
- ✅ Commercial use allowed

### 4. Freepik (Có cả free và premium)

**URL**: https://www.freepik.com/search?format=search&query=photobooth%20frame

**Cách tải**:

1. Search "photobooth frame"
2. Filter: Free only
3. Download (cần đăng ký free account)
4. Edit và upload

### 5. Canva Templates

**URL**: https://www.canva.com/templates/

**Cách sử dụng**:

1. Tạo account Canva (free)
2. Search "photo frame" templates
3. Customize template
4. Export as PNG với transparent background
5. Upload lên server

## Frame Design Tools

### Online Tools:

1. **Canva**: https://www.canva.com

   - Design frames online
   - Export PNG với transparency

2. **Photopea**: https://www.photopea.com

   - Online Photoshop alternative
   - Free, không cần đăng ký

3. **Remove.bg**: https://www.remove.bg
   - Xóa background để tạo transparency

### Desktop Tools:

1. **Photoshop**: Professional tool
2. **GIMP**: Free alternative
3. **Figma**: Design tool (export as PNG)

## Quick Start với Placeholder Frames

Hiện tại app đã có mock frames với placeholder URLs. Để test nhanh:

1. **Sử dụng mock frames** (đã có sẵn trong code)
2. **Hoặc tải sample frames**:
   ```bash
   ./scripts/download-frames.sh
   ```

## Frame Specifications

### Kích thước khuyến nghị:

- **Width**: 800-1200px (cho mobile)
- **Height**: 1200-1800px (cho vertical photos)
- **Aspect Ratio**: 2:3 hoặc 3:4

### File Format:

- **Type**: PNG
- **Color Mode**: RGBA (với alpha channel)
- **Transparency**: Required (center area)

### File Size:

- **Target**: < 500KB per frame
- **Optimize**: Use tools like TinyPNG

## Upload Frames lên Server

### Option 1: Upload to CDN (Recommended)

- Cloudinary
- AWS S3 + CloudFront
- Firebase Storage
- Imgur (for testing)

### Option 2: Backend API

- Implement `/assets/frames` endpoint
- Store frames in database
- Return frame URLs

## Testing Frames

1. **Test với placeholder**: Đã có sẵn trong code
2. **Test với real frames**:
   - Upload 1-2 frames lên CDN
   - Update URLs trong mock data
   - Test overlay functionality

## Next Steps

1. ✅ Code đã sẵn sàng
2. ⏳ Tải frames từ nguồn miễn phí
3. ⏳ Edit frames để có transparent center
4. ⏳ Upload lên CDN/server
5. ⏳ Update URLs trong code hoặc API
