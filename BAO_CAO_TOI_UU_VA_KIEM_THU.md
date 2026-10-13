# Báo cáo so sánh hiệu năng trước/sau tối ưu và 12 test case

**Ứng dụng:** Student Deadline Tracker — React + TypeScript.  
**Ngày lập báo cáo:** 13/10/2026.  
**Phạm vi:** yêu cầu 7 (đo lại và so sánh), yêu cầu 9 (12 test case đủ bốn loại), kèm kết quả coverage của yêu cầu 10.

## 1. Điều kiện và phương pháp đo

| Điều kiện | Thiết lập |
| --- | --- |
| Dữ liệu | Cùng 10.000 bài tập mẫu, ID và môn học cố định, sinh bằng generateAssignments |
| Baseline | Bản tái dựng riêng: render toàn bộ thẻ, không memo card, không debounce, không virtualization; lọc trực tiếp mỗi lần gõ, handler tạo mới |
| Sau tối ưu | Dùng AssignmentList/AssignmentCard của ứng dụng, React.memo, handler useCallback, useDebounce 300 ms, useMemo và react-window |
| Giao diện | Cùng phiên bản UI hiện tại cho hai mode benchmark |
| Đo render | Chrome desktop, viewport 1365 × 900, React development, không StrictMode |
| Thao tác tìm kiếm | Nhập React, khoảng cách 100 ms/ký tự, chờ thêm 500 ms sau khi gõ |
| Cách đếm | Bộ đếm trong thân AssignmentCard, reset sau mount ban đầu |
| Thời gian render | Tổng actualDuration các commit của React Profiler API, không phải tổng thời gian phản hồi người dùng |
| Lighthouse | 13.5.0, build production benchmark, preset mobile và throttling mô phỏng mặc định, mỗi mode một lượt |
| Thời điểm Lighthouse trước | 14:18:08 13/10/2026, giờ Việt Nam |
| Thời điểm Lighthouse sau | 14:27:35 13/10/2026, giờ Việt Nam |

**Giới hạn:** baseline là bản tái dựng vì ứng dụng chính đã được tối ưu từ lượt làm trước. Các điểm Lighthouse dưới đây thuộc trang benchmark danh sách, không phải toàn bộ màn hình ứng dụng có form và Redux middleware. Đã dùng React Profiler API, **chưa ghi qua giao diện React DevTools Profiler**. Mỗi mode Lighthouse chỉ đo một lần; điểm và thời gian có thể dao động theo tải máy. Kết quả là số liệu thực tế của các lượt này, không phải cam kết cho mọi thiết bị.

## 2. Bảng so sánh trước và sau tối ưu

| Chỉ số | Trước tối ưu | Sau tối ưu | Thay đổi |
| --- | ---: | ---: | --- |
| Số bài tập nguồn | 10.000 | 10.000 | Giữ nguyên |
| Card mount ban đầu | 10.000 | 6 | Giảm 99,94% |
| Lần chạy thân AssignmentCard khi gõ React | 16.665 | 4 | Giảm 99,98% |
| Commit cập nhật danh sách khi tìm kiếm | 5 | 6 | Thêm một commit khi debounce phát giá trị cuối |
| Tổng actualDuration các commit tìm kiếm | 467,7 ms | 6,5 ms | Giảm 98,61% |
| Card render thêm khi đổi theme | 0 | 0 | Không render card do theme |
| List commit thêm khi đổi theme | 0 | 0 | Không có commit do theme |
| Lighthouse Performance | 75/100 | 100/100 | Tăng 25 điểm |
| Largest Contentful Paint | 1,59 s | 1,37 s | Số đo tải nội dung lớn nhất |
| Total Blocking Time | 1.302 ms | 6 ms | Số đo thời gian chặn luồng chính |

### Nhận xét

Ở baseline, mỗi ký tự của React làm 3.333 thẻ kết quả render lại, tạo 3.333 × 5 = 16.665 lần render. Sau tối ưu, virtualization giới hạn các thẻ được mount trong vùng nhìn và overscan, memo bỏ qua các card có props không đổi, debounce chỉ cập nhật kết quả sau khi người dùng ngừng gõ 300 ms. Vì vậy số lần render card giảm còn 4.

Số commit của danh sách tăng từ 5 lên 6 không đồng nghĩa hiệu năng giảm: 5 commit cập nhật input không render lại card không đổi; commit cuối áp dụng kết quả debounce. Tổng actualDuration giảm từ 467,7 ms xuống 6,5 ms. Debounce có chủ đích trì hoãn kết quả 300 ms; số actualDuration không bao gồm khoảng chờ này.

React.lazy và Suspense được áp dụng cho trang Thống kê để tách tải mã trang. Benchmark này không đo riêng lợi ích của lazy loading, nên không quy toàn bộ mức cải thiện Lighthouse cho kỹ thuật đó.

## 3. Minh chứng và cách chạy lại

- [Render/Profiler trước tối ưu](evidence/before-optimization/render-results.json).
- [Render/Profiler sau tối ưu](evidence/after-optimization/render-results.json).
- [Ảnh danh sách trước tối ưu](evidence/before-optimization/baseline-list.png).
- [Ảnh danh sách sau tối ưu](evidence/after-optimization/optimized-list.png).
- [Lighthouse trước — HTML](evidence/before-optimization/lighthouse-baseline.report.html), [JSON](evidence/before-optimization/lighthouse-baseline.report.json).
- [Lighthouse sau — HTML](evidence/after-optimization/lighthouse-optimized.report.html), [JSON](evidence/after-optimization/lighthouse-optimized.report.json).

Chạy dev server trong terminal riêng, rồi dùng script đo render:

```bash
npm run dev -- --host 127.0.0.1
# Terminal khác:
BENCH_OUTPUT_DIR=evidence/before-optimization node benchmarks/measure.mjs baseline
BENCH_OUTPUT_DIR=evidence/after-optimization node benchmarks/measure.mjs optimized
```

Chạy Lighthouse trên build production benchmark; để các phép đo lần lượt, tránh chạy đồng thời:

```bash
npm run bench:build
npm run bench:preview
# Terminal khác, chạy từng lệnh và chờ hoàn tất:
npx lighthouse 'http://127.0.0.1:4173/?mode=baseline' --chrome-flags='--headless --no-sandbox' --only-categories=performance --output=json --output=html --output-path=evidence/before-optimization/lighthouse-baseline
npx lighthouse 'http://127.0.0.1:4173/?mode=optimized' --chrome-flags='--headless --no-sandbox' --only-categories=performance --output=json --output=html --output-path=evidence/after-optimization/lighthouse-optimized
```

Script đo render mặc định dùng Chrome macOS. Đặt CHROME_PATH nếu Chrome nằm ở đường dẫn khác.

## 4. Thiết kế 12 test case theo yêu cầu 9

Các test case dưới đây được đối chiếu với test tự động đã có trong `tests/app.test.tsx`. Một test case nghiệp vụ có thể chứa nhiều assertion hoặc được bảo vệ bởi nhiều test tự động. Vì vậy tài liệu có **12 test case**, còn bộ Jest thực tế có **22 test tự động**; không xóa các test bổ sung để giảm về đúng 12.

| Loại | Mã test case | Số lượng | Tối thiểu yêu cầu |
| --- | --- | ---: | ---: |
| Unit | TC01–TC05 | 5 | 5 |
| Component — RTL + userEvent | TC06–TC09 | 4 | 4 |
| Bất đồng bộ — API mock | TC10–TC11 | 2 | 2 |
| Hook — renderHook + fake timers | TC12 | 1 | 1 |
| **Tổng** | **TC01–TC12** | **12** | **12** |

### TC01 — Unit: tính số ngày còn lại bằng `calcDaysLeft`

- **Mục tiêu:** kiểm tra ngày hôm nay và hai phía của hạn nộp.
- **Tiền điều kiện:** dùng fake timers, cố định thời gian ở 12:00 ngày 13/10/2026 theo múi giờ cục bộ.
- **Thao tác:** gọi hàm lần lượt với `2026-10-13`, `2026-10-12`, `2026-10-15`.
- **Kết quả mong đợi:** lần lượt `0`, `-1`, `2`; bài đến hạn hôm nay không bị tính là trễ một ngày.
- **Test tự động đối chiếu:** `days left: today, past, future`.
- **Kết quả thực tế:** Pass.

### TC02 — Unit: xác định quá hạn bằng `isOverdue`

- **Mục tiêu:** tránh báo quá hạn cho bài đã hoàn thành hoặc đến hạn hôm nay.
- **Tiền điều kiện:** cố định ngày hiện tại là 14/10/2026.
- **Thao tác:** kiểm tra bài chưa xong có hạn 13/10; cùng bài đó nhưng đã xong; bài chưa xong có hạn 14/10.
- **Kết quả mong đợi:** lần lượt `true`, `false`, `false`.
- **Test tự động đối chiếu:** `overdue excludes completed and today`.
- **Kết quả thực tế:** Pass.

### TC03 — Unit: thống kê dữ liệu thường và danh sách rỗng bằng `calcStats`

- **Mục tiêu:** đếm đúng tổng số, hoàn thành, quá hạn và nhóm môn học; xử lý biên rỗng.
- **Tiền điều kiện:** ngày hiện tại 14/10/2026; hai bài môn React, cùng hạn 13/10, một bài đã hoàn thành.
- **Thao tác:** gọi `calcStats([])` và `calcStats([bàiChưaXong, bàiĐãXong])`.
- **Kết quả mong đợi:** danh sách rỗng trả `{ total: 0, completed: 0, overdue: 0, bySubject: {} }`; danh sách hai bài trả `{ total: 2, completed: 1, overdue: 1, bySubject: { React: 2 } }`.
- **Test tự động đối chiếu:** `empty stats`, `stats groups subjects and counts`.
- **Kết quả thực tế:** Pass.

### TC04 — Unit: reducer bật/tắt hoàn thành và ID không tồn tại

- **Mục tiêu:** bảo vệ cập nhật trạng thái hoàn thành và trường hợp biên.
- **Tiền điều kiện:** state chứa bài ID `1`, `completed: false`.
- **Thao tác:** dispatch `toggleDeadline('missing')`; sau đó dispatch `toggleDeadline('1')` hai lần.
- **Kết quả mong đợi:** ID không tồn tại không làm thay đổi dữ liệu; hai lần toggle lần lượt cho `true` rồi `false`.
- **Test tự động đối chiếu:** `reducer toggle twice and unknown id`.
- **Kết quả thực tế:** Pass.

### TC05 — Unit: reducer thêm/xóa bài và phản hồi thêm thất bại

- **Mục tiêu:** bảo vệ thêm/xóa và lỗi API ở mức reducer.
- **Tiền điều kiện:** reducer mặc định hoặc state có một bài ID `1`.
- **Thao tác:** truyền action `addDeadline.fulfilled` với bài mẫu; truyền `addDeadline.rejected` có lỗi `failed`; xóa ID không tồn tại và xóa ID `1`.
- **Kết quả mong đợi:** fulfilled thêm đúng bài; rejected đặt `error` bằng `failed`; xóa ID lạ giữ nguyên danh sách; xóa ID hợp lệ loại bỏ đúng bài.
- **Test tự động đối chiếu:** `add success and failure reducer`, `delete unknown and existing`.
- **Kết quả thực tế:** Pass.

> Repository giữ tên `deadlineSlice` từ bài thực hành cũ. Đây là reducer quản lý assignments theo yêu cầu; các action hiện có tên `addDeadline`, `toggleDeadline`, `deleteDeadline`.

### TC06 — Component: `AssignmentCard` hiển thị dữ liệu và gọi hoàn thành

- **Mục tiêu:** kiểm tra nội dung thẻ và tương tác hoàn thành bằng RTL + userEvent.
- **Tiền điều kiện:** render bài ID `1`, tên `React test`, môn `React`, cùng callback mock `onToggle` và `onDelete`.
- **Thao tác:** tìm tên/môn bằng `screen`; dùng `userEvent` bấm `Hoàn thành` và `Xóa`.
- **Kết quả mong đợi:** tên và môn xuất hiện; `onToggle` và `onDelete` nhận chính xác ID `1`. Component chỉ gọi callback; cập nhật Redux được kiểm thử riêng ở unit test reducer.
- **Test tự động đối chiếu:** `card displays title and subject`, `card complete and delete callbacks`.
- **Kết quả thực tế:** Pass.

### TC07 — Component: ghim và bỏ ghim `AssignmentCard`

- **Mục tiêu:** kiểm tra tương tác thẻ với Zustand.
- **Tiền điều kiện:** reset `usePinStore` về `pinnedIds: []`, render bài ID `1`.
- **Thao tác:** dùng `userEvent` bấm `Ghim`; sau đó bấm `Bỏ ghim`.
- **Kết quả mong đợi:** `isPinned('1')` lần lượt trả `true`, `false`; nhãn nút phản ánh trạng thái ghim.
- **Test tự động đối chiếu:** `card pin toggles Zustand state`.
- **Kết quả thực tế:** Pass.

### TC08 — Component: form validate dữ liệu thiếu hoặc chỉ có khoảng trắng

- **Mục tiêu:** bảo đảm dữ liệu không hợp lệ không được submit.
- **Tiền điều kiện:** render `DeadlineForm` với `onSubmit` mock.
- **Thao tác:** dùng `userEvent.type` nhập ba khoảng trắng vào môn học, để trống các trường còn lại; dùng `fireEvent.submit` gửi form để kiểm tra logic validate bên trong, độc lập với HTML `required`.
- **Kết quả mong đợi:** hiển thị thông báo yêu cầu nhập đủ môn, tên bài và hạn nộp; `onSubmit` không được gọi.
- **Test tự động đối chiếu:** `form rejects whitespace`.
- **Kết quả thực tế:** Pass.

### TC09 — Component: form submit hợp lệ, trim và reset

- **Mục tiêu:** kiểm tra payload và kết quả sau submit thành công.
- **Tiền điều kiện:** `onSubmit` mock trả Promise thành công.
- **Thao tác:** dùng `userEvent` nhập môn `React`, tên `  Hooks  `; dùng `fireEvent.change` đặt input date thành `2026-12-31`; giữ ưu tiên `medium`; bấm `Thêm bài tập` bằng userEvent và chờ reset bằng `waitFor`.
- **Kết quả mong đợi:** callback nhận `{ subject: 'React', title: 'Hooks', deadline: '2026-12-31', priority: 'medium' }`; ô môn học trở về rỗng sau thành công.
- **Test tự động đối chiếu:** `form submits trimmed data and resets`.
- **Kết quả thực tế:** Pass.

### TC10 — Bất đồng bộ: danh sách đang tải rồi hiển thị thành công

- **Mục tiêu:** bảo vệ hai trạng thái loading và success với API mock.
- **Tiền điều kiện:** render `AssignmentListContainer` trong Redux Provider; mock `fetch` bằng Promise có thể chủ động resolve.
- **Thao tác:** giữ Promise chưa hoàn tất để kiểm tra trạng thái tải; sau đó resolve response `{ ok: true, json: async () => [bàiMẫu] }` bên trong `act`; chờ thẻ bằng `findByText`.
- **Kết quả mong đợi:** trước khi API hoàn tất có `Đang tải`; sau khi hoàn tất có bài `React test`.
- **Test tự động đối chiếu:** `API list loading then success`.
- **Kết quả thực tế:** Pass.

### TC11 — Bất đồng bộ: danh sách hiển thị lỗi API

- **Mục tiêu:** bảo vệ trạng thái lỗi khi API trả response không thành công.
- **Tiền điều kiện:** mock `fetch` resolve `{ ok: false }`.
- **Thao tác:** render container trong Redux Provider; chờ phần tử `role="alert"` bằng `findByRole`.
- **Kết quả mong đợi:** thông báo lỗi có nội dung `Không thể tải`; không coi response lỗi là dữ liệu thành công.
- **Test tự động đối chiếu:** `API list displays error`.
- **Kết quả thực tế:** Pass.

### TC12 — Hook: `useDebounce` trì hoãn 300 ms và hủy timer cũ

- **Mục tiêu:** kiểm tra debounce bằng `renderHook`, `act` và fake timers.
- **Tiền điều kiện:** bật `jest.useFakeTimers()`; giá trị ban đầu `a`.
- **Thao tác:** rerender với `ab`, tiến 200 ms; rerender với `abc`, tiến 299 ms; tiến thêm 1 ms; unmount.
- **Kết quả mong đợi:** sau 299 ms tính từ lần đổi cuối, kết quả vẫn là `a`; đủ 300 ms đổi thành `abc`, không phát ra giá trị trung gian `ab`; sau unmount không còn timer.
- **Test tự động đối chiếu:** `debounce cancels previous timer and updates at 300ms`.
- **Kết quả thực tế:** Pass.

## 5. Kết quả chạy test và coverage

Lệnh thực thi:

```bash
npm test
```

- Jest + ts-jest + React Testing Library + userEvent, môi trường jsdom.
- Test suites: **1 passed / 1 total**.
- Test tự động: **22 passed / 22 total**.
- Statements `features/`: **93,79%**.
- Branches `features/`: **84,74%**.
- Functions `features/`: **84,09%**.
- Lines `features/`: **94,53%**.
- `coverageThreshold` cho statements của `./src/features/` là **70%** trong `jest.config.ts`; toàn bộ file features được thu thập coverage, không loại bỏ file để tăng tỷ lệ.

Phần mã test nằm tại [tests/app.test.tsx](tests/app.test.tsx), cấu hình tại [jest.config.ts](jest.config.ts). Báo cáo này mô tả 12 test case cốt lõi đáp ứng yêu cầu 9; những test tự động bổ sung tiếp tục bảo vệ API POST, lỗi form, bộ lọc, dữ liệu stress, danh sách rỗng và trang Thống kê.
