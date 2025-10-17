let circles = [];
let explosions = [];
let popSound;
let palette = [
  [176, 66, 66, 204],
  [224, 207, 186, 204],
  [149, 45, 36, 204],
  [168, 131, 122, 204]
];

function preload() {
  popSound = loadSound('bubble-pop-06-351337.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(115, 87, 81);

  // 建立泡泡
  for (let i = 0; i < 60; i++) {
    let radius = random(50, 140);
    let c = random(palette);
    let speed = map(radius, 120, 260, 2, 6);
    circles.push({
      x: random(width),
      y: random(height, height * 1.5),
      r: radius,
      color: c,
      speed: speed,
      life: random(180, 600) // 每顆泡泡壽命（幀數）
    });
  }
}

function draw() {
  background(115, 87, 81);
  noStroke();

  // 更新並畫泡泡
  for (let i = circles.length - 1; i >= 0; i--) {
    let c = circles[i];

    // 畫泡泡
    fill(c.color[0], c.color[1], c.color[2], c.color[3]);
    ellipse(c.x, c.y, c.r, c.r);

    // 高光
    let highlightSize = c.r * 0.15;
    let offset = c.r * 0.22;
    fill(255, 255, 255, 180);
    push();
    translate(c.x, c.y);
    rectMode(CENTER);
    rect(offset, -offset, highlightSize, highlightSize, highlightSize * 0.4);
    pop();

    // 漂浮
    c.y -= c.speed;
    c.life--;

    // 泡泡離開畫面或壽命到 → 爆炸
    if (c.y + c.r / 2 < 0 || c.life <= 0) {
      triggerExplosion(c.x, c.y, c.r, c.color);
      circles.splice(i, 1);
      spawnBubble();
    }
  }

  // 畫爆炸效果
  for (let i = explosions.length - 1; i >= 0; i--) {
    let e = explosions[i];
    let steps = 18;
    let maxT = 20;
    let alpha = map(e.t, 0, maxT, 180, 0);
    stroke(255, 255, 255, alpha);
    strokeWeight(2);
    noFill();
    let rr = e.r * (1 + e.t / maxT * 0.6);
    for (let j = 0; j < steps; j++) {
      let angle = TWO_PI * j / steps + random(-0.05, 0.05);
      let len = rr * (0.9 + random(0.1));
      let x1 = e.x + cos(angle) * (rr * 0.7);
      let y1 = e.y + sin(angle) * (rr * 0.7);
      let x2 = e.x + cos(angle) * len;
      let y2 = e.y + sin(angle) * len;
      line(x1, y1, x2, y2);
    }
    e.t++;
    if (e.t > maxT) explosions.splice(i, 1);
  }
}

// 點擊泡泡 → 爆炸
function mousePressed() {
  for (let i = circles.length - 1; i >= 0; i--) {
    let c = circles[i];
    let d = dist(mouseX, mouseY, c.x, c.y);
    if (d < c.r / 2) {
      triggerExplosion(c.x, c.y, c.r, c.color);
      circles.splice(i, 1);
      spawnBubble();
      break;
    }
  }
}

// 🧨 爆炸動畫 + 聲音
function triggerExplosion(x, y, r, color) {
  explosions.push({ x: x, y: y, r: r, color: color.slice(0, 3), t: 0 });
  if (popSound) popSound.play();
}

// 🎈 產生新泡泡
function spawnBubble() {
  let radius = random(50, 140);
  let c = random(palette);
  let speed = map(radius, 120, 260, 2, 6);
  circles.push({
    x: random(width),
    y: height + radius,
    r: radius,
    color: c,
    speed: speed,
    life: random(180, 600)
  });
}
