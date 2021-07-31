var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var boy__collided;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

var coin;

var background;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  boy__collided = loadAnimation("boy.png"); 
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
 
  obstacle4 = loadImage("barrier.jpg");
 
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")

  coin = loadImage("coin.png");
  runner = loadAnimation("runner_.gif");
  trackImage = loadAnimation("track.png");
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(1500,500);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", runner);
  trex.addAnimation("collided", boy__collided );
  

  trex.scale = 0.3;
  
  ground = createSprite(200,460,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(750,250);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(750,280);
  restart.addImage(restartImg);

 
  obstacle4.scale=0.5;
  
  

  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,480,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false
  
  score = 0;
 
}

function draw() {
  
  background("white");
  //displaying score
  text("Score: "+ score, 1200,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
   
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
      //change the trex animation
      trex.changeAnimation("collided", boy__collided );
     
      if(mousePressedOver(restart)) {
         reset();
      }

    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
 

  drawSprites();
}

function reset(){
 gameState=PLAY;
  
 gameOver.visible=false;
 restart.visible=false; 
  
 obstaclesGroup.destroyEach();
 cloudsGroup.destroyEach(); 
  
 trex.changeAnimation("running",trex_running);
  
  score=0
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(1500,470,40,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle4);
              break;
      case 3: obstacle.addImage(obstacle4);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 2: obstacle.addImage(obstacle4);
              break;        
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(1500,800,10,10);
    cloud.y = Math.round(random(80,800));
    cloud.addImage(coin);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 1500;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}



