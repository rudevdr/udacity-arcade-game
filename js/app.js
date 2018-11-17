//Number of Enemies, max is 3 because only Stone Block for Enemy is present
const numberOfBugs = 3;

//returns a random number, used as speed for enemy
function randomSpeed(min, max){
	return Math.floor(Math.random()*max) + min;
}

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started
	this.pos_x = x;
	this.pos_y = y;
	this.speed = speed;

	this.width = 80
	this.height = 60

	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
	this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.

	this.pos_x += this.speed * dt;

	//Settings values when the Enemy crosses the x-axis of the screen
	if (this.pos_x >= 505) {
		this.pos_x = -100;
		this.pos_y = _.sample([60, 140, 220])
		this.speed = randomSpeed(150, 400)
	}

	this.checkCollision();

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.pos_x, this.pos_y);
};

//Calculates and check the collision between player and enemy, if collides then game is lost
Enemy.prototype.checkCollision = function() {

	//Credit to this SO answer: https://stackoverflow.com/a/14062645/6420136
	if (player.pos_x < this.pos_x + this.width && player.pos_x + player.width > this.pos_x && player.pos_y < this.pos_y + this.height && player.pos_y + player.height > this.pos_y){
		//console.log("Collision!")
		gameLost();
	}

};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

//Creates a new Player Object
class Player {

	constructor(x, y, speed) {
		this.pos_x = x;
		this.pos_y = y;
		this.speed = speed;
		this.width = 80
		this.height = 60
		this.sprite = 'images/char-horn-girl.png';
	}

	update() {
		if (this.pos_y <= 35) {
			gameWon();
			return;
		}

		if (this.pos_y > 400) {
			this.pos_y = 400;
		}
	}

	render() {
		ctx.drawImage(Resources.get(this.sprite), this.pos_x, this.pos_y);

	}

	handleInput(key) {
		switch(key){
			case 'left':
				this.pos_x = (this.pos_x - this.speed + 505) % 505;
				break;
			case 'right':
				this.pos_x = (this.pos_x + this.speed) % 505;
				break;
			case 'up':
				this.pos_y = (this.pos_y - this.speed + 606) % 606;
				break;
			case 'down':
				this.pos_y = (this.pos_y + this.speed) % 606;
				break;
		}
		this.update()
	}

	reset () {
		this.pos_x = 202.5;
		this.pos_y = 400;
	}

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];

// Place the player object in a variable called player
var player = new Player(202.5, 399, 50);

//when game first loads, default configuration is restored
setDefault();

//Resets Enemy's position and Player's position
function setDefault(){
	allEnemies = [];
	player.reset();

	//sample is function from underscore.js
	_.sample([60, 140, 220], numberOfBugs).forEach(function(pos_y) {
		allEnemies.push(new Enemy(0, pos_y, randomSpeed(150, 400)));
	});
}

//Called when Player reaches the water
function gameWon(){
	setDefault();
	console.log("Game Won!")
}

//Called when Player and Enemy collides
function gameLost(){
	setDefault();
	console.log("Game Lost!")
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});
