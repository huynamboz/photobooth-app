# Frame Implementation Guide for Photobooth App

## Tổng quan

Các app photobooth phổ biến thường sử dụng các kỹ thuật sau để implement frame overlay:

## Giải pháp 1: PNG Frame với Transparent Areas (Recommended)

### Cách hoạt động:
- Frame là file PNG có phần trong suốt (transparent) ở giữa để hiển thị ảnh
- Overlay frame lên ảnh bằng cách sử dụng absolute positioning
- Frame có thể có border, decoration, text overlay

### Ưu điểm:
- ✅ Dễ implement
- ✅ Performance tốt
- ✅ Flexible - có thể tạo nhiều frame designs
- ✅ Không cần image processing phức tạp

### Implementation:
```tsx
// Frame structure: PNG với transparent center
<View style={{ position: 'relative' }}>
  <Image source={{ uri: photoUrl }} style={{ width, height }} />
  <Image 
    source={{ uri: frameUrl }} 
    style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width, 
      height,
      zIndex: 1 
    }} 
  />
</View>
```

## Giải pháp 2: Image Composition với react-native-image-manipulator

### Cách hoạt động:
- Merge ảnh và frame thành 1 ảnh duy nhất
- Sử dụng thư viện để composite images

### Ưu điểm:
- ✅ Output là 1 file ảnh duy nhất
- ✅ Có thể apply effects, filters
- ✅ Chất lượng tốt

### Nhược điểm:
- ❌ Cần thư viện bên ngoài
- ❌ Processing time lâu hơn
- ❌ Phức tạp hơn

### Libraries:
- `react-native-image-manipulator`
- `react-native-image-editor`
- `react-native-image-picker`

## Giải pháp 3: Canvas-based với react-native-view-shot

### Cách hoạt động:
- Render ảnh và frame trong View
- Capture toàn bộ View thành 1 ảnh

### Ưu điểm:
- ✅ Flexible layout
- ✅ Có thể thêm text, stickers
- ✅ Real-time preview

### Nhược điểm:
- ❌ Performance không tốt bằng native
- ❌ Cần render lại mỗi lần thay đổi

## Giải pháp 4: SVG Frame với react-native-svg

### Cách hoạt động:
- Frame được định nghĩa bằng SVG
- Overlay SVG lên ảnh

### Ưu điểm:
- ✅ Vector graphics - scalable
- ✅ Có thể animate
- ✅ File size nhỏ

### Nhược điểm:
- ❌ Phức tạp hơn PNG
- ❌ Cần design SVG frames

## Recommended Approach cho Photobooth App

### Cho 4 ảnh vertical layout:

**Option A: Simple Overlay (Recommended cho MVP)**
```tsx
// Mỗi ảnh có frame riêng
<View style={{ position: 'relative', height: photoHeight }}>
  <Image source={{ uri: photoUrl }} style={{ width: '100%', height: '100%' }} />
  {selectedFrame && (
    <Image 
      source={{ uri: frameUrl }} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        zIndex: 1 
      }} 
    />
  )}
</View>
```

**Option B: Combined Frame (Cho 4 ảnh trong 1 frame)**
```tsx
// 1 frame lớn bao quanh 4 ảnh
<View style={{ position: 'relative' }}>
  {/* 4 photos container */}
  <View style={{ flexDirection: 'column' }}>
    {photos.map(photo => (
      <Image key={photo.id} source={{ uri: photo.imageUrl }} />
    ))}
  </View>
  
  {/* Frame overlay */}
  {selectedFrame && (
    <Image 
      source={{ uri: frameUrl }} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        zIndex: 1 
      }} 
    />
  )}
</View>
```

## Frame Design Guidelines

### Frame Structure:
1. **Border Frame**: Frame chỉ có border, center transparent
2. **Decorative Frame**: Frame có decoration, patterns, text areas
3. **Template Frame**: Frame có layout sẵn cho 4 ảnh (photobooth style)

### Frame Dimensions:
- Frame phải match với photo dimensions
- Hoặc frame có thể scale để fit
- Recommended: Frame size = Photo size + padding

### Frame File Format:
- PNG với alpha channel (transparency)
- Resolution: 2x hoặc 3x cho retina displays
- File size: Optimize để giảm load time

## Implementation Steps

1. **Design Frames**: Tạo frame templates với transparent areas
2. **Store Frames**: Lưu frames trên server/CDN
3. **Fetch Frames**: Call API để lấy danh sách frames
4. **Display Preview**: Overlay frame lên preview
5. **Apply Frame**: Khi user chọn, apply frame lên final image
6. **Save/Share**: Export ảnh đã có frame

## Libraries to Consider

1. **react-native-image-manipulator**: Image composition
2. **react-native-view-shot**: Capture view as image
3. **react-native-svg**: SVG frame support
4. **react-native-fast-image**: Better image loading performance

## Next Steps

1. Tạo API endpoint để fetch frames (`/assets/frames`)
2. Design frame templates với transparent areas
3. Implement overlay logic trong SessionDetail
4. Add frame selection UI
5. Implement save/export functionality

