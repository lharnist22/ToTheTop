class endgame extends Phaser.Scene {
    constructor() {
        super("endgameclass");
     //   this.my = {
     //       audio: {}
     //   };
    }
   
    preload(){
        this.load.setPath("./assets");
    //   this.load.audio("BUTTON CLICK", "button_click_sound.m4a");
    }

    create() {
        let platformerScene = this.scene.get('platformerScene');
        let my = this.my;
          
        
            // Add "Game Over" text with pixelated font
            if(platformerScene.game_over){
            const gameOverText = this.add.text(500, 400, 'Game Over', {
                fontSize: '100px',
                fontFamily: 'Press Start 2P',
                fill: '#fff',
                
            }).setOrigin(0.5);
            gameOverText.setScale(5);
        //    my.audio.BUTTON_CLICK = this.sound.add("BUTTON CLICK");
        }
        
        else{
                const gameOverText = this.add.text(550, 150, 'You Won!', {
                    fontSize: '100px',
                    fontFamily: 'Press Start 2P',
                    fill: 'green',
                    
                }).setOrigin(0.5);
                gameOverText.setScale(5);

                const creditText = this.add.text(550, 350, 'Created by Luc Harnist and Alaaddin Ghosheh\n', {
                    fontSize: '100px',
                    fontFamily: 'Press Start 2P',
                    fill: 'white',
                    
                }).setOrigin(0.5);
                creditText.setScale(2);

    
        const Sources = this.add.text(550, 400, "Sources:\n",{
            fontSize: '100px',
                fontFamily: 'Press Start 2P',
                fill: 'white',
                
            }).setOrigin(0.5);
        const Sourcetext = this.add.text(550, 420, '\n Background song -- https://www.youtube.com/watch?v=1QIIqfHsUG0&list=PL008192B056905011&index=78 \nBg1 -- https://opengameart.org/content/simple-natural-landscape-pixel-art-background \nBg2 -- https://www.reddit.com/r/PixelArt/comments/q7kzyy/snowy_mountains \nBg3 -- https://slashdashgamesstudio.itch.io/cave-background-pixel-art \nBg4 -- https://www.reddit.com/r/PixelArt/comments/9tq85p/night_sky_drawing_from_a_while_back_3/', {
                fontSize: '100px',
                fontFamily: 'Press Start 2P',
                fill: 'white',
                
            }).setOrigin(0.5);
            Sourcetext.setScale(.75);

    
            const restartButton = this.add.text(550, 250, 'Restart', {
                fontSize: '300px',
                fontFamily: 'Press Start 2P',
                fill: '#fff',
                backgroundColor: '#4CAF50',
        
                padding: {
                    left: 40,
                    right: 40,
                    top: 10,
                    bottom: 10
                },
            }).setOrigin(0.5).setScale(2);
        
        
            
            restartButton.setInteractive();
        

            restartButton.on('pointerdown', () => {
                location.reload();
            });
        }
    }
}