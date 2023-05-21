const header = document.createElement('h1');
const board = document.createElement('div');
header.className = 'header';
header.textContent = 'Minesweeper';
board.className = 'board';
document.body.appendChild(header);
document.body.appendChild(board);

document.addEventListener('DOMContentLoaded', () => {
  const boardElement = document.querySelector('.board');
  const width = 10;
  const bombs = 10;
  const cells = [];

  function click(cell) {
    if (cell.classList.contains('bomb')) {
      alert('Game over!');
    } else {
      let near = cell.getAttribute('data');
      if (near !== '0') {
        cell.classList.add('clicked');
        cell.innerHTML = near;
        return;
      }
      cell.classList.add('clicked');
    }
  }

  function populateBoard() {
    const bombsArray = Array(bombs).fill('bomb');
    const emptyArray = Array(width * width - bombs).fill('empty');
    const joinedArray = emptyArray.concat(bombsArray);
    const boardArray = joinedArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i += 1) {
      const cell = document.createElement('div');
      cell.setAttribute('id', i);
      cell.className = 'cell';
      cell.classList.add(boardArray[i]);
      boardElement.appendChild(cell);
      cells.push(cell);
      cell.addEventListener('click', () => {
        click(cell);
      });
    }

    for (let i = 0; i < cells.length; i += 1) {
      // Logic for tiles with numbers, indicating adjacent mines.
      let near = 0;
      const leftEdge = (i % width === 0);
      const rightEdge = (i % width === width - 1);
      if (cells[i].classList.contains('empty')) {
        if (i > 0 && !leftEdge && cells[i - 1].classList.contains('bomb')) near += 1;
        if (i > 9 && !rightEdge && cells[i + 1 - width].classList.contains('bomb')) near += 1;
        if (i > 10 && cells[i - width].classList.contains('bomb')) near += 1;
        if (i > 11 && !leftEdge && cells[i - 1 - width].classList.contains('bomb')) near += 1;
        if (i < 98 && !rightEdge && cells[i + 1].classList.contains('bomb')) near += 1;
        if (i < 90 && !leftEdge && cells[i - 1 + width].classList.contains('bomb')) near += 1;
        if (i < 88 && !rightEdge && cells[i + 1 + width].classList.contains('bomb')) near += 1;
        if (i < 89 && cells[i + width].classList.contains('bomb')) near += 1;
        cells[i].setAttribute('data', near);
      }
    }
  }
  populateBoard();
});
