(function (){    
    const screenWidth = 540;
    const screenHeight = 720;
    const rowsCount = 10;

    const debugMode = false;
    
    const assetsFolder = "src/assets/";
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

            game.load.physics("physics", assetsFolder + "physics.json")
        },
        create: function()
        {
            

            this.game.physics.startSystem(Phaser.Physics.P2JS);

            this.game.physics.p2.setImpactEvents(true);

            this.santaCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this.obstacleCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this.giftCollisionGroup = this.game.physics.p2.createCollisionGroup();
            this.game.physics.p2.updateBoundsCollisionGroup();


            this.game.physics.p2.gravity.y = 1000;
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

            let santaScale = 0.2;
            this.santa = game.add.sprite(100,245, "santa");
            this.santa.anchor.setTo(0.6, 0.5);
            this.santa.scale.setTo(santaScale, santaScale); 
            this.game.physics.p2.enable(this.santa, debugMode);
            this.santa.body.kinematic = true;
            this.santa.alive = false;
            this.santa.body.fixedRotation = true;
            this.resizePolygon("physics", "santa_physics", "santa", santaScale);
            this.santa.body.clearShapes();
            this.santa.body.loadPolygon("santa_physics", "santa");
            this.santa.body.setCollisionGroup(this.santaCollisionGroup);
            this.santa.body.collideWorldBounds = false;
            this.santa.body.collides(this.obstacleCollisionGroup, this.hitObstacle, this);
            this.santa.body.collides(this.giftCollisionGroup, this.hitGift, this);

            this.obstacles = game.add.group();
            this.obstacleTimer = game.time.events.loop(2000, this.addObstacle, this);
            this.clouds = game.add.group();  
            this.addClouds(); 
            game.time.events.loop(1500, this.addCloud, this); 
            this.gifts = game.add.group();  
            this.giftsTimer = game.time.events.loop(1000, this.addGift, this);  

            

            var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(this.jump, this); 
            game.input.onDown.add(this.jump, this);
        },
        update: function()
        {
            this.city.tilePosition.x -= 0.15;
            if (this.santa.alive)
            {
                if (this.santa.angle < 20)
                    this.santa.angle += 1; 
                if (this.santa.body.angle < 20)
                    this.santa.body.angle += 1;
                this.santa.body.x = 100;
            }
            if (this.santa.y < 0 || this.santa.y > screenHeight)
                this.restartGame();
        },
        resizePolygon: function(originalPhysicsKey, newPhysicsKey, shapeKey, scale)
        {
            var newData = [];
            var data = this.game.cache.getPhysicsData(originalPhysicsKey, shapeKey);
            for (var i = 0; i < data.length; i++) {
                var vertices = [];
                for (var j = 0; j < data[i].shape.length; j += 2) {
                   vertices[j] = data[i].shape[j] * scale;
                   vertices[j+1] = data[i].shape[j+1] * scale; 
                }
                newData.push({shape : vertices});
            }
            var item = {};
            item[shapeKey] = newData;
            game.load.physics(newPhysicsKey, "", item);
        },
        jump: function() 
        {
            if (this.pause) this.resume();
            if (this.santa.alive == false) 
            {
                if (this.santa.body.kinematic == true)
                {
                    this.santa.body.dynamic = true;
                    this.santa.alive = true;
                }
                else return;
            }
            var animation = this.game.add.tween(this.santa.body);
            animation.to({angle: -20}, 100);
            animation.start();
            var animation2 = this.game.add.tween(this.santa);
            animation2.to({angle: -20}, 100);
            animation2.start();
            this.santa.body.velocity.y = -360;
        },
        restartGame: function() {
            game.state.start('main');
        },
        addClouds: function()
        {
            for (i = 0; i < 10; i++)
            {
                let index = Math.floor(Math.random() * 8) + 1;
                let x = Math.floor(Math.random() * screenWidth);
                let y = Math.floor(Math.random() * screenHeight / 2);
                let size = Math.floor(Math.random() * 25);
                var cloud = game.add.sprite(x, y, "cloud" + index);
                cloud.width = 75 + size;
                cloud.height = 75 + size;
                cloud.alpha = 0;
                this.game.add.tween(cloud).to( { alpha: 1 }, 1000, "Linear", true).start();
                this.clouds.add(cloud);
                game.physics.p2.enable(cloud);
                cloud.body.kinematic = true;
                cloud.body.collideWorldBounds = false;
                let speed = Math.floor(Math.random() * 20);
                cloud.body.velocity.x = speed - 50;
                cloud.checkWorldBounds = true;
                cloud.outOfBoundsKill = true;
            }
        },
        addCloud: function()
        {
            let index = Math.floor(Math.random() * 8) + 1;
            let y = Math.floor(Math.random() * screenHeight / 2);
            let size = Math.floor(Math.random() * 25);
            var cloud = game.add.sprite(screenWidth, y, "cloud" + index);
            cloud.width = 75 + size;
            cloud.height = 75 + size;
            cloud.alpha = 0;
            this.game.add.tween(cloud).to( { alpha: 1 }, 1000, "Linear", true).start();
            this.clouds.add(cloud);
            game.physics.p2.enable(cloud);
            cloud.body.kinematic = true;
            cloud.body.collideWorldBounds = false;
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
            let scale = 0.2;
            var gift = game.add.sprite(x, y, "gift" + index);
            gift.scale.setTo(scale, scale); 
            this.gifts.add(gift);
            this.game.physics.p2.enable(gift, debugMode);
            gift.body.velocity.x = -100; 
            gift.body.data.gravityScale = 0.0001;
            gift.body.collideWorldBounds = false;
            gift.body.setCollisionGroup(this.giftCollisionGroup);
            gift.body.collides([this.santaCollisionGroup, this.giftCollisionGroup]);
            gift.checkWorldBounds = true;
            gift.outOfBoundsKill = true;
            
            
        },
        hitGift: function(santa, gift)
        {
            console.log("hit gift");
            if (this.santa.alive == false)
                return;
            gift.destroy();
            this.score += 1;
            this.labelScore.text = this.score;
        },
        addObstacle: function()
        {
            if (this.pause) return;
            let x = screenWidth;
            let y = Math.floor(Math.random() * screenHeight);
            let scale = 0.3;
            var obstacle = game.add.sprite(x, y, "obstacle");
            obstacle.scale.setTo(scale, scale); 
            this.obstacles.add(obstacle);
            this.game.physics.p2.enable(obstacle, debugMode);
            this.resizePolygon("physics", "plane_physics", "plane", scale);
            obstacle.body.clearShapes();
            obstacle.body.loadPolygon("plane_physics", "plane");
            obstacle.body.velocity.x = -100; 
            obstacle.body.kinematic = true;
            obstacle.body.collideWorldBounds = false;
            obstacle.body.setCollisionGroup(this.obstacleCollisionGroup);
            obstacle.body.collides([this.santaCollisionGroup, this.obstacleCollisionGroup]);
            obstacle.checkWorldBounds = true;
            obstacle.outOfBoundsKill = true;
        },
        hitObstacle: function(santa, obstacle) 
        {
            if (this.santa.alive == false)
                return;
            this.santa.alive = false;
            game.time.events.remove(this.obstacleTimer);
            game.time.events.remove(this.giftsTimer);
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
    
    