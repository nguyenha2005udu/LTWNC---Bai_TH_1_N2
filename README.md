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

## Nâng cấp state, hiệu năng và kiểm thử

- Ghim bài tập bằng `usePinStore` (Zustand); thứ tự ghim được áp dụng trước bộ lọc. State ghim nằm trong bộ nhớ phiên, tách khỏi Redux.
- `ThemeContext` riêng, memo hóa value; chỉ nút đổi theme dùng Context. Provider nhận children ổn định nên đổi theme không render lại App/danh sách.
- `redux-logger` chỉ bật khi `import.meta.env.DEV`.
- Tìm kiếm theo môn/tên, debounce 300 ms và memo hóa lọc; `AssignmentCard` dùng `React.memo`, handler dùng `useCallback`.
- Danh sách dùng `react-window` 1.x với hàng cao 300 px, overscan 3 hàng. Nút tạo mẫu thay dữ liệu hiện tại bằng 10.000 bài tập trong bộ nhớ, không POST 10.000 lần.
- Trang Thống kê dùng `React.lazy`/`Suspense`, đếm hoàn thành, quá hạn và nhóm theo môn.
- Giữ tên `deadlineSlice` từ bài cũ; `AssignmentCard` và `AssignmentList` có alias tương thích `DeadlineCard`/`DeadlineList`.

```bash
npm test              # Jest + ts-jest + RTL, coverage features/ >= 70%
npm run lint
npm run build
```

Bộ test có 22 case: unit ngày/thống kê/reducer và biên, component card/form/filter, API mock loading/success/error, hook debounce với fake timers. Coverage statements `features/`: **93,79%**. Báo cáo HTML được tạo trong `coverage/lcov-report/`.

Xem [báo cáo hiệu năng và minh chứng](evidence/REPORT.md). Để chạy smoke test Chrome, khởi động `npm run dev` rồi `npm run test:browser`. Script mặc định dùng Chrome macOS; có thể đặt `CHROME_PATH` cho máy khác.
