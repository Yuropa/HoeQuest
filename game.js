function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function loadGameContent() {
    var width = 800;
    var height = 600;
    const config = {
        parent: "body-root",
        
        scale: {
            // Or set parent divId here
            parent: "body-root",

            mode: Phaser.Scale.ENVELOP,
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        
        antialias: true,
        type: Phaser.AUTO,
        width: width,
        height: height,
        autoRound: false,
        roundPixels: false,
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    const game = new Phaser.Game(config);
    
    function preload ()
    {
        this.load.image('background', 'background.jpg');
        
        for (let i = 0; i < 10; i++) { 
            this.load.image('house_' + i, 'houses/' + (i + 1) + '.png');
        }
    }

    function create ()
    {
        hideContent();

        $("html").addClass('quest-fill-page');
        $("boody").addClass('quest-fill-page');
        
        this.add.image(0, 0, 'background')
            .setOrigin(0, 0)
            .setSize(width, height);
        
        for (let i = 0; i < 10; i++) { 
            var name = 'house_' + i;
            var x = getRandomInt(width);
            var y = getRandomInt(height);
            var angle = getRandomInt(60) - 30;
            
            var image = this.add.image(x, y, name);
            var src = image.texture.getSourceImage();
            var imageWidth = src.width;
            var imageHeight = src.height;
            
            var scale = Math.min(50.0 / imageWidth, 50.0 / imageHeight);
            
            image
                .setOrigin(0, 0)
                .setScale(scale)
                .setRotation(angle * Math.PI / 180.0);
        }
    }
    

    function update ()
    {
        
    }
}