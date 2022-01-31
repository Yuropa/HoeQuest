function loadGameContent() {
    var scale = window.devicePixelRatio;
    var width = window.innerWidth * scale;
    var height = window.innerHeight * scale;
    
    var graph = new RenderGraph();
    graph.resize(width, height, scale);
    
    const config = {
        type: Phaser.AUTO,
        
        scale: {
            parent: "body-root",
            mode: Phaser.Scale.FILL,
        },
        
        width: width,
        height: height,
        zoom: 1,
        resolution: scale,
        
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    const game = new Phaser.Game(config);
    
    window.addEventListener('resize', () => {
        setTimeout(resize, 500);
    });
    
    function preload () {
        this.load.image('background', 'background.jpg');
        
        for (let i = 0; i < 10; i++) { 
            this.load.image('house_' + i, 'houses/' + (i + 1) + '.png');
        }
    }

    var background;
    
    function resize() {
        width = window.innerWidth * scale;
        height = window.innerHeight * scale;
        graph.resize(width, height, scale);
        game.scale.resize(width, height);
    }
    
    function create () {
        hideContent();

        $("html").addClass('quest-fill-page');
        $("boody").addClass('quest-fill-page');
        
        
        background = this.add.image(0, 0, 'background');
        background.setOrigin(0, 0);
        
        var label1 = new GameLabel("donut-label");
        label1.text = "0";
        label1.label = "🍩";
        graph.add(label1);
        
        
        var label2 = new GameLabel("banana-label");
        label2.text = "0";
        label2.label = "🍌";
        label2.xOffset = scale * 140.0;
        graph.add(label2);
        
        // There's some hoes in this house
        
        var img1 = this.add.image(0, 0, 'house_' + getRandomInt(10));
        var img2 = this.add.image(0, 0, 'house_' + getRandomInt(10));
        
        var stack = new GameStack("house-stack", img1, img2);
        graph.add(stack);
        
//        for (let i = 0; i < 10; i++) { 
//            var name = 'house_' + i;
//            var x = getRandomInt(width);
//            var y = getRandomInt(height);
//            var angle = getRandomInt(60) - 30;
//            
//            var image = this.add.image(x, y, name);
//            var src = image.texture.getSourceImage();
//            var imageWidth = src.width;
//            var imageHeight = src.height;
//            
//            var imgScale = Math.min(50.0 / imageWidth, 50.0 / imageHeight);
//            
//            image
//                .setOrigin(0, 0)
//                .setScale(scale * imgScale)
//                .setRotation(angle * Math.PI / 180.0);
//        }
        
        // This shuold happen last
        graph.create(this);
    }
    

    function update() {
        background.setSize(width, height)
            .setScale(width);
        
        graph.update(this);
    }
}