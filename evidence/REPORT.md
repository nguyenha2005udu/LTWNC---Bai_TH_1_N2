# Kết quả kiểm tra — 13/10/2026

## Phạm vi đo

Bản ban đầu chưa có ô tìm kiếm, nên baseline **được tái dựng** trong `benchmarks/main.tsx`: render đủ 10.000 thẻ, lọc ngay mỗi phím và handler mới mỗi render. Bản tối ưu dùng chính `AssignmentList`/`AssignmentCard` của ứng dụng, memo, debounce 300 ms và react-window. Cả hai dùng cùng dữ liệu, CSS và trình duyệt. Đây là benchmark của danh sách, không phải điểm Lighthouse của toàn bộ màn hình ứng dụng có form và Redux middleware.

Render đo trên Vite development, Chrome desktop 1365×900, không StrictMode, gõ `React` với khoảng cách 100 ms/phím, chờ thêm 500 ms. Số lần render đếm ngay trong thân `AssignmentCard`; thời gian commit lấy từ React `<Profiler>` API. **Chưa chạy giao diện React DevTools Profiler**; không coi dữ liệu API này là bản xuất từ extension. Có thể xác nhận lại thủ công theo hướng dẫn bên dưới.

Lighthouse đo bản build production riêng của benchmark, preset mobile mặc định (throttling mô phỏng), mỗi mode một lần. Không chạy song song hai lượt Lighthouse. Kết quả có thể dao động theo máy/tải hệ thống.

| Chỉ số | Trước (baseline tái dựng) | Sau |
| --- | ---: | ---: |
| Thẻ được mount ban đầu | 10.000 | 6 |
| Lượt chạy thân AssignmentCard khi gõ `React` | 16.665 | 4 |
| Tổng actualDuration của list commits khi tìm kiếm | 462,4 ms | 5,1 ms |
| AssignmentCard render thêm khi đổi theme | 0 | 0 |
| List commits khi đổi theme | 0 | 0 |
| Lighthouse Performance | 70/100 | 100/100 |
| Largest Contentful Paint | 2,0 s | 1,4 s |
| Total Blocking Time | 2.010 ms | 10 ms |

Baseline có 5 commit khi gõ; bản tối ưu có 6 commit nhỏ (5 lần cập nhật input và 1 lần debounce), nhưng chỉ 4 card render. Hai thẻ đang hiện đã có cùng dữ liệu/properties nên memo bỏ qua; các thẻ còn lại được thay khi kết quả lọc đổi.

## Minh chứng

- [Dữ liệu render/Profiler API](render-results.json).
- [Lighthouse baseline HTML](lighthouse-baseline.report.html), [JSON](lighthouse-baseline.report.json).
- [Lighthouse tối ưu HTML](lighthouse-optimized.report.html), [JSON](lighthouse-optimized.report.json).
- [Ảnh Console Chrome DevTools](redux-console.png): có `addDeadline/fulfilled`, `toggleDeadline`, `deleteDeadline`, cùng prev/action/next state. Dùng API mock trong Playwright để phép chụp không phụ thuộc json-server.
- [Log console gốc](redux-console.json).
- [Ứng dụng với dữ liệu stress](app.png), [baseline](baseline-list.png), [tối ưu](optimized-list.png).

## Cách tái lập

```bash
# Terminal 1: dev server cho số lần render và minh chứng console
npm run dev -- --host 127.0.0.1
# Terminal 2
npm run bench:renders
npm run test:browser
npm run evidence:console

# Production benchmark cho Lighthouse
npm run bench:build
npm run bench:preview
# Terminal khác; đặt CHROME_PATH nếu Lighthouse không tự tìm thấy Chrome
npx lighthouse 'http://127.0.0.1:4173/?mode=baseline' --chrome-flags='--headless --no-sandbox' --only-categories=performance --output=json --output=html --output-path=evidence/lighthouse-baseline
npx lighthouse 'http://127.0.0.1:4173/?mode=optimized' --chrome-flags='--headless --no-sandbox' --only-categories=performance --output=json --output=html --output-path=evidence/lighthouse-optimized
```

Để xác nhận bằng **React DevTools Profiler**: mở ứng dụng development, bấm tạo mẫu, mở Profiler, bật “Record why each component rendered”, bắt đầu ghi, đổi theme rồi dừng. Kiểm tra App/AssignmentList/AssignmentCard không có commit do theme. Ghi lượt riêng khi gõ tìm kiếm. StrictMode của ứng dụng có thể làm số lần gọi thân component khác benchmark không StrictMode; giữ cùng chế độ khi so sánh.

## Kiểm thử

`npm test`: **22/22 pass**, statements `features/` **93,79%**, threshold 70% trong `jest.config.ts` (thu thập toàn bộ file features, không loại bỏ file ít coverage). `npm run build` và `npm run lint` pass. Browser smoke pass tạo dữ liệu, giới hạn số DOM card, ghim lên đầu, tìm theo môn, theme không render card, tải trang thống kê và tổng số bài hoàn thành 2.500.
