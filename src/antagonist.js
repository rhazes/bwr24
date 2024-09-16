let n = 100;
let antagonist, emitter; 

//Emitter based on frames passed
class Emitter {
	constructor(x,y, rate) {
		this.x = x
		this.y = y
		this.rate = rate
		this.nextEmitFrame = frameCount + rate
	}
	update() {
		if(frameCount == this.nextEmitFrame) {
			this.emit()
			this.nextEmitFrame = frameCount + this.rate
		}
	}
	emit() {
		new antagonist.Sprite();
	}
}
function setup() {
  createCanvas(400, 400)
	new Canvas(600,400);
	world.gravity.y = 5;
	
	//normalDemo();
	floor = new Sprite(width*0.5, height - 5, width, 10);
	floor.color = 'black'
	floor.collider = 's'
	
	antagonist = new Group()
	antagonist.color = 'chartreuse';
	antagonist.life = 100;
	
	emitter = new Emitter(300, 50, 60);
	emitter.rate = 200;
}
function draw() {
	background('white')
	emitter.update();
	
	if(frameCount % 300 == 0) {
		emitter.rate -= 50;
		emitter.rate = max(50, emitter.rate)
	}
}

//Implemented based on this article
//https://web.archive.org/web/20140527034930/http://www.protonfish.com/random.shtml
function guassian(mean,std) {
	let gauss = random(-1,1) + random(-1,1) + random(-1,1);
	return gauss*std + mean;
}

setup()

