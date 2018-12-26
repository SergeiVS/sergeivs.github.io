(function (){    
    const screenWidth = 540;
    const screenHeight = 720;
    const rowsCount = 10;
    
    
    let mainState = 
    {
        preload: function()
        {
            game.load.image("santa", "src/assets/santa.png");
            game.load.image("obstacle", "src/assets/plane.png");
            game.load.image("sky", "src/assets/sky.png");
            game.load.image("city", "src/assets/city.png");
            game.load.image("cloud1", "src/assets/cloud_1.png");
            game.load.image("cloud2", "src/assets/cloud_2.png");
            game.load.image("cloud3", "src/assets/cloud_3.png");
            game.load.image("cloud4", "src/assets/cloud_4.png");
            game.load.image("cloud5", "src/assets/cloud_5.png");
            game.load.image("cloud6", "src/assets/cloud_6.png");
            game.load.image("cloud7", "src/assets/cloud_7.png");
            game.load.image("cloud8", "src/assets/cloud_8.png");
        },
        create: function()
        {
            this.pause = true;
            this.score = 0;

            this.sky = this.game.add.tileSprite(0, 0, this.game.cache.getImage("sky").width, this.game.height, "sky");
            
            this.city = this.game.add.tileSprite(0,
                this.game.height - this.game.cache.getImage("city").height,
                this.game.width,
                this.game.cache.getImage("city").height,
                "city"
            );

            this.labelScore = game.add.text(20, 20, "0", 
                { font: "30px Arial", fill: "#ffffff" }); 

            this.obstacles = game.add.group();
            this.clouds = game.add.group();   
            game.time.events.loop(1500, this.addCloud, this); 

            game.physics.startSystem(Phaser.Physics.ARCADE);
            
            

            this.santa = game.add.sprite(100,245, "santa");
            this.santa.smoothed = true;
            this.santa.width = 100;
            this.santa.height = 55;
            this.santa.anchor.setTo(0.2, 1); 
            game.physics.arcade.enable(this.santa);
            this.santa.body.gravity.y = 0;
            

            var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(this.jump, this); 
            this.timer = game.time.events.loop(1000, this.addObstacle, this);
        },
        update: function()
        {
            this.city.tilePosition.x -= 0.15;
            if (this.santa.angle < 20)
                this.santa.angle += 1; 
            if (this.santa.y < 0 || this.santa.y > screenHeight)
                this.restartGame();
            game.physics.arcade.overlap(this.santa, this.obstacles, this.hitObstacle, null, this);
        },
        jump: function() 
        {
            if (this.pause)
                this.resume();
            if (this.santa.alive == false) return;
            var animation = game.add.tween(this.santa);
            animation.to({angle: -20}, 100);
            animation.start();
            this.santa.body.velocity.y = -360;
        },
        restartGame: function() {
            game.state.start('main');
        },
        addCloud: function()
        {
            let index = Math.floor(Math.random() * 8) + 1;
            let y = Math.floor(Math.random() * screenHeight / 2);
            let size = Math.floor(Math.random() * 25);
            var cloud = game.add.sprite(screenWidth, y, "cloud" + index);
            cloud.width = 75 + size;
            cloud.height = 75 + size;
            this.clouds.add(cloud);
            game.physics.arcade.enable(cloud);
            let speed = Math.floor(Math.random() * 20);
            cloud.body.velocity.x = speed - 50;
            cloud.checkWorldBounds = true;
            cloud.outOfBoundsKill = true;
        },
        addObstacle: function()
        {
            if (this.pause) return;
            let x = screenWidth;
            let y = Math.floor(Math.random() * screenHeight);
            var obstacle = game.add.sprite(x, y, 'obstacle');
            obstacle.width = 150;
            obstacle.height = 70;
            this.obstacles.add(obstacle);
            game.physics.arcade.enable(obstacle);
            obstacle.body.velocity.x = -200; 
            obstacle.checkWorldBounds = true;
            obstacle.outOfBoundsKill = true;
        },
        addOneObstacle: function(x, y) 
        {
            var obstacle = game.add.sprite(x, y, 'obstacle');
            obstacle.width = 50;
            obstacle.height = 50;
            this.obstacles.add(obstacle);
            game.physics.arcade.enable(obstacle);
            obstacle.body.velocity.x = -200; 
            obstacle.checkWorldBounds = true;
            obstacle.outOfBoundsKill = true;
        },
        addRowOfObstacles: function() 
        {
            if (this.pause) return;
            var hole = Math.floor(Math.random() * 5) + 1;
            for (var i = 0; i < rowsCount; i++)
                if (i != hole && i != hole + 1) 
                    this.addOneObstacle(400, i * 72);  
            this.score += 1;
            this.labelScore.text = this.score; 
        },
        hitObstacle: function() 
        {
            if (this.santa.alive == false)
                return;
            this.santa.alive = false;
            game.time.events.remove(this.timer);
            this.obstacles.forEach(function(p){
                p.body.velocity.x = 0;
            }, this);
        },
        pause: function()
        {
            this.pause = true;
            this.santa.body.gravity.y = 0;
        },
        resume: function()
        {
            this.pause = false;
            this.santa.body.gravity.y = 1000;
        }
    };
    
    let game = new Phaser.Game(540, 720);
    game.state.add("main", mainState);
    game.state.start("main");
})()
    
    