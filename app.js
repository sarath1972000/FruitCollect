let fruitPlayer =[]
let bomb=[]
let collector 
let score =0
let lives = 5
let game
let speed = 0
let target = 0
let timeMusic =[]
let backgroundSound

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
        this.load.audio("bombBlast" ,"./Assets/audio/8-bit-fireball-81148.mp3")
        this.load.audio("FruitCollect","./Assets/audio/robot_01-47250.mp3")
        this.load.audio("backgroundPlay","./Assets/audio/i-am-dreaming-or-final-fantasy-menu-kinda-thing-29173.mp3")
        this.load.audio("levelCompleted","./Assets/audio/mixkit-completion-of-a-level-2063.wav")
        this.load.audio("levelFailed" ,"./Assets/audio/negative_beeps-6008.mp3")
    }
    function create(){
        this.add.image(300 ,200 , "sky").setScale(0.65)
       
        setfruit.call(this)
        
        
        collector = this.physics.add.sprite(100,config.height,"collector")

        collector.setScale(0.8).setCollideWorldBounds(true)
        object =this
        addBackgroundMusic.call(object)
             
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
                    timeMusic.forEach(function(element){
                        clearInterval(element)
                    })
                    backgroundSound.setMute(true)
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
        const collected = this.sound.add("FruitCollect")
        collected.play()
        addBomb.call(this)
        document.querySelector(".score").innerHTML = "Score : "+score
        if(score == target || score > target){
            console.log("game wins")
            this.scene.stop()
            timeMusic.forEach(function(element){
                clearInterval(element)
            })
            backgroundSound.setMute(true)
            startGame.call(this)

        }
        setfruit.call(this)
    }

    function bombAttack(collector ,instance){
        instance.destroy()
        const destroySound = this.sound.add("bombBlast")
        if(score>0) {
            score-=10
            document.querySelector(".score").innerHTML = "Score : "+score
        }
        collector.setTint(0x000000)
        setTimeout(()=>{
            destroySound.play()
            collector.clearTint()
            lives-=1
            if(lives == 0){
                this.scene.stop()
                timeMusic.forEach(function(element){
                    clearInterval(element)
                })
                backgroundSound.setMute(true)
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
    function addBackgroundMusic(){
        backgroundSound = object.sound.add("backgroundPlay")
        let token= setInterval(function(){
            backgroundSound.play()
        },4000)
        timeMusic.push(token)
    }
    function startGame(){
        if(score>0 && lives !=0){
            lives = 5 
            score = 0
            const object= this 
            const winSound = this.sound.add("levelCompleted")
            winSound.play()
            document.querySelector("input").removeAttribute("hidden")
            document.querySelector("h1").innerHTML="You Win"
            document.querySelector("input").setAttribute("value","play again") 
            document.querySelector(".SettargetScore").removeAttribute("hidden")
            document.querySelector(".SettargetScore").value = ''
            document.querySelector(".SettargetScore").setAttribute("placeholder" , "set target")  
            let element = document.querySelector("input").addEventListener("click",function(){
                winSound.stop()
                object.scene.start()   
                addBackgroundMusic.call(this)
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
            const LostSound = this.sound.add("levelFailed")
            LostSound.play()
            document.querySelector("input").removeAttribute("hidden")
            document.querySelector("input").setAttribute("value","play again")
            document.querySelector(".SettargetScore").removeAttribute("hidden")
            document.querySelector(".SettargetScore").value = ''
            document.querySelector(".SettargetScore").setAttribute("placeholder" , "set target")  
            let element = document.querySelector("input").addEventListener("click",function(){
                LostSound.stop()
                object.scene.start() 
                addBackgroundMusic.call(this)  
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

    startGame()
    
}