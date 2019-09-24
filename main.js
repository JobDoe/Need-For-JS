const
	score = document.querySelector('.score'),
	start = document.querySelector('.start'),
	gameArea = document.querySelector('.gameArea'),
	car = document.createElement('div');

car.classList.add('car');

const keys = {
	'ArrowUp': false,
	'ArrowDown': false,
	'ArrowLeft': false,
	'ArrowRight': false
};

const settings = {
	start: false,
	score: 0,
	speed: 3,
	traffic: 3,
	x: 0,
	y: 0,
	maxX: 0,
	maxY: 0
};

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

function getQuantityElements(heightElement) {
	return document.documentElement.clientHeight / heightElement + 1;
}

function startGame() {
	start.classList.add('hide');

	for (let i = 0; i < getQuantityElements(100); ++i) {
		const roadLine = document.createElement('div');
		roadLine.classList.add('roadLine');
		roadLine.style.top = (i * 100) + 'px';
		roadLine.y = i * 100;
		gameArea.appendChild(roadLine);
	}
	gameArea.appendChild(car);

	for (let i = 0; i < getQuantityElements(100 * settings.traffic); ++i) {
		const enemy = document.createElement('div');
		enemy.classList.add('enemy');
		enemy.y = -100 * settings.traffic * (i + 1);
		enemy.style.top = enemy.y + 'px';
		enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 56)) + 'px';
		gameArea.appendChild(enemy);
	}

	settings.start = true;
	settings.x = car.offsetLeft;
	settings.y = car.offsetTop;
	settings.maxX = gameArea.offsetWidth - car.offsetWidth;
	settings.maxY = gameArea.offsetHeight - car.offsetHeight;
	requestAnimationFrame(playGame);
}

function playGame() {
	console.log('Play Game!');
	if (settings.start) {
		moveRoad();
		moveEnemy();
		if (keys.ArrowLeft && settings.x > 0) {
			settings.x -= settings.speed;
		}
		if (keys.ArrowRight && settings.x < settings.maxX) {
			settings.x += settings.speed;
		}
		if (keys.ArrowUp && settings.y > 0) {
			settings.y -= settings.speed;
		}
		if (keys.ArrowDown && settings.y < settings.maxY) {
			settings.y += settings.speed;
		}
		car.style.left = settings.x + 'px';
		car.style.top = settings.y + 'px';

		requestAnimationFrame(playGame);
	}
}

function startRun(event) {
	event.preventDefault();
	keys[event.key] = true;
}

function stopRun(event) {
	event.preventDefault();
	keys[event.key] = false;
}

function moveRoad() {
	let roadLines = document.querySelectorAll('.roadLine');
	roadLines.forEach(function(roadLine, i) {
		roadLine.y += settings.speed;
		roadLine.style.top = roadLine.y + 'px';
		if (roadLine.y > document.documentElement.clientHeight) {
			roadLine.y = -100;
		}
	});
}

function moveEnemy() {
	let enemies = document.querySelectorAll('.enemy');
	enemies.forEach(function(enemy) {
		enemy.y += settings.speed / 2;
		enemy.style.top = enemy.y + 'px';
		if (enemy.y > document.documentElement.clientHeight) {
			enemy.y = -100 * settings.traffic;
			enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 56)) + 'px';
		}
	});
}
