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
        this.load.image("bg1", "assets/orig.png");
        this.load.image("bg2", "assets/bg2.jpg");
        this.load.image("bg3", "assets/bg3.png");
        this.load.image("bg4", "assets/bg4.png");
        
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
        this.bg1 = this.add.image(-300, 3000, 'bg1').setOrigin(0).setScale(8);
        this.bg2 = this.add.image(-300, -100, 'bg2').setOrigin(0).setScale(.55);
        this.bg3 = this.add.image(-300, 1600, 'bg3').setOrigin(0).setScale(2);  
        //this.bg3 = this.add.image(0, 3100, 'bg4').setOrigin(0).setScale(.2);          // Add a tileset to the map
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
        // 635, 5205,
        my.sprite.player = this.physics.add.sprite(635, 5205, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);

        //set up NPCS

        //Sprite #1 
        my.sprite.npc1 = this.add.sprite(485, 5100, "platformer_characters", "tile_0004.png").setScale(1.25);
        my.sprite.npc1_collider = this.add.sprite(485, 5100, "platformer_characters", "tile_0004.png").setScale(3)
        my.sprite.npc1_collider.visible = false;
        this.npc1_text = ['Erm, hi.. Welcome to ToTheTop', 'What is the objective of this game you say?', '...', "I mean its pretty self-explanatory\n if you ask me. You gotta make it to the top.", "Press the jump key (^) \n for a longer period to jump higher!", "Good Luck..", "Why are you still here? To The Top with you!"];
        this.speech = 0;
        this.npc1_turn = true;
        this.npc1_instruction_shown = false;
        this.instructionText;

        //Sprite #2
        my.sprite.npc2 = this.add.sprite(660, 2778, "platformer_characters", "tile_0003.png").setScale(1.25);
        my.sprite.npc2_collider = this.add.sprite(660, 2778, "platformer_characters", "tile_0003.png").setScale(3)
        my.sprite.npc2_collider.visible = false;
        this.npc2_text = ['Howdy partner! Welcome to the Mushroom Caves!', 'These caves are quite spectacular,\n as you can see there are plenty of\n mushrooms around', '...', "Well, I guess you gotta keep climbing\n But please! Do make yourself at home.\n We don't get many visitors around here."];
        this.speech2 = 0;
        this.npc2_turn = true;
        this.npc2_instruction_shown = false;
        this.instructionText2;

        //Sprite #3
        my.sprite.npc3 = this.add.sprite(750, 1302, "platformer_characters", "tile_0006.png").setScale(1.25);
        my.sprite.npc3_collider = this.add.sprite(750, 1302, "platformer_characters", "tile_0003.png").setScale(3)
        my.sprite.npc3_collider.visible = false;
        this.npc3_text = ["You're almost there man!", 'Be careful though,\n these clouds can be a bit problematic ... \n Especially that last one...'];
        this.speech3 = 0;
        this.npc3_turn = true;
        this.npc3_instruction_shown = false;
        this.instructionText3;


        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        
        this.cameras.main.startFollow(my.sprite.player, true, 0.1, 0.1);
        this.cameras.main.setScroll(my.sprite.player.x, my.sprite.player.y);
        this.cameras.main.setZoom(1.2);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // set up Phaser-provided cursor key input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.down_key_handled = false; // Flag to handle single key press
        this.canCheckKey = true; // Flag to allow key checking

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // Other create method code...

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

        if(my.sprite.player.y <= 96 && my.sprite.player.body.blocked.down){
            this.scene.start('endgameclass');
            this.music.stop();
        }
      
        console.log("x" + my.sprite.player.x);
        console.log("y" + my.sprite.player.y);
        
        if(this.cursors.left.isDown) {
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            this.bg1.x += 0.5;
            this.bg2.x += 0.5;
            this.bg3.x += 0.5;
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
            this.bg1.x -= 0.5;
            this.bg2.x -= 0.5;
            this.bg3.x -= 0.5;
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
        if (this.collides(my.sprite.player, my.sprite.npc1_collider) && this.npc1_turn === true) {
            if (this.npc1_instruction_shown === false) {
                this.instructionText = this.add.text(470, 5020, 'Press \'DOWN (v)\' to interact', { fontsize: '4px', fill: '#fff' });
                this.npc1_instruction_shown = true;
            }
            if (this.cursors.down.isDown && this.canCheckKey) {
                this.handleDialogue();
                this.canCheckKey = false; // Prevent immediate re-check
                this.time.delayedCall(1000, () => {
                    this.canCheckKey = true;
                }, [], this);
            }
        }

        //Sprite #2 text

        if (this.collides(my.sprite.player, my.sprite.npc2_collider) && this.npc2_turn === true) {
            if (this.npc2_instruction_shown === false) {
                this.instructionText2 = this.add.text(500, 2680, 'Press \'DOWN (v)\' to interact', { fontsize: '4px', fill: '#fff' });
                this.npc2_instruction_shown = true;
            }
            if (this.cursors.down.isDown && this.canCheckKey) {
                this.instructionText2.destroy();
                if (this.dialogueText2) {
                    this.dialogueText2.destroy();
                }
                this.dialogueText2 = this.add.text(500, 2680, this.npc2_text[this.speech2], { fontSize: '15px', fill: '#fff' });
                if (this.speech2 < this.npc2_text.length) {
                    this.speech2 += 1;
                } else {
                    this.speech2 = 0; // Reset the dialogue index if needed
                    this.dialogueText2.destroy(); // Destroy the last dialogue text
                //    this.instructionText.setText('Dialogue ended.');
                    this.npc2_turn = false;
                }
                //this.handleDialogue();
                this.canCheckKey = false; // Prevent immediate re-check
                this.time.delayedCall(1000, () => {
                    this.canCheckKey = true;
                }, [], this);
            }
        }

        //Sprite #3 text
        
        if (this.collides(my.sprite.player, my.sprite.npc3_collider) && this.npc3_turn === true) {
            if (this.npc3_instruction_shown === false) {
                this.instructionText3 = this.add.text(400, 1200, 'Press \'DOWN (v)\' to interact', { fontsize: '4px', fill: '#fff' });
                this.npc3_instruction_shown = true;
            }
            if (this.cursors.down.isDown && this.canCheckKey) {
                this.instructionText3.destroy();
                if (this.dialogueText3) {
                    this.dialogueText3.destroy();
                }
                this.dialogueText3 = this.add.text(400, 1200, this.npc3_text[this.speech3], { fontSize: '15px', fill: '#fff' });
                if (this.speech3 < this.npc2_text.length) {
                    this.speech3 += 1;
                } else {
                    this.speech3 = 0; // Reset the dialogue index if needed
                    this.dialogueText3.destroy(); // Destroy the last dialogue text
                //    this.instructionText.setText('Dialogue ended.');
                    this.npc3_turn = false;
                }
                //this.handleDialogue();
                this.canCheckKey = false; // Prevent immediate re-check
                this.time.delayedCall(1000, () => {
                    this.canCheckKey = true;
                }, [], this);
            }
        }
     
    }

    handleDialogue() {
        this.instructionText.destroy();
        if (this.dialogueText) {
            this.dialogueText.destroy();
        }

        this.dialogueText = this.add.text(485, 5000, this.npc1_text[this.speech], { fontSize: '15px', fill: '#fff' });

        if (this.speech < this.npc1_text.length) {
            this.speech += 1;
        } else {
            this.speech = 0; // Reset the dialogue index if needed
            this.dialogueText.destroy(); // Destroy the last dialogue text
        //    this.instructionText.setText('Dialogue ended.');
            this.npc1_turn = false;
        }
    }
    

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth / 2 + b.displayWidth / 2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight / 2 + b.displayHeight / 2)) return false;
        return true;
    }
}