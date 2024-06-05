class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    preload(){
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
        this.load.atlas('smoke', 'assets/Smoke/smoke.png', 'assets/Smoke/smoke.json');
        this.load.audio("jump", "assets/sound1.mp3");
        this.load.audio("bg", "assets/Seashells.mp3");
        this.load.audio("walking", "assets/walking.mp3");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 400;
        this.DRAG = 50000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 900;
        this.JUMP_VELOCITY = -600;
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("Level1", 18, 18, 60, 1225);
        this.physics.world.setBounds(0,0, this.map.widthInPixels, this.map.heightInPixels);
        this.is_jumping = false;
        this.additional_jump = 0;
        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");

        // Create a layer test
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        //Animating tiles
        this.animatedTiles.init(this.map);

        // set up player
        my.sprite.player = this.physics.add.sprite(635, 5205, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.1, 0.1);
        this.cameras.main.setScroll(my.sprite.player.x, my.sprite.player.y);
        this.cameras.main.setZoom(1.3);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // set up Phaser-provided cursor key input
        this.cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);
        this.music = this.sound.add("bg", {
            loop: true
        });
        this.music.play();
        this.walking = this.sound.add("walking", {
            volume: 2,
            loop: true
        });
    }

    update() {
        if(my.sprite.player.x >= 2400){
            this.add.text(2355, 60, 'You win!');
            this.won = true;
        }
        
        if(this.cursors.left.isDown) {
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            if(my.sprite.player.body.blocked.down){
                this.add.particles(my.sprite.player.x + 5, my.sprite.player.y + 10, 'smoke', {
                    frame: 'smoke_01.png',
                    scale: 0.03,
                    duration: 1,
                    lifespan: 100
                });
            }
            if(my.sprite.player.body.blocked.down && this.isWalking === false){
                this.walking.play();
                this.isWalking = true;
            }
            
    
        } else if(this.cursors.right.isDown) {
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            if(my.sprite.player.body.blocked.down){
                this.add.particles(my.sprite.player.x - 5, my.sprite.player.y + 10, 'smoke', {
                    frame: 'smoke_01.png',
                    scale: 0.03,
                    duration: 1,
                    lifespan: 100
                });
            }
            if(my.sprite.player.body.blocked.down && this.isWalking === false){
                this.walking.play();
                this.isWalking = true;
            }
    
        } else {
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
    
            my.sprite.player.anims.play('idle');
            this.isWalking = false;
            this.walking.stop();
            
        }
    
        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
            this.walking.stop()
            
        }
        if(my.sprite.player.body.blocked.down && this.cursors.up.isDown) {
            console.log("Hello");
            this.is_jumping = true;
        }
    
        if(this.is_jumping === true && my.sprite.player.body.blocked.down){
            if(this.cursors.up.isDown){
                console.log("loading up jump");
                console.log(this.additional_jump);
                if(this.additional_jump >= -300){
                this.additional_jump -= 10;
                console.log(this.additional_jump);
            }
        }
            else{
                console.log("time to jump!");
                this.sound.play("jump");
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY + this.additional_jump);
                console.log("jumping");
                this.add.particles(my.sprite.player.x - 5, my.sprite.player.y + 10, 'smoke', {
                    frame: 'smoke_03.png',
                    scale: 0.2,
                    duration: 10,
                    lifespan: 100
                }); 
                this.is_jumping = false;
                this.additional_jump = 0;
            }
        }
    }

    }

