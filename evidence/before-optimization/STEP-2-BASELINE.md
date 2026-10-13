# Bước 2 — Đo trước khi tối ưu hiệu năng

## Điều kiện đo

- Dữ liệu: 10.000 bài tập mẫu, ID cố định, sinh bằng generateAssignments.
- Baseline tái dựng trong benchmarks/main.tsx: render toàn bộ danh sách, không React.memo cho card, handler tạo mới, lọc trực tiếp mỗi lần gõ, không debounce và không virtualization. Giữ giao diện thẻ hiện tại.
- Đây là trang benchmark riêng của danh sách, không phải toàn bộ màn hình ứng dụng và không phải mã gốc được lưu từ thời điểm trước khi tối ưu. Ứng dụng chính đã có tối ưu từ lượt làm trước.
- Đo render: React development, không StrictMode, Chrome desktop 1365 × 900. Gõ React, 100 ms/phím, chờ 500 ms sau khi gõ. Đếm ngay trong thân AssignmentCard, thời gian lấy từ React Profiler API.
- Lighthouse 13.5.0: bản build production benchmark, preset mobile/throttling mô phỏng mặc định, một lượt đo. Không chạy Lighthouse cùng lúc với phép đo render. Thời điểm đo: 14:18:08 13/10/2026 (giờ Việt Nam).

## Kết quả trước tối ưu

| Chỉ số | Kết quả |
| --- | ---: |
| Số bài tập | 10.000 |
| Số card mount ban đầu | 10.000 |
| AssignmentCard render khi gõ React | 16.665 |
| Số commit cập nhật danh sách | 5 |
| Tổng actualDuration các commit tìm kiếm | 467.7 ms |
| Lighthouse Performance | 75/100 |
| Largest Contentful Paint | 1.6 s |
| Total Blocking Time | 1,300 ms |

Từ ký tự đầu tiên R, bộ lọc trả về 3.333 bài thuộc môn React. Mỗi lần nhập một ký tự, cả 3.333 card được render lại; năm ký tự tạo tổng 3.333 × 5 = 16.665 lần render. Con số này không bao gồm mount ban đầu.

## Minh chứng

- [Dữ liệu render và Profiler API](render-results.json).
- [Ảnh baseline sau khi gõ tìm kiếm](baseline-list.png).
- [Báo cáo Lighthouse HTML](lighthouse-baseline.report.html).
- [Dữ liệu Lighthouse JSON](lighthouse-baseline.report.json).

Chưa ghi bằng giao diện React DevTools Profiler. Dữ liệu thời gian trong bảng lấy từ React Profiler API; không gọi đây là bản xuất từ DevTools.

## Cách tự thực hiện để viết báo cáo

1. Chạy npm run dev và mở http://127.0.0.1:5173/benchmarks/index.html?mode=baseline.
2. Mở React DevTools → Profiler, bắt đầu ghi, gõ React vào ô tìm kiếm rồi dừng. Chụp flamegraph/commit, giữ cùng chế độ StrictMode khi so sánh trước/sau.
3. Tái lập bộ đếm bằng lệnh bên dưới; số lần render không bao gồm mount ban đầu.
4. Chạy build/preview benchmark, đo Lighthouse trên bản production. Lưu báo cáo trước khi chuyển sang bước tối ưu.

```bash
BENCH_OUTPUT_DIR=evidence/before-optimization node benchmarks/measure.mjs baseline
npm run bench:build
npm run bench:preview
# Terminal khác:
npx lighthouse 'http://127.0.0.1:4173/?mode=baseline' --chrome-flags='--headless --no-sandbox' --only-categories=performance --output=json --output=html --output-path=evidence/before-optimization/lighthouse-baseline
```

## Đoạn mô tả cho báo cáo

Trước khi tối ưu hiệu năng, tôi sử dụng một baseline tái dựng với 10.000 bài tập, render toàn bộ danh sách và lọc ngay khi nhập tìm kiếm. Khi gõ từ khóa React, có 16.665 lần chạy thân AssignmentCard qua 5 lần cập nhật danh sách, cho thấy các card bị render lặp lại theo từng ký tự. Tổng actualDuration được React Profiler API ghi nhận là 467.7 ms. Lighthouse trên bản build production benchmark đạt 75/100 điểm Performance, với LCP 1.6 s và TBT 1,300 ms. Các số liệu được lưu làm mốc trước tối ưu; kết quả Lighthouse là một lượt đo và có thể dao động theo điều kiện chạy.
