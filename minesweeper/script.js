document.body.classList.add('bright');
let mute = false;

const header = document.createElement('h1');
const settings = document.createElement('div');
const board = document.createElement('div');

const themeSwitch = document.createElement('button');
themeSwitch.className = 'theme';
themeSwitch.innerHTML = '&#127769';
themeSwitch.onclick = () => {
  if (document.body.classList.contains('bright')) {
    document.body.classList.remove('bright');
    document.body.classList.add('dark');
    themeSwitch.innerHTML = '&#127769;';
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark');
    document.body.classList.add('bright');
    themeSwitch.innerHTML = '&#127774;';
    localStorage.setItem('theme', 'bright');
  }
};

const newGame = document.createElement('button');
newGame.className = 'newgame';
newGame.innerHTML = 'Restart &circlearrowleft;';
newGame.onclick = () => {
  window.location.reload();
};

const toggleSound = document.createElement('button');
toggleSound.className = 'sound';
toggleSound.innerHTML = '&#128266';
toggleSound.onclick = () => {
  mute = !mute;
  if (mute) {
    toggleSound.innerHTML = '&#128263;';
  } else {
    toggleSound.innerHTML = '&#128266;';
  }
  localStorage.setItem('isMuted', mute.toString());
};

header.className = 'header';
header.textContent = 'Minesweeper';
settings.className = 'settings';
board.className = 'board';

settings.appendChild(themeSwitch);
settings.appendChild(newGame);
settings.appendChild(toggleSound);

document.body.appendChild(header);
document.body.appendChild(settings);
document.body.appendChild(board);

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.remove('bright');
    document.body.classList.add('dark');
    themeSwitch.innerHTML = '&#127769;';
  } else {
    document.body.classList.remove('dark');
    document.body.classList.add('bright');
    themeSwitch.innerHTML = '&#127774;';
  }

  const savedSound = localStorage.getItem('isMuted');
  if (savedSound) {
    mute = savedSound === 'true';
    if (mute) {
      toggleSound.innerHTML = '&#128263;';
    } else {
      toggleSound.innerHTML = '&#128266;';
    }
  }

  const stats = document.createElement('div');
  stats.className = 'stats';

  const clock = document.createElement('div');
  const flags = document.createElement('div');
  const mines = document.createElement('div');
  const moves = document.createElement('div');

  clock.className = 'clock';
  flags.className = 'flags';
  mines.className = 'mines';
  moves.className = 'moves';

  clock.innerHTML = '&#128337: 0';
  flags.innerHTML = '&#128681: 0';
  mines.innerHTML = '&#128163: 0';
  moves.innerHTML = '&#127922: 0';

  stats.appendChild(clock);
  stats.appendChild(flags);
  stats.appendChild(mines);
  stats.appendChild(moves);

  const stance = document.createElement('div');
  stance.className = 'stance';
  stance.innerHTML = 'Mode: &#128070';

  stance.addEventListener('click', () => {
    document.body.classList.toggle('rb');
    if (document.body.classList.contains('rb')) {
      stance.innerHTML = 'Mode: &#128681';
    } else {
      stance.innerHTML = 'Mode: &#128070';
    }
  });

  document.body.appendChild(stats);
  document.body.appendChild(stance);

  const boardElement = document.querySelector('.board');

  const width = 10;
  const bombs = 10;

  mines.innerHTML = `&#128163: ${bombs}`;

  let sec = 0;
  let turn = 0;
  let flag = 0;

  const cells = [];
  let gameOverCheck = false;
  let counter = 0;

  function timer() {
    if (!gameOverCheck) {
      sec += 1;
      clock.innerHTML = `&#128337: ${sec}`;
      setTimeout(timer, 1000);
    }
  }
  function click(cell) {
    const targetId = cell.id;
    if (gameOverCheck) return;
    if (document.body.classList.contains('rb')) {
      addFlag(cell);
    } else {
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
          youWin();
          return;
        }
        checkCell(cell, targetId);
      }
      cell.classList.add('clicked');
      counter += 1;
      youWin();
    }
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
        if (!cell.classList.contains('clicked') && !cell.classList.contains('flag') && !gameOverCheck) {
          playSound('click.wav');
          turn += 1;
          moves.innerHTML = `&#127922: ${turn}`;
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
        flag += 1;
      } else {
        cell.classList.remove('flag');
        cell.innerHTML = '';
        playSound('flag.wav');
        flag -= 1;
      }
      flags.innerHTML = `&#128681: ${flag}`;
    }
  }

  function youWin() {
    if (counter >= width * width - bombs) {
      gameOverCheck = true;
      cells.forEach((cell) => {
        if (cell.classList.contains('bomb')) {
          cell.classList.add('defused');
          cell.innerHTML = '&#128681';
          flags.innerHTML = '&#128681: 10';
        }
      });
      setTimeout(() => {
        playSound('win.wav');
      }, 250);
      setTimeout(() => {
        alert(`Hooray! You found all mines in ${sec} seconds and ${turn} moves!`);
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
    if (!mute) {
      const audio = new Audio(`./sfx/${sound}`);
      audio.play();
    }
  }

  timer();
  populateBoard();
});
