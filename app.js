let fruitPlayer =[]
let bomb=[]
let collector 
let score =0
let lives = 5
let game
let speed = 0
let target = 0


const config = {
        type : Phaser.AUTO,
        width : 900 , 
        height : 500 , 
        physics : {
            default : "arcade",
            arcade :{
                gravity : {y:100},
                debug : false
            }
        },

        scene : {
            preload : preload, 
            create : create ,
            update : update 
        }
        
    }
    
    
    function preload(){
        this.load.image("sky" , "./Assets/craftpix-net-481981-free-summer-pixel-art-backgrounds/Cartoon_Forest_BG_02.png")
        let directory = "./Assets/craftpix-net-772742-free-fruit-vector-icon-pack-for-rpg/shadow"
        for(let x = 1 ; x<48 ; x++){
            try{
            this.load.image(`fruit${x}` , `${directory}/${x}.png`)
            }
            catch{
                console.log(x+"is undefined");
            }
        }
        this.load.image("collector","./Assets/collector/Character4_face1.png")
        this.load.image("bomb" , "./Assets/bombs/Bomb_2_Idle_006.png")

        
        
        
    }
    function create(){
        this.add.image(300 ,200 , "sky").setScale(0.65)
       
        setfruit.call(this)
        
        
        collector = this.physics.add.sprite(100,config.height,"collector")

        collector.setScale(0.8).setCollideWorldBounds(true)
       
        
             
    }
    function update(){
        
        let cursor = this.input.keyboard.createCursorKeys()
        // this.physics.add.collider(collector , fruitPlayer)
        
        addOverlap.call(this)
     
        if(cursor.left.isDown ){
            if(cursor.space.isDown) speed =40
            else speed = 0
            collector.setVelocityX(-200-speed)
        }
        else if(cursor.right.isDown){
            if(cursor.space.isDown) speed =40 
            else speed = 0
            collector.setVelocityX(200+speed)  
        } 
        else {
            collector.setVelocityX(0)
        }

        
        checkfruit.call(this)
    }
    function checkfruit(){
        for(x in fruitPlayer){
            if(fruitPlayer[x].y > config.height && fruitPlayer[x].active == true){
                fruitPlayer[x].destroy()
                fruitPlayer.splice(x,1)
                setfruit.call(this)
                addBomb.call(this)
                lives-=1
                document.querySelector(".lives").innerHTML = "Life : "+lives
                if(lives == 0){
                    this.scene.stop()
                    startGame.call(this)
                }
                if(score>0) score-=5
                else score = 0
                document.querySelector(".score").innerHTML = "Score : "+score
            }
            else if (fruitPlayer[x].active == false){
                fruitPlayer.splice(x,1)
            }

        }
    }
    function addBomb(){
            
         bomb.push(this.physics.add.sprite(Math.floor(Math.random()*config.width+1),
                                                  0,
                                                  `bomb`).setScale(0.2))
            
    }
    function collectFruit(collector , x){    
        x.destroy()
        score+=5
        addBomb.call(this)
        document.querySelector(".score").innerHTML = "Score : "+score
        if(score == target){
            console.log("game wins")
            this.scene.stop()
            startGame.call(this)

        }
        setfruit.call(this)
    }

    function bombAttack(collector ,instance){
        instance.destroy()
        if(score>0) {
            score-=10
            document.querySelector(".score").innerHTML = "Score : "+score
        }
        collector.setTint(0x000000)
        setTimeout(()=>{
            collector.clearTint()
            lives-=1
            if(lives == 0){
                this.scene.stop()
                startGame.call(this)
            }
            document.querySelector(".lives").innerHTML = "Life : "+lives
        },100)
    }
    function setfruit(){
        fruitPlayer.push(this.physics.add.sprite(Math.floor(Math.random()*config.width+1),
                                                  0,
                                                  `fruit${Math.floor(Math.random()*48)+1}`).setScale(0.5))
       
    }

    function addOverlap(){
        for(x of fruitPlayer){
            this.physics.add.overlap(collector,x, collectFruit ,null ,this)
        }
        for(instance of bomb){
            this.physics.add.overlap(collector,instance, bombAttack ,null ,this)
        }
    }
    function startGame(){
        if(score>0 && lives !=0){
            lives = 5 
            score = 0
            document.querySelector("input").removeAttribute("hidden")
            document.querySelector("h1").innerHTML="You Win"
            document.querySelector("input").setAttribute("value","play again") 
            document.querySelector(".SettargetScore").removeAttribute("hidden")
            document.querySelector(".SettargetScore").value = ''
            document.querySelector(".SettargetScore").setAttribute("placeholder" , "set target")  
            const object= this 
            let element = document.querySelector("input").addEventListener("click",function(){
                object.scene.start()   
                document.querySelector("h1").innerHTML=""
                document.querySelector("input").setAttribute("value","")
                document.querySelector("input").setAttribute("hidden",'true')
                target = document.querySelector(".SettargetScore").value
                document.querySelector(".SettargetScore").setAttribute("hidden",'true')
                if(target == null || target == undefined || target =='') target =100   
                document.querySelector(".targetScore").innerHTML = "Target score : "+target
                document.querySelector(".lives").innerHTML = "Life : "+lives
                document.querySelector(".score").innerHTML = "Score : "+score
                
            })


        }
        else if(lives ==0){
            lives = 5 
            score = 0
            document.querySelector("h1").innerHTML="You Failed"
            const object = this 
            document.querySelector("input").removeAttribute("hidden")
            document.querySelector("input").setAttribute("value","play again")
            document.querySelector(".SettargetScore").removeAttribute("hidden")
            document.querySelector(".SettargetScore").value = ''
            document.querySelector(".SettargetScore").setAttribute("placeholder" , "set target")  
            let element = document.querySelector("input").addEventListener("click",function(){
                object.scene.start()   
                document.querySelector("h1").innerHTML=""
                document.querySelector("input").setAttribute("value","")
                document.querySelector("input").setAttribute("hidden",'true')
                target = document.querySelector(".SettargetScore").value
                document.querySelector(".SettargetScore").setAttribute("hidden",'true')
                if(target == null || target == undefined || target =='') target =100   
                document.querySelector(".targetScore").innerHTML = "Target score : "+target
                document.querySelector(".lives").innerHTML = "Life : "+lives
                document.querySelector(".score").innerHTML = "Score : "+score
                
            })
            
        }
        else{
            document.querySelector("h1").innerHTML="Start game "
            document.querySelector(".startGame").removeAttribute("hidden")
            document.querySelector(".startGame").setAttribute("value","play game")
            document.querySelector(".SettargetScore").removeAttribute("hidden")
            document.querySelector(".SettargetScore").value = ''
            document.querySelector(".SettargetScore").setAttribute("placeholder" , "set target")  
            let element = document.querySelector(".startGame").addEventListener("click",function(){
                game = new Phaser.Game(config);
                document.querySelector("h1").innerHTML=""
                document.querySelector(".startGame").setAttribute("value","")
                document.querySelector(".startGame").setAttribute("hidden",'true')
                target = document.querySelector(".SettargetScore").value
                document.querySelector(".SettargetScore").setAttribute("hidden",'true')
                if(target == null || target == undefined || target =='') target =100   
                document.querySelector(".targetScore").innerHTML = "Target score : "+target
                document.querySelector(".lives").innerHTML = "Life : "+lives
                document.querySelector(".score").innerHTML = "Score : "+score
                
            })


        }
       
    }


if(window.innerWidth < 1100){
   document.querySelector(".main").setAttribute("hidden",'true')
   document.querySelector(".Error").removeAttribute("hidden")
}
else {
    console.log(window)

    startGame()
    
}