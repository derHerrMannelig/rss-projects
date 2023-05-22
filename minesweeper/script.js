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
const settings = document.createElement('div');
settings.className = 'settings';
const buttonNovice = document.createElement('div');
buttonNovice.innerHTML = 'Novice (10x10)';
buttonNovice.onclick = () => {
};
const buttonAdept = document.createElement('div');
buttonAdept.innerHTML = 'Adept (15x15)';
buttonAdept.onclick = () => {
};
const buttonGodlike = document.createElement('div');
buttonGodlike.innerHTML = 'Godlike (25x25)';
buttonGodlike.onclick = () => {
};

const buttonBombs = document.createElement('div');
buttonBombs.className = 'settingsBombs';
const labelBombs = document.createElement('label');
labelBombs.for = 'minesQuantity';
labelBombs.innerHTML = 'Set mines:';
const inputBombs = document.createElement('input');
inputBombs.type = 'number';
inputBombs.id = 'minesQuantity';
inputBombs.name = 'minesQuantity';
inputBombs.min = 10;
inputBombs.max = 99;
inputBombs.value = 10;
buttonBombs.appendChild(labelBombs);
buttonBombs.appendChild(inputBombs);

settings.appendChild(buttonNovice);
settings.appendChild(buttonAdept);
settings.appendChild(buttonGodlike);

document.body.appendChild(header);
document.body.appendChild(settings);
document.body.appendChild(buttonBombs);
document.body.appendChild(newGame);
document.body.appendChild(board);

document.addEventListener('DOMContentLoaded', () => {
  const boardElement = document.querySelector('.board');

  const width = 10;

  const a = 0;
  const b = 9;
  const c = 10;
  const d = 11;

  const z = 99;
  const y = 90;
  const x = 89;
  const v = 88;

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
      if (targetId > a && !leftEdge) {
        const newId = cells[parseInt(targetId, 10) - 1].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (targetId > b && !rightEdge) {
        const newId = cells[parseInt(targetId, 10) + 1 - width].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (targetId > c) {
        const newId = cells[parseInt(targetId, 10) - width].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (targetId > d && !leftEdge) {
        const newId = cells[parseInt(targetId, 10) - 1 - width].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }

      if (targetId < z && !rightEdge) {
        const newId = cells[parseInt(targetId, 10) + 1].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (targetId < y && !leftEdge) {
        const newId = cells[parseInt(targetId, 10) - 1 + width].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (targetId < x) {
        const newId = cells[parseInt(targetId, 10) + width].id;
        const newCell = document.getElementById(newId);
        click(newCell);
      }
      if (targetId < v && !rightEdge) {
        const newId = cells[parseInt(targetId, 10) + 1 + width].id;
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
        if (i > a && !leftEdge && cells[i - 1].classList.contains('bomb')) near += 1;
        if (i > b && !rightEdge && cells[i + 1 - width].classList.contains('bomb')) near += 1;
        if (i > c && cells[i - width].classList.contains('bomb')) near += 1;
        if (i > d && !leftEdge && cells[i - 1 - width].classList.contains('bomb')) near += 1;

        if (i < z && !rightEdge && cells[i + 1].classList.contains('bomb')) near += 1;
        if (i < y && !leftEdge && cells[i - 1 + width].classList.contains('bomb')) near += 1;
        if (i < x && cells[i + width].classList.contains('bomb')) near += 1;
        if (i < v && !rightEdge && cells[i + 1 + width].classList.contains('bomb')) near += 1;
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
