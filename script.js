
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 250;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 500;
networkCanvas.height=window.innerHeight

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width/2, carCanvas.width*.9)
const N=1000
const cars =generateCars(N);
let bestCar=cars[0]
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){

        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")
        )
        if(i!=0){
            NeuralNetwork.mutate(cars[i],brain,0.2)
        }
    }
}
const traffic = [
    new Car(road.getLaneCenter(0), -100, 20, 40, "DUMMY"),
    new Car(road.getLaneCenter(2), -300, 20, 40, "DUMMY"),
    new Car(road.getLaneCenter(1), -500, 20, 40, "DUMMY"),
    new Car(road.getLaneCenter(0), -1000, 20, 40, "DUMMY")
];
const laneCount = 3; // Number of lanes on the road
const carCount = 100; // Number of random cars to generate

for (let i = 0; i < carCount; i++) {
    const lane = Math.floor(Math.random() * laneCount); // Random lane index
    const yPosition = -Math.random() * 100000; // Random negative y position
    if(yPosition<-100){

        traffic.push(new Car(road.getLaneCenter(lane), yPosition, 20, 40, "DUMMY"));
    }
}

animate()
function  save(){
    localStorage.stringify("bestBrain",JSON.stringify(bestCar.brain ))
}
function discard(){
    localStorage.removeItem("bestCar")
}

function generateCars(N){
    const cars = []
    for(let i=1;i<N;i++){
        cars.push(new Car(road.getLaneCenter(1), -100, 20, 40,"AI",7))
    }
    return cars
}
function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]); 
    }
    
    for(let i=0 ; i<cars.length; i++){
        cars[i].update(road.borders,traffic);
    }
    const bestCar = cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    );
    carCanvas.height = window.innerHeight;
    carCtx.save()
    carCtx.translate(0, -bestCar.y+carCanvas.height*.8)
    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha=0.2;
    for(let i=0 ; i<cars.length; i++){
        cars[i].draw(carCtx,"blue");
        
    }
    carCtx.globalAlpha=1;

    bestCar.draw(carCtx,"blue",true);

    carCtx.restore()

    networkCtx.lineDashOffset=-time/50
    Visualizer.drawNetwork(networkCtx,bestCar.brain)
    requestAnimationFrame(animate)
}



// to remove networkCanvas
document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth < 768) {
        const networkCanvas = document.getElementById("networkCanvas");
        if (networkCanvas) {
            networkCanvas.remove(); // Remove the network canvas for small screens
        }
    }
});