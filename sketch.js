let img, y, i, icon, iconW, iconH, tick, signature;
let bgColors, icons, backdrops, signatures;
let bgColorIndex, iconIndex, backdropIndex, signatureIndex;
let plane, formular1, jet, cessna, rocket; 
let bg_hongkong,bg_hongkong2,bg_world,bg_dc,bg_arrow,bg_wave,bg_blank;
let sig_heavenonearth;
let p5canvas, capturer;

function preload(){
    // load our image
    img = loadImage('assets/text.png');
    
    plane = loadImage('assets/plane.png');
    jet = loadImage('assets/747.png');
    cessna = loadImage('assets/cessna.png');
    formular1 = loadImage('assets/f-1.png');
    rocket = loadImage('assets/rocket.png');

    bg_blank = loadImage('assets/bg-blank.png');
    bg_hongkong = loadImage('assets/bg-hongkong-1.png');
    bg_hongkong2 = loadImage('assets/bg-hongkong-2.png');
    bg_dc = loadImage('assets/bg-dc.png');
    bg_arrow = loadImage('assets/bg-arrow.png');
    bg_wave = loadImage('assets/bg-wave.png');
    bg_world = loadImage('assets/bg-world.png');

    sig_heavenonearth = loadImage('assets/z1coach-heavenonearth.png');
    sig_knowyourself = loadImage('assets/z1coach-knowyourself.png');


 }

 function getQs() {
  const params = new URLSearchParams(window.location.search);
  iconIndex = Number(params.get('icon')) || 0;
  bgColorIndex = Number(params.get('bgcolor')) || 0;
  backdropIndex = Number(params.get('backdrop')) || 0;
  signatureIndex = Number(params.get('signature')) || 0;
  return { params, iconIndex, bgColorIndex, backdropIndex, signatureIndex };
} 

function setup() {

  const params = new URLSearchParams(window.location.search);
  console.log("Params");
  console.log(params);


  p5canvas = createCanvas(433, 624);
  y=500;
  i=1;
  tick=0;

  icons = [
    plane, formular1, jet, cessna, rocket
  ]

  backdrops = [
    bg_blank, bg_hongkong, bg_hongkong2, bg_dc, bg_world, bg_wave, bg_arrow
  ];


  bgColors = [
    color(252,238,33), //Aureolin
    color(254, 179, 154), //Melon
    color(133, 216, 255), //Pale Azure
    color(255, 214, 214), //Tea Rose
    color(208, 240, 192) //Tea Green
  ]

  signatures = [
    bg_blank, sig_knowyourself, sig_heavenonearth
  ];

  getQs();

  
  capturer = new CCapture({
    framerate: 30,
    format: 'webm',
    name: `Craftyourworld-cover-${iconIndex}-${bgColorIndex}-${backdropIndex}-${signatureIndex}`,
  });
  
}

function draw() {
  //Background color could have 5 variations  
  background(bgColors[bgColorIndex]);

  imageMode(CENTER);

  push();
  tint(255, 200); // Display at half opacity
  //There are 7 backdrops
  image(backdrops[backdropIndex],width/2,height/2, width, height);
  pop();

  //There are 5 icons
  icon = icons[iconIndex];
  iconH = 99;
  iconW = icon.width * ( iconH/icon.height );

  image(icon, width/2, y, iconW*i, iconH*i);
  image(img, width/2, height/2+10);
 
  signature = signatures[signatureIndex];
  image(signature,340,520,180,signature.height * 180 / signature.width);

  tick++;
  console.log("tick="+tick);
  if (tick===1) capturer.start();
  if (tick > 0 && tick <=180) {
    capturer.capture(p5canvas.canvas);
  } else {
    tick=0; y=500; i=1;
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    noLoop();

    //To continue generating the next one
    setTimeout(() => nextIndex(), 2000);
    return;    
  }
  if (tick>100) { i=i*1.01; y-=5;} //Start animation
}

function nextIndex() {
  let { params } = getQs();

  iconIndex += 1;
  if (iconIndex >= icons.length) { iconIndex=0; bgColorIndex+=1;}
  if (bgColorIndex >= bgColors.length) {iconIndex=0; bgColorIndex=0; backdropIndex+=1;}
  if (backdropIndex >= backdrops.length) {iconIndex=0; bgColorIndex=0; backdropIndex=0; signatureIndex+=1};
  if (signatureIndex >= signatures.length) return;

  params.set('icon', Number(iconIndex));
  params.set('bgcolor', Number(bgColorIndex));
  params.set('backdrop', Number(backdropIndex));
  params.set('signature', Number(signatureIndex));

  console.log("Reloading!!!!");
  console.log(params.toString());
  document.location = `?${params.toString()}`;
}

function windowResized() {
  resizeCanvas(p5canvas.width, p5canvas.height);
}