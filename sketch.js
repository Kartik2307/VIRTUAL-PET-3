var dog,happyDog;
var database;
var foodS,foodStock;
var dogimg,dogimg2,milkimage,bedroomimg,gardenimg,runningimg,washroomimg,sadDog;
var feedTime,lastFed;
var gameState,changeGameState;

function preload()
{
  dogimg=loadImage("images/dog.png")
  dogimg2=loadImage("images/dog1.png")
  milkimage = loadImage("images/Milk.png")
  bedroomimg=loadImage("images/BedRoom.png")
  gardenimg=loadImage("images/Garden.png")
  washroomimg=loadImage("images/WashRoom.png")
  runningimg=loadImage("images/running.png")
  sadDog=loadImage("images/sadDog.png")
}

function setup() {
  createCanvas(900,600);
  database=firebase.database();
  dog = createSprite(700,300,10,10)
  dog.addImage(dogimg);
  dog.scale=0.4;

feed=createButton("Feed the Dog")
feed.position(700,95)
feed.mousePressed(feedDog)

addFood=createButton("Add Food")
addFood.position(800,95)
addFood.mousePressed(addFoods)

foodStock=database.ref('food')
foodStock.on("value",readStock)

gameState=database.ref('gameState')
gameState.on("value",readStock2)

feedTime=database.ref('feedTime');
feedTime.on("value",function(data){
  lastFed=data.val();
})

}


function draw() {  
 
background(46,139,87)

fill(255,255,254)
textSize(15)

if(lastFed>=12){
  text("Last Feed : "+lastFed%12+"PM",350,30)
}else if(lastFed===0){
  text("Last Feed : 12 AM",350,30)
}else{
  text("Last Feed : "+lastFed+"AM",350,30)
}

if(gameState!=="hungry"){
feed.hide();
addFood.hide();

}else{
feed.show();
addFood.show();

}

currentTime=hour();
if(currentTime==(lastFed+1)){
  update("playing");
  background(gardenimg,550,500)
}else if(currentTime==(lastFed+2)){
  update("sleeping");
  background(bedroomimg,550,500)
}else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
  update("WashRoom");
  background(washroomimg,550,500)
}else{
  update("hungry")
}
milkdisplay();
drawSprites();
}

function feedDog(){
  dog.addImage(dogimg2);
  foodS--;
 // foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  database.ref('/').update({
    food:foodS,
   feedTime:hour()
  })
}

function addFoods(){
  dog.addImage(dogimg)
foodS++;
database.ref('/').update({
food:foodS
})
}

function readStock(data){
foodS=data.val();
}

function readStock2(data){
  gameState=data.val();
  }

function milkdisplay(){
var x=80,y=100;
imageMode(CENTER)

if(this.foodS!==0){
    for(var i =0;i<this.foodS;i++){
        if(i%10===0){
            x=80;
            y=y+50;
        }
        image(milkimage,x,y,50,50)
        x=x+30;
    }
}
}

function update(state){
database.ref('/').update({
  gameState:state
});
}