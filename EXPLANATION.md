## Giải thích cú pháp, cấu trúc mã và flow hoạt động

Tài liệu này giải thích cách tổ chức mã và luồng xử lý của ứng dụng Caro (Gomoku) viết bằng HTML/CSS/JS thuần.

### 1) HTML – cấu trúc khung trang (`index.html`)

- Phần thân chứa các phần tử chính:
  - `div.wrapper`: bao toàn bộ nội dung để căn giữa và giới hạn chiều rộng.
  - `header`: tiêu đề và cụm điều khiển (chọn kích thước bàn cờ, nút chơi lại).
  - `div#status`: hiển thị trạng thái lượt đi và kết quả.
  - `div#board`: vùng bàn cờ, được dựng động bằng JS.
- Liên kết tài nguyên:
  - `<link rel="stylesheet" href="styles.css" />` để nạp CSS.
  - `<script src="app.js"></script>` để nạp JavaScript.

Mục tiêu: HTML giữ vai trò khung tĩnh; mọi phần lưới bàn cờ được JS tạo động để dễ reset/đổi kích thước.

### 2) CSS – trình bày và biến tùy biến (`styles.css`)

- Biến CSS:
  - `--size`: số ô trên mỗi chiều bàn cờ (ví dụ 15). JS cập nhật biến này để grid tự co giãn.
  - `--cell`: kích thước một ô (px). Có thể chỉnh để to/nhỏ hơn.
  - `--gap`: khoảng cách giữa các ô.
- Bố cục bàn cờ dùng CSS Grid:
  - `.board { display: grid; grid-template-columns: repeat(var(--size), var(--cell)); grid-auto-rows: var(--cell); }`
  - Nhờ vậy, khi thay `--size`, số cột thay đổi tương ứng.
- Trạng thái ô:
  - `.cell` là mỗi ô; thêm lớp `.X` hoặc `.O` để đổi màu theo người chơi.
  - `.cell.win` để highlight chuỗi 5 ô thắng cuộc.

Mục tiêu: tách riêng phần nhìn; JS chỉ thêm/xóa class, CSS lo màu sắc và hiệu ứng.

### 3) JavaScript – trạng thái và hành vi (`app.js`)

#### 3.1) Biến trạng thái chính

- `size`: kích thước bàn hiện tại (đọc từ `<select id="size">`).
- `board`: mảng 2 chiều `size x size` lưu giá trị "", "X", hoặc "O".
- `currentPlayer`: người chơi hiện tại, bắt đầu là `"X"`.
- `gameOver`: cờ kết thúc ván (đúng sau khi có thắng hoặc hòa).

#### 3.2) Khởi tạo và dựng bàn (`createBoard`)

Chức năng:
- Cập nhật biến CSS `--size` để lưới tự điều chỉnh.
- Tạo `board` mới chứa chuỗi rỗng.
- Xóa DOM cũ trong `#board` và tạo lại toàn bộ ô (`div.cell`) theo `size`.
- Gắn sự kiện click cho mỗi ô để xử lý nước đi.

Tác dụng: cho phép reset nhanh (nút "Chơi lại") và thay đổi kích thước tức thì (sự kiện `change` của `#size`).

#### 3.3) Xử lý click ô (`onCellClick`)

Luồng:
1. Bỏ qua nếu `gameOver` đã bật.
2. Lấy tọa độ `r, c` từ `data-*` của ô; nếu ô đã có giá trị thì bỏ qua (không ghi đè).
3. Ghi dấu người chơi hiện tại vào `board[r][c]`, cập nhật text và class của ô.
4. Gọi `checkWin(r, c, currentPlayer)`:
   - Nếu thắng: gọi `highlightWin(...)`, cập nhật `status`, đặt `gameOver = true`.
5. Nếu không thắng, kiểm tra `isBoardFull()`:
   - Nếu đầy: hiển thị hòa, đặt `gameOver = true`.
6. Nếu chưa kết thúc, đổi lượt: `currentPlayer = (X ↔ O)` và cập nhật `status`.

#### 3.4) Kiểm tra đầy bàn (`isBoardFull`)

Duyệt toàn bộ `board`; nếu còn ô rỗng trả về `false`, ngược lại `true`.

#### 3.5) Tô sáng đường thắng (`highlightWin`)

Nhận danh sách ô thắng `{r, c}`, quy đổi sang chỉ số một chiều `idx = r * size + c` để lấy phần tử DOM tương ứng trong `#board.children[idx]`, rồi thêm class `win`.

#### 3.6) Kiểm tra thắng (`checkWin` và `checkDirection`)

- Hướng kiểm tra: 4 hướng cơ bản, mỗi hướng bao trùm cả 2 chiều đối nghịch:
  - Ngang: `[0, 1]`
  - Dọc: `[1, 0]`
  - Chéo chính: `[1, 1]`
  - Chéo phụ: `[1, -1]`
- `checkDirection(sr, sc, dr, dc, player)` đếm liên tiếp từ ô vừa đánh `(sr, sc)`:
  - Tiến tới: `(sr + k*dr, sc + k*dc)` với `k = 1..4`.
  - Lùi lại: `(sr - k*dr, sc - k*dc)` với `k = 1..4`.
  - Chỉ tăng khi gặp đúng `player`, dừng khi chạm biên hoặc khác ký hiệu.
  - Trả về `{ count, cells }` với tổng số ô liên tiếp và danh sách tọa độ liên quan.
- `checkWin(r, c, player)` gọi lần lượt 4 hướng; nếu `count ≥ 5` thì thắng.
- Cắt cửa sổ 5 ô: nếu danh sách dài hơn 5, thuật toán trượt một cửa sổ 5 phần tử để chọn chuỗi chứa nước vừa đi, giúp highlight gọn đúng 5 ô.

Độ phức tạp: Mỗi lần đánh kiểm tra tối đa 4×(4+4) ô ≈ hằng số; tổng thể O(1) theo kích thước kiểm tra, O(N²) để đi hết ván.

#### 3.7) Gắn sự kiện giao diện

- `sizeEl.change`: cập nhật `size` rồi gọi `createBoard()` để dựng lại bàn.
- `resetBtn.click`: gọi `createBoard()` để bắt đầu ván mới cùng kích thước hiện tại.

### 4) Quy ước DOM và ánh xạ chỉ số

- Thứ tự thêm ô vào `#board` là duyệt hàng-then-cột, nên phần tử thứ `idx = r * size + c` khớp tọa độ `(r, c)`.
- Lợi ích: tra cứu DOM ô đang cần nhanh mà không phải giữ thêm map phụ.

### 5) Mở rộng và tùy biến

- Luật chặn hai đầu (Caro VN): mở rộng `checkDirection` để kiểm tra hai đầu có bị chặn bởi quân đối thủ không, chỉ công nhận thắng khi không bị chặn (hoặc theo biến thể mong muốn).
- Chế độ đấu máy (AI): sau `onCellClick` của người chơi, sinh nước đi cho máy dựa trên heuristic (ưu tiên chặn 4/3, tạo 4/3), minimax đơn giản với độ sâu nhỏ, hoặc MCTS nhẹ.
- Ghi lại lịch sử nước đi: lưu danh sách `{player, r, c}`; thêm UI hiển thị và khả năng undo/redo.
- Kích thước/ô: chỉnh `--size`, `--cell` trong CSS hoặc mở rộng UI cho phép tùy chọn thêm.

### 6) Lý do tách file

- Dễ bảo trì: thay đổi giao diện trong `styles.css` mà không đụng logic.
- Dễ đọc: `index.html` gọn, tập trung vào cấu trúc; `app.js` chứa logic rõ ràng.
- Dễ mở rộng: có thể thêm test hoặc bundler sau này mà không phải tách lại.


