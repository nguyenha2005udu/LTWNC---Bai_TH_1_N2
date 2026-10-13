# Bước 1 — Cải thiện giao diện ứng dụng

## Mục tiêu

Tổ chức giao diện quản lý bài tập rõ ràng, nhất quán và sử dụng được trên máy tính, máy tính bảng và điện thoại.

## Thay đổi đã thực hiện

1. Tách thanh điều hướng Danh sách/Thống kê, bổ sung trạng thái trang đang chọn và nút chuyển sáng/tối.
2. Sắp xếp phần tổng quan thành năm thẻ: tổng bài, chưa hoàn thành, quá hạn, hoàn thành và ưu tiên cao. Bổ sung vòng tiến độ theo tỷ lệ hoàn thành thực tế.
3. Bố cục hai cột trên desktop: form thêm bài bên trái, danh sách bên phải. Chuyển về một cột trên màn hình nhỏ; các ô nhập, bộ lọc và nút thao tác thích ứng theo chiều rộng.
4. Đồng bộ màu nền, chữ, đường viền và trạng thái bằng CSS custom properties cho cả hai theme.
5. Bổ sung ô tìm kiếm có nút xóa, bộ lọc có trạng thái chọn, nhãn số kết quả và kiểu hiển thị riêng cho bài ghim, quá hạn, đã hoàn thành.
6. Cải thiện thông báo tải/lỗi/rỗng, focus khi dùng bàn phím, nhãn truy cập và giảm chuyển động theo thiết lập hệ thống. Bài đã hoàn thành hiển thị “Đã hoàn tất bài tập” thay vì tiếp tục báo số ngày quá hạn.
7. Trang Thống kê có thanh tỷ lệ số bài theo môn học và trạng thái rỗng khi chưa có dữ liệu.

## Cách kiểm tra

- `npm run build`: kiểm tra TypeScript và build production.
- `npm test`: chạy bộ test bảo vệ chức năng hiện có.
- `npm run lint`: kiểm tra mã nguồn.
- Chạy `node benchmarks/ui-check.mjs` khi dev server đang mở tại `http://127.0.0.1:5173`. Script dùng dữ liệu mock cố định để chụp UI, kiểm tra chiều rộng 320, 390, 768 và 1440 px; xác nhận không tràn ngang hoặc tràn nội dung thẻ, không có lỗi JavaScript trong trình duyệt.

## Ảnh minh chứng

- [Desktop sáng](desktop-light.png).
- [Desktop tối](desktop-dark.png).
- [Mobile sáng](mobile-light.png).
- [Mobile tối 390 px](mobile-390-dark.png).
- [Trang Thống kê trên mobile](statistics-mobile.png).

## Đoạn mô tả có thể đưa vào báo cáo

Ở bước cải thiện giao diện, ứng dụng được tổ chức lại thành các khu vực điều hướng, tổng quan tiến độ, form nhập liệu và danh sách bài tập. Bố cục dùng CSS Grid và media queries để chuyển từ hai cột trên máy tính sang một cột trên điện thoại. Hệ màu được quản lý bằng CSS custom properties, bảo đảm tính nhất quán giữa chủ đề sáng và tối. Các trạng thái ghim, quá hạn, hoàn thành, đang tải, lỗi và không có dữ liệu được thể hiện rõ hơn. Giao diện đã được kiểm tra trên Chrome ở các kích thước màn hình khác nhau và kết hợp bộ test hiện có để bảo vệ chức năng.

Các số đo hiệu năng trước đó nằm trong `../REPORT.md`; chưa đo lại Lighthouse sau lần chỉnh UI này.
