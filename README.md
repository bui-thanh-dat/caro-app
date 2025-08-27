# Caro (Gomoku) – HTML/CSS/JS

Ứng dụng Caro chạy thuần trình duyệt, không cần server hay build.

## Cấu trúc

- `index.html`: Khung HTML, khai báo giao diện, liên kết `styles.css` và `app.js`.
- `styles.css`: Toàn bộ phần trình bày (màu sắc, layout, grid bàn cờ, hiệu ứng).
- `app.js`: Logic trò chơi (tạo bàn cờ, xử lý lượt đi, kiểm tra thắng/hòa, highlight).

## Chạy

Mở file `index.html` bằng trình duyệt (Chrome/Edge/Firefox). Trên Windows có thể:

```powershell
start index.html
```

## Cách hoạt động (tóm tắt)

- Bàn cờ là một grid CSS: `grid-template-columns: repeat(--size, --cell)`.
- JS giữ trạng thái trong mảng 2 chiều `board[size][size]` gồm "", "X", "O".
- Khi click một ô trống, ghi dấu người chơi hiện tại, cập nhật DOM và kiểm tra thắng.
- Thuật toán thắng: đếm liên tiếp 2 chiều theo 4 hướng [ngang, dọc, chéo chính, chéo phụ]. Nếu tổng >= 5 thì thắng; cắt ra đúng 5 ô gần nước vừa đi để highlight.
- Nút "Chơi lại" hoặc đổi kích thước sẽ gọi `createBoard()` để reset và dựng lại bàn.

## Tùy chỉnh nhanh

- Kích cỡ ô/bảng chỉnh trong `styles.css` qua biến CSS `--cell` và `--size`.
- Thêm luật chặn 2 đầu (Caro Việt): mở rộng hàm `checkWin` để xét chặn 2 phía.
- Thêm chế độ chơi với máy: sau khi người chơi đi, sinh nước đi O bằng heuristic/AI rồi gọi lại các hàm có sẵn.

## Ghi chú

- Mã thuần vanilla, không phụ thuộc thư viện ngoài.
- Có thể deploy tĩnh lên bất kỳ host tĩnh (GitHub Pages, Vercel static, Netlify, v.v.).


