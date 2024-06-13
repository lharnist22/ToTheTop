class startscene extends Phaser.Scene {
    constructor() {
        super("startclass");
    
    }

    preload(){
        this.load.setPath("./assets");
        this.load.image("title", "title_page.png");
    }

    create() {
        // Add the image to the center of the screen
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'title')
            .setOrigin(0.5, 0.5);

        // Set a timer to start the main game scene after 5 seconds (5000 milliseconds)
        this.time.delayedCall(5000, () => {
            this.scene.start('loadScene');
        }, [], this);
    }
}
