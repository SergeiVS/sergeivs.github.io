(function (){    
    const screenWidth = 540;
    const screenHeight = 720;
    const rowsCount = 10;
    
    const imagesFolder = "src/assets/images/";
    
    let mainState = 
    {
        preload: function()
        {
            game.load.image("santa", imagesFolder + "santa.png");
            game.load.image("obstacle", imagesFolder + "plane.png");
            game.load.image("sky", imagesFolder + "sky.png");
            game.load.image("city", imagesFolder + "city.png");
            game.load.image("cloud1", imagesFolder + "cloud_1.png");
            game.load.image("cloud2", imagesFolder + "cloud_2.png");
            game.load.image("cloud3", imagesFolder + "cloud_3.png");
            game.load.image("cloud4", imagesFolder + "cloud_4.png");
            game.load.image("cloud5", imagesFolder + "cloud_5.png");
            game.load.image("cloud6", imagesFolder + "cloud_6.png");
            game.load.image("cloud7", imagesFolder + "cloud_7.png");
            game.load.image("cloud8", imagesFolder + "cloud_8.png");
            game.load.image("gift1", imagesFolder + "gift_1.png");
            game.load.image("gift2", imagesFolder + "gift_2.png");
            game.load.image("gift3", imagesFolder + "gift_3.png");
            game.load.image("gift4", imagesFolder + "gift_4.png");
            game.load.image("gift5", imagesFolder + "gift_5.png");
            game.load.image("gift6", imagesFolder + "gift_6.png");
            game.load.image("gift7", imagesFolder + "gift_7.png");
            game.load.image("gift8", imagesFolder + "gift_8.png");
            game.load.image("gift9", imagesFolder + "gift_9.png");
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
            this.obstacleTimer = game.time.events.loop(2000, this.addObstacle, this);
            this.clouds = game.add.group();   
            game.time.events.loop(1500, this.addCloud, this); 
            this.gifts = game.add.group();  
            this.giftsTimer = game.time.events.loop(1000, this.addGift, this);  

            

            this.santa = game.add.sprite(100,245, "santa");
            this.santa.smoothed = true;
            this.santa.width = 100;
            this.santa.height = 55;
            this.santa.anchor.setTo(0.2, 1); 
            game.physics.arcade.enable(this.santa);
            this.santa.body.gravity.y = 0;
            

            var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(this.jump, this); 
            
        },
        update: function()
        {
            this.city.tilePosition.x -= 0.15;
            if (this.santa.angle < 20)
                this.santa.angle += 1; 
            if (this.santa.y < 0 || this.santa.y > screenHeight)
                this.restartGame();
            game.physics.arcade.overlap(this.santa, this.obstacles, this.hitObstacle, null, this);
            game.physics.arcade.overlap(this.santa, this.gifts, this.hitGift, null, this);
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
        addGift: function()
        {
            if (this.pause) return;
            let index = Math.floor(Math.random() * 9) + 1;
            let x = screenWidth;
            let y = Math.floor(Math.random() * screenHeight);
            var gift = game.add.sprite(x, y, "gift" + index);
            gift.width = 50;
            gift.height = 50;
            this.gifts.add(gift);
            game.physics.arcade.enable(gift);
            gift.body.velocity.x = -170;
            gift.checkWorldBounds = true;
            gift.outOfBoundsKill = true;
        },
        hitGift: function(santa, gift)
        {
            if (this.santa.alive == false)
                return;
            gift.kill();
            this.score += 1;
            this.labelScore.text = this.score;
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
        hitObstacle: function() 
        {
            if (this.santa.alive == false)
                return;
            this.santa.alive = false;
            game.time.events.remove(this.obstacleTimer);
            game.time.events.remove(this.giftsTimer);
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
    
    