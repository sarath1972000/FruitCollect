let fruitPlayer =[],collector ,score =0,lives = 5
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
    const game = new Phaser.Game(config);
    
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
     
        if(cursor.left.isDown){
            collector.setVelocityX(-200)

        }
        else if(cursor.right.isDown){
            collector.setVelocityX(200)
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
    function collectFruit(collector , x){    
        x.destroy()
        score+=5
        document.querySelector(".score").innerHTML = "Score : "+score
        if(score == 100){
            console.log("game wins")
            this.scene.stop()
            startGame.call(this)

        }
        setfruit.call(this)
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
    }
    function startGame(){
        if(lives >0){
            lives = 5 
            score = 0
            document.querySelector("input").removeAttribute("hidden")
            document.querySelector("h1").innerHTML="You Win"
            document.querySelector("input").setAttribute("value","play again") 
            const object= this 
            let element = document.querySelector("input").addEventListener("click",function(){
                object.scene.start()   
                document.querySelector("h1").innerHTML=""
                document.querySelector("input").setAttribute("value","")
                document.querySelector("input").setAttribute("hidden",'true')
                document.querySelector(".lives").innerHTML = "Life : "+lives
                document.querySelector(".score").innerHTML = "Score : "+score
            })


        }
        else{
            lives = 5 
            score = 0
            document.querySelector("h1").innerHTML="You Failed"
            const object = this 
            document.querySelector("input").removeAttribute("hidden")
            document.querySelector("input").setAttribute("value","play again")
            let element = document.querySelector("input").addEventListener("click",function(){
                object.scene.start()   
                document.querySelector("h1").innerHTML=""
                document.querySelector("input").setAttribute("value","")
                document.querySelector("input").setAttribute("hidden",'true')
                document.querySelector(".lives").innerHTML = "Life : "+lives
                document.querySelector(".score").innerHTML = "Score : "+score
                
            })
            
        }
    }

    