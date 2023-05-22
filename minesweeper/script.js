const header = document.createElement('h1');
const board = document.createElement('div');
const newGame = document.createElement('button');
newGame.className = 'newgame';
newGame.innerHTML = 'Restart!';
newGame.onclick = () => {
  window.location.reload();
};
header.className = 'header';
header.textContent = 'Minesweeper';
board.className = 'board';
document.body.appendChild(header);
document.body.appendChild(newGame);
document.body.appendChild(board);

document.addEventListener('DOMContentLoaded', () => {
  const boardElement = document.querySelector('.board');
  const width = 10;
  const bombs = 10;
  const cells = [];
  let gameOverCheck = false;
  let counter = 0;

  function click(cell) {
    const targetId = cell.id;
    if (gameOverCheck) return;
    if (cell.classList.contains('clicked') || cell.classList.contains('flag')) return;
    if (cell.classList.contains('bomb')) {
      gameOver();
    } else {
      const near = cell.getAttribute('data');
      if (near !== '0') {
        cell.classList.add('clicked');
        cell.innerHTML = near;
        counter += 1;
        console.log(counter);
        youWin();
        return;
      }
      checkCell(cell, targetId);
    }
    cell.classList.add('clicked');
    counter += 1;
    console.log(counter);
    youWin();
  }

  function checkCell(cell, targetId) {
    const leftEdge = (targetId % width === 0);
    const rightEdge = (targetId % width === width - 1);

    setTimeout(() => {
      if (targetId > 0 && !leftEdge) {
        const newId = cells[parseInt(targetId, 10) - 1].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (targetId > 9 && !rightEdge) {
        const newId = cells[parseInt(targetId, 10) + 1 - width].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (targetId > 10) {
        const newId = cells[parseInt(targetId, 10) - width].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (targetId > 11 && !leftEdge) {
        const newId = cells[parseInt(targetId, 10) - 1 - width].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (targetId < 99 && !rightEdge) {
        const newId = cells[parseInt(targetId, 10) + 1].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (targetId < 90 && !leftEdge) {
        const newId = cells[parseInt(targetId, 10) - 1 + width].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (targetId < 88 && !rightEdge) {
        const newId = cells[parseInt(targetId, 10) + 1 + width].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (targetId < 89) {
        const newId = cells[parseInt(targetId, 10) + width].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
    }, 10);
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
      cell.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        addFlag(cell);
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

        if (i < 99 && !rightEdge && cells[i + 1].classList.contains('bomb')) near += 1;
        if (i < 90 && !leftEdge && cells[i - 1 + width].classList.contains('bomb')) near += 1;
        if (i < 89 && cells[i + width].classList.contains('bomb')) near += 1;
        if (i < 88 && !rightEdge && cells[i + 1 + width].classList.contains('bomb')) near += 1;
        cells[i].setAttribute('data', near);
      }
    }
  }

  function addFlag(cell) {
    if (gameOverCheck) return;
    if (!cell.classList.contains('clicked')) {
      if (!cell.classList.contains('flag')) {
        cell.classList.add('flag');
        cell.innerHTML = '&#128681';
      } else {
        cell.classList.remove('flag');
        cell.innerHTML = '';
      }
    }
  }

  function youWin() {
    if (counter >= width * width - bombs) {
      gameOverCheck = true;
      cells.forEach((cell) => {
        if (cell.classList.contains('bomb')) {
          cell.classList.add('defused');
          cell.innerHTML = '&#128681';
        }
      });
      alert('Hooray! You found all mines!');
    }
  }

  function gameOver() {
    gameOverCheck = true;
    cells.forEach((cell) => {
      if (cell.classList.contains('bomb')) {
        cell.classList.add('exploded');
        cell.innerHTML = '&#128163';
      }
    });
    alert('Game over. Try again');
  }

  populateBoard();
});
