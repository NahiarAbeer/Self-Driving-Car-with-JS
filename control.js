class Control{
    constructor(type){
        this.forward =false;
        this.reverse =false;
        this.right =false;
        this.left =false;
        switch (type) {
            case "KEYS":
                this.#addkeyboardlisteners();
                break;
            case "DUMMY":
                this.forward = true;
                break;
        }
    }
    // its a private method
    #addkeyboardlisteners(){
        document.onkeydown=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left = true;
                    break
                case "ArrowRight":
                    this.right = true;
                    break
                case "ArrowUp":
                    this.forward = true;
                    break
                case "ArrowDown":
                    this.reverse = true;
                    break
            }
        }
        document.onkeyup=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left = false;
                    break
                case "ArrowUp":
                    this.forward = false;
                    break
                case "ArrowRight":
                    this.right = false;
                    break
                case "ArrowDown":
                    this.reverse = false;
                    break
            }
        }
    }
}