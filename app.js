const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const sizeEl = document.getElementById('size');
const resetBtn = document.getElementById('reset');

let size = parseInt(sizeEl.value, 10) || 15;
let board = [];
let currentPlayer = 'X';
let gameOver = false;

function createBoard() {
  document.documentElement.style.setProperty('--size', size);
  board = Array.from({ length: size }, () => Array(size).fill(''));
  boardEl.innerHTML = '';
  gameOver = false;
  currentPlayer = 'X';
  statusEl.textContent = 'Lượt: ' + currentPlayer;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.addEventListener('click', onCellClick);
      boardEl.appendChild(cell);
    }
  }
}

function onCellClick(e) {
  if (gameOver) return;
  const cell = e.currentTarget;
  const r = parseInt(cell.dataset.r, 10);
  const c = parseInt(cell.dataset.c, 10);
  if (board[r][c]) return;
  board[r][c] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer);

  const result = checkWin(r, c, currentPlayer);
  if (result.win) {
    highlightWin(result.cells);
    statusEl.textContent = 'Thắng: ' + currentPlayer + '!';
    gameOver = true;
    return;
  }

  if (isBoardFull()) {
    statusEl.textContent = 'Hòa!';
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusEl.textContent = 'Lượt: ' + currentPlayer;
}

function isBoardFull() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!board[r][c]) return false;
    }
  }
  return true;
}

function highlightWin(cells) {
  for (const { r, c } of cells) {
    const idx = r * size + c;
    const cell = boardEl.children[idx];
    if (cell) cell.classList.add('win');
  }
}

function inBounds(r, c) {
  return r >= 0 && c >= 0 && r < size && c < size;
}

function checkDirection(sr, sc, dr, dc, player) {
  const cells = [{ r: sr, c: sc }];
  let count = 1;
  for (let k = 1; k < 5; k++) {
    const nr = sr + dr * k;
    const nc = sc + dc * k;
    if (!inBounds(nr, nc) || board[nr][nc] !== player) break;
    cells.push({ r: nr, c: nc });
    count++;
  }
  for (let k = 1; k < 5; k++) {
    const nr = sr - dr * k;
    const nc = sc - dc * k;
    if (!inBounds(nr, nc) || board[nr][nc] !== player) break;
    cells.unshift({ r: nr, c: nc });
    count++;
  }
  return { count, cells };
}

function checkWin(r, c, player) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  for (const [dr, dc] of directions) {
    const { count, cells } = checkDirection(r, c, dr, dc, player);
    if (count >= 5) {
      let best = cells;
      if (cells.length > 5) {
        let windowFound = false;
        for (let i = 0; i + 4 < cells.length; i++) {
          const window = cells.slice(i, i + 5);
          if (window.some(p => p.r === r && p.c === c)) {
            best = window;
            windowFound = true;
            break;
          }
        }
        if (!windowFound) best = cells.slice(0, 5);
      }
      return { win: true, cells: best };
    }
  }
  return { win: false, cells: [] };
}

sizeEl.addEventListener('change', () => {
  size = parseInt(sizeEl.value, 10) || 15;
  createBoard();
});
resetBtn.addEventListener('click', createBoard);

createBoard();


