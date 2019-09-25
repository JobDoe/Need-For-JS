const
	mute = document.querySelector('.mute'),
	score = document.querySelector('.score'),
	bestScore = document.querySelector('.bestScore'),
	game = document.querySelector('.game'),
	// start = document.querySelector('.start'),
	modes = document.querySelector('.modes'),
	easy = document.querySelector('.easy'),
	medium = document.querySelector('.medium'),
	hard = document.querySelector('.hard'),
	gameArea = document.querySelector('.gameArea'),
	car = document.createElement('div'),
	music = document.createElement('audio');

car.classList.add('car');

const keys = {
	'ArrowUp': false,
	'ArrowDown': false,
	'ArrowLeft': false,
	'ArrowRight': false
};

const settings = {
	controlSpeed: 3,
	volume: 0.1,
	start: false,
	score: 0,
	bestScore: 0,
	speed: 3,
	traffic: 3,
	x: 0,
	y: 0,
	maxX: 0,
	maxY: 0
};

music.setAttribute('src', './sounds/end.mp3');
music.setAttribute('autoplay', 'true');
music.loop = true;
music.volume = settings.volume;
game.appendChild(music);

// start.addEventListener('click', startGame);
easy.addEventListener('click', setDifficult);
medium.addEventListener('click', setDifficult);
hard.addEventListener('click', setDifficult);

mute.addEventListener('click', muteSound);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

function setDifficult() {
	if (this.classList.contains('easy')) {
		settings.speed = 3;
	}
	else if (this.classList.contains('medium')) {
		settings.speed = 6;
	}
	else if (this.classList.contains('hard')) {
		settings.speed = 12;
	}
	startGame();
}

function muteSound() {
	music.muted = !music.muted;
	mute.innerHTML = (music.muted) ? 'UNMUTE <br> SOUND' : 'MUTE <br> SOUND';
}

function getQuantityElements(heightElement) {
	return gameArea.clientHeight / heightElement + 1;
}

function startGame() {
	settings.bestScore = localStorage.getItem('bestScore') ? localStorage.getItem('bestScore') : 0;
	bestScore.innerHTML = `BEST SCORE <br> ${settings.bestScore}`;
	gameArea.innerHTML = '';

	// start.classList.add('hide');
	modes.classList.add('hide');

	for (let i = 0; i < getQuantityElements(100); ++i) {
		const roadLine = document.createElement('div');
		roadLine.classList.add('roadLine');
		roadLine.style.top = (i * 100) + 'px';
		roadLine.y = i * 100;
		gameArea.appendChild(roadLine);
	}

	for (let i = 0; i < getQuantityElements(100 * settings.traffic); ++i) {
		const enemy = document.createElement('div');
		enemy.classList.add('enemy');
		enemy.y = -100 * settings.traffic * (i + 1);
		enemy.style.top = enemy.y + 'px';
		enemy.style.left = Math.floor(Math.random() * (gameArea.clientWidth - 56)) + 'px';
		// разный трафик
		enemy.style.backgroundImage = `url(./images/enemy${Math.floor(Math.random() * 2) + 1}.png)`;
		gameArea.appendChild(enemy);
	}

	gameArea.appendChild(car);
	car.style.top = 'auto';
	car.style.bottom = '10px';
	car.style.left = gameArea.clientWidth / 2 - car.offsetWidth / 2;

	settings.start = true;
	settings.x = car.offsetLeft;
	settings.y = car.offsetTop;
	settings.maxX = gameArea.clientWidth - car.offsetWidth;
	settings.maxY = gameArea.clientHeight - car.offsetHeight;

	// music
	music.setAttribute('src', `./sounds/bg${Math.floor(Math.random() * 3) + 1}.mp3`);

	requestAnimationFrame(playGame);
}

function playGame() {
	if (settings.start) {
		settings.score += settings.speed;
		score.innerHTML = 'SCORE <br>' + settings.score;

		moveRoad();
		moveEnemy();
		
		if (keys.ArrowLeft && settings.x > 0) {
			settings.x -= settings.controlSpeed;
		}
		if (keys.ArrowRight && settings.x < settings.maxX) {
			settings.x += settings.controlSpeed;
		}
		if (keys.ArrowUp && settings.y > 0) {
			settings.y -= settings.controlSpeed;
		}
		if (keys.ArrowDown && settings.y < settings.maxY) {
			settings.y += settings.controlSpeed;
		}
		car.style.left = settings.x + 'px';
		car.style.top = settings.y + 'px';

		requestAnimationFrame(playGame);
	}
}

function startRun(event) {
	event.preventDefault();
	// если клавиша есть в keys, то меняем ее состояние, иначе мимо
	if (event.key in keys) {
		keys[event.key] = true;
	}
}

function stopRun(event) {
	event.preventDefault();
	// если клавиша есть в keys, то меняем ее состояние, иначе мимо
	if (event.key in keys) {
		keys[event.key] = false;
	}
}

function moveRoad() {
	let roadLines = document.querySelectorAll('.roadLine');
	roadLines.forEach(function(roadLine, i) {
		roadLine.y += settings.speed;
		roadLine.style.top = roadLine.y + 'px';
		if (roadLine.y > gameArea.clientHeight) {
			roadLine.y = -100;
		}
	});
}

function moveEnemy() {
	let enemies = document.querySelectorAll('.enemy');
	enemies.forEach(function(enemy) {
		let carRect = car.getBoundingClientRect();
		let enemyRect = enemy.getBoundingClientRect();

		if (
			carRect.top < enemyRect.bottom &&
			carRect.right > enemyRect.left &&
			carRect.left < enemyRect.right &&
			carRect.bottom > enemyRect.top
		) {
			gameOver();
		}

		enemy.y += settings.speed / 2;
		enemy.style.top = enemy.y + 'px';
		if (enemy.y > gameArea.clientHeight) {
			enemy.y = -100 * settings.traffic;
			enemy.style.left = Math.floor(Math.random() * (gameArea.clientWidth - 56)) + 'px';
			enemy.style.backgroundImage = `url(./images/enemy${Math.floor(Math.random() * 2) + 1}.png)`;
		}
	});
}

function gameOver() {
	settings.start = false;
	music.setAttribute('src', './sounds/end.mp3');
	// start.classList.remove('hide');
	// start.innerHTML = 'Начать заново!';
	modes.classList.remove('hide');

	if (settings.score > settings.bestScore) {
		settings.bestScore = settings.score;
		bestScore.innerHTML = `BEST SCORE <br> ${settings.score}`;
		alert(`Предыдущий рекордный счет - ${localStorage.getItem('bestScore')}\nНовый рекордный счет - ${settings.score}`);
		localStorage.setItem('bestScore', settings.score);
	}
	settings.score = 0;
	keys.ArrowUp = false;
	keys.ArrowDown = false;
	keys.ArrowLeft = false;
	keys.ArrowRight = false;
}
