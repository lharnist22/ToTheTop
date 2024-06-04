class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    preload(){
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
        this.load.atlas('smoke', 'assets/Smoke/smoke.png', 'assets/Smoke/smoke.json');
        this.load.audio("jump", "assets/sound1.mp3");
        this.load.audio("bg", "assets/Ufouria.mp3");
        this.load.audio("walking", "assets/walking.mp3");
        this.load.image("bg", "assets/orig.png");
        this.load.image("bg2", "assets/bg2.jpg");
        this.load.image("bg3", "assets/bg3.png");
        this.load.image("bg4", "assets/bg4.png");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 400;
        this.DRAG = 50000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 900;
        this.JUMP_VELOCITY = -1000;
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("Level1", 18, 18, 60, 1225);
        this.physics.world.setBounds(0,0, this.map.widthInPixels, this.map.heightInPixels);
        this.is_jumping = false;

        //Background
        this.bg1 = this.add.image(0, 4105, 'bg').setOrigin(0).setScale(3);
        this.bg2 = this.add.image(0, 0, 'bg2').setOrigin(0).setScale(.35);
        this.bg3 = this.add.image(0, 2000, 'bg3').setOrigin(0).setScale(1);
        this.bg4 = this.add.image(0, 3525, 'bg4').setOrigin(0).setScale(.25);
        

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
        this.cameras.main.setZoom(1.1);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

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
        console.log(my.sprite.player.x);
        console.log(my.sprite.player.y);
        if(my.sprite.player.x >= 2400){
            this.add.text(2355, 60, 'You win!');
            this.won = true;
        }
        
        if(cursors.left.isDown) {
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
            

        } else if(cursors.right.isDown) {
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
        while(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            console.log("Hello");
            this.is_jumping = true;
            this.JUMP_VELOCITY += 1;
         /*   this.sound.play("jump");
            
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.add.particles(my.sprite.player.x - 5, my.sprite.player.y + 10, 'smoke', {
                frame: 'smoke_03.png',
                scale: 0.2,
                duration: 10,
                lifespan: 100
            }); */
        }

        if(my.sprite.player.body.blocked.down && !Phaser.Input.Keyboard.JustDown(cursors.up) && this.is_jumping == true){
                this.sound.play("jump");
            
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.add.particles(my.sprite.player.x - 5, my.sprite.player.y + 10, 'smoke', {
                frame: 'smoke_03.png',
                scale: 0.2,
                duration: 10,
                lifespan: 100
            }); 
            this.is_jumping = false;
        }
        
    }
}