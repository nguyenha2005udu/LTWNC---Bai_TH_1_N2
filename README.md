# Student Deadline Tracker

Ứng dụng React + TypeScript giúp sinh viên quản lý deadline bài tập cá nhân.

## Chức năng

- Hiển thị danh sách bài tập gồm môn học, tên bài tập, hạn nộp, độ ưu tiên và trạng thái hoàn thành.
- Thêm bài tập mới qua form.
- Đánh dấu hoàn thành hoặc bỏ đánh dấu hoàn thành.
- Xóa bài tập.
- Lọc theo tất cả, chưa hoàn thành, quá hạn và đã hoàn thành.
- Hiển thị số ngày còn lại hoặc số ngày quá hạn cho từng bài tập.
- Tải dữ liệu mẫu ban đầu từ API giả lập bằng `json-server`.

## Nội dung kỹ thuật

- TypeScript nâng cao: generic custom hook, utility type `Omit`, type guard cho priority.
- React pattern: custom hook `useForm`, custom hook thống kê `useDeadlineStats`, HOC `withLoading`.
- Redux Toolkit + TypeScript: feature-based structure, typed Redux hooks, `createAsyncThunk`.

## Cách chạy

Chạy API giả lập:

```bash
npm run mock-api
```

Chạy app ở terminal khác:

```bash
npm run dev
```

Kiểm tra production build:

```bash
npm run build
```
