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
  const bombs = 10;

  let sec = 0;

  const cells = [];
  let gameOverCheck = false;
  let counter = 0;

  function timer() {
    if (!gameOverCheck) {
      sec += 1;
      console.log(`time elapsed: ${sec} seconds`);
      setTimeout(timer, 1000);
    }
  }

  function click(cell) {
    const targetId = cell.id;
    if (gameOverCheck) return;
    if (cell.classList.contains('clicked') || cell.classList.contains('flag')) return;
    if (cell.classList.contains('bomb')) {
      gameOver();
      return;
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
    setTimeout(() => {
      const id = parseInt(targetId, 10);
      const row = Math.floor(id / width);
      const column = id % width;
      const startRow = Math.max(row - 1, 0);
      const endRow = Math.min(row + 1, width - 1);
      const startColumn = Math.max(column - 1, 0);
      const endColumn = Math.min(column + 1, width - 1);
      for (let i = startRow; i <= endRow; i += 1) {
        for (let j = startColumn; j <= endColumn; j += 1) {
          if (i === row && j === column) continue;
          const newId = i * width + j;
          const newCell = document.getElementById(newId);
          click(newCell);
        }
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
        if (!gameOverCheck) {
          playSound('click.wav');
        }
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
      const row = Math.floor(i / width);
      const column = i % width;
      const leftEdge = (column === 0);
      const rightEdge = (column === width - 1);
      if (cells[i].classList.contains('empty')) {
        if (column > 0 && cells[i - 1].classList.contains('bomb')) near += 1;
        if (column < width - 1 && cells[i + 1].classList.contains('bomb')) near += 1;
        if (row > 0) {
          if (!leftEdge && cells[i - 1 - width].classList.contains('bomb')) near += 1;
          if (cells[i - width].classList.contains('bomb')) near += 1;
          if (!rightEdge && cells[i + 1 - width].classList.contains('bomb')) near += 1;
        }
        if (row < width - 1) {
          if (!leftEdge && cells[i - 1 + width].classList.contains('bomb')) near += 1;
          if (cells[i + width].classList.contains('bomb')) near += 1;
          if (!rightEdge && cells[i + 1 + width].classList.contains('bomb')) near += 1;
        }
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
        playSound('flag.wav');
      } else {
        cell.classList.remove('flag');
        cell.innerHTML = '';
        playSound('flag.wav');
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
      setTimeout(() => {
        playSound('win.wav');
      }, 250);
      setTimeout(() => {
        alert(`Hooray! You found all mines in ${sec} seconds!`);
      }, 350);
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
    setTimeout(() => {
      playSound('lose.wav');
    }, 250);
    setTimeout(() => {
      alert('Game over. Try again');
    }, 350);
  }

  function playSound(sound) {
    const audio = new Audio(`./sfx/${sound}`);
    audio.play();
  }

  timer();
  populateBoard();
});
