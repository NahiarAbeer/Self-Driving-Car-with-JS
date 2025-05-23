class Car {
    constructor(x, y, w, h,controlType , maxSpeed = 3) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = .05;
        this.angle = 0;

        this.damaged = false;
        this.useBrain = controlType=="AI";
        if(controlType!="DUMMY"){

            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount,6,4]
            );
        }
        this.control = new Control(controlType);
        
    }
    
    update(roadBorders,traffic){
        if(!this.damaged){

            this.#move()
            this.polygon = this.#createPolygon()
            this.damaged = this.#assessDamage(roadBorders,traffic)
        }
        if(this.sensor){

            this.sensor.update(roadBorders,traffic)
            const offset = this.sensor.readings.map(
                s=>s==null?0:1-s.offset
            )
            const outputs = NeuralNetwork.feedForward(offset,this.brain)
            if(this.useBrain){
                this.control.forward=outputs[0]
                this.control.left=outputs[1]
                this.control.right=outputs[2]
                this.control.reverse=outputs[3]
            }
        }
    }
    #assessDamage(roadBorders,traffic){
        for(let i=0; i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true
            }
        }
        for(let i=0; i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true
            }
        }
        return false
    }
    #createPolygon(){
        const points = []
        const rad = Math.hypot(this.w , this.h)/2
        const alpha = Math.atan2(this.w , this.h)
        points.push({
            x:this.x - Math.sin(this.angle - alpha)*rad,
            y:this.y - Math.cos(this.angle - alpha)*rad,
        })
        points.push({
            x:this.x - Math.sin(this.angle + alpha)*rad,
            y:this.y - Math.cos(this.angle + alpha)*rad,
        })
        points.push({
            x:this.x - Math.sin(Math.PI+ this.angle - alpha)*rad,
            y:this.y - Math.cos(Math.PI+this.angle - alpha)*rad,
        })
        points.push({
            x:this.x - Math.sin(Math.PI+this.angle + alpha)*rad,
            y:this.y - Math.cos(Math.PI+this.angle + alpha)*rad,
        })
        
        return points
    }
    #move(){
        if(this.control.forward){
                
            this.speed += this.acceleration;
        }
        if(this.control.reverse){
            
            this.speed -= this.acceleration;

        }
        if (this.speed > this.maxSpeed){
            this.speed = this.maxSpeed
        }
        if(this.speed <- this.maxSpeed/2){
            this.speed = - this.maxSpeed/2
        }
        if(this.speed>0){
            this.speed -=this.friction
        }
        
        if(this.speed<0){
            this.speed +=this.friction
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed = 0
        }
        if(this.speed != 0){
            const flip = this.speed > 0?1:-1;
            if(this.control.left){
                this.angle +=0.03*flip
            }
            if(this.control.right){
                this.angle -= 0.03*flip
            }
        }

        this.x -=Math.sin(this.angle)*this.speed
        this.y -=Math.cos(this.angle)*this.speed
        
    }
draw(ctx , color,drawSensor=false) {
    if(this.damaged){
        ctx.fillStyle = "gray"
    }else{
        ctx.fillStyle = color
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
    for(let i=1;i<this.polygon.length;i++){
        ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
    }
    ctx.fill();
    if(this.sensor && drawSensor){

        this.sensor.draw(ctx)
    }
}
}
