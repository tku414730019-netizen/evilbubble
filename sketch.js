let circles = [];
let explosions = [];
let popSound; // 🎵 新增：用來存放音效
let palette = [
  [176, 66, 66, 204],   // #B04242
  [224, 207, 186, 204], // #E0CFBA
  [149, 45, 36, 204],   // #952D24
  [168, 131, 122, 204]  // #A8837A
];
let score = 0; // 新增：計分變數

function preload() {
  // 🎵 新增：載入音效（確保 MP3 檔放在與此程式同層資料夾中）
  popSound = loadSound('bubble-pop-06-351337.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(115, 87, 81); // #735751

  // 產生60個圓
  for (let i = 0; i < 60; i++) {
    let radius = random(50, 140);
    let c = random(palette);
    let speed = map(radius, 120, 260, 2, 6);
    circles.push({
      x: random(width),
      y: random(height),
      r: radius,
      color: c,
      speed: speed
    });
  }
}

function draw() {
  background(115, 87, 81);
  noStroke();

  // 右上角顯示分數
  fill(255, 255, 255, 220);
  textSize(36);
  textAlign(RIGHT, TOP);
  text("分數：" + score, width - 30, 20);

  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];
    fill(c.color[0], c.color[1], c.color[2], c.color[3]);
    ellipse(c.x, c.y, c.r, c.r);

    // 高光
    let highlightSize = c.r * 0.15;
    let offset = c.r * 0.22;
    fill(255, 255, 255, 180);
    rectMode(CENTER);
    push();
    translate(c.x, c.y);
    rect(offset, -offset, highlightSize, highlightSize, highlightSize * 0.4);
    pop();

    // 取消自動爆破，只保留移動與重生
    c.y -= c.speed;
    if (c.y + c.r / 2 < 0) {
      c.r = random(50, 140);
      c.speed = map(c.r, 120, 260, 2, 6);
      c.y = height + c.r / 2;
      c.x = random(width);
      c.color = random(palette);
    }
  }

  // 畫爆破動畫
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

function mousePressed() {
  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];
    let d = dist(mouseX, mouseY, c.x, c.y);
    if (d < c.r / 2) {
      explosions.push({
        x: c.x,
        y: c.y,
        r: c.r,
        color: c.color.slice(0, 3),
        t: 0
      });

      // 🎵 播放音效
      if (popSound && !popSound.isPlaying()) {
        popSound.play();
      }

      // 計分加一
      score++;

      // 重新生成圓
      c.r = random(50, 140);
      c.speed = map(c.r, 120, 260, 2, 6);
      c.y = height + c.r / 2;
      c.x = random(width);
      c.color = random(palette);
      break;
    }
  }
}
