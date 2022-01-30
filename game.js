function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

class RenderObject {
    scale = 0.0;
        
    constructor() {}
    
    create(game) { }
    
    position(game, width, height) { }
    
    update(game) { }
} 

class GameLabel extends RenderObject {
    text = "";
    label = "";
    xOffset = 0;
    __loadedText = "";
    __loadedLabel = "";

    __labelView;
    __textView;
    __container;
    __totalWidth;
    __totalHeight;

    create(game) {
        var iconFontSize = 20.0 * this.scale;
        var height = 24.0 * this.scale;
        var firstRadius = 17.0 * this.scale;
        var mainWidth = 70.0 * this.scale;
        var fontSize = 18.0 * this.scale;
        var contentOverlap = 5.0 * this.scale;
        var smallRadius = height / 2.0;
        var backgroundColor = 0xffdfdf;
        var textColor = '#000000';
        
        var totalWidth = firstRadius * 2.0 + mainWidth + smallRadius;
        var overlap = firstRadius;
        
        var largeCircle = game.add.ellipse(firstRadius, firstRadius, firstRadius * 2.0, firstRadius * 2.0, backgroundColor);
        var smallCircle = game.add.ellipse(totalWidth - smallRadius, firstRadius, smallRadius * 2.0, smallRadius * 2.0, backgroundColor);
        var rectangle = game.add.rectangle(firstRadius * 2.0 + mainWidth / 2.0 - overlap / 2.0, firstRadius, mainWidth + overlap, height, backgroundColor);
        
        this.__textView = game.add.text(firstRadius * 2.0 + mainWidth, firstRadius, "");
        this.__labelView = game.add.text(firstRadius - iconFontSize / 2.0, firstRadius - iconFontSize / 2.0, "");
        
        this.__labelView.setFontSize(iconFontSize);
        this.__labelView.setColor(textColor);
        this.__labelView.setAlign('center');
        
        this.__textView.setFont('Sono');
        this.__textView.setAlign('right');
        this.__textView.setOrigin(1.0, 0.5);
        this.__textView.setFontSize(fontSize);
        this.__textView.setColor(textColor);
        
        this.__container = game.add.container(0, 0, [largeCircle, smallCircle, rectangle, this.__textView, this.__labelView]);
        this.__totalWidth = totalWidth;
        this.__totalHeight = firstRadius * 2.0;
    }

    update(game) { 
        if (this.text != this.__loadedText) {
            this.__loadedText = this.text;
            this.__textView.setText(this.text);
        }
        
        
        if (this.label != this.__loadedLabel) {
            this.__loadedLabel = this.label;
            this.__labelView.setText(this.label);
        }
    }

    position(game, width, height) {
        var padding = 10.0 * this.scale;
        this.__container.setPosition(width - padding - this.xOffset - this.__totalWidth, padding);
    }
}

function loadGameContent() {
    var scale = window.devicePixelRatio;
    var width = window.innerWidth * scale;
    var height = window.innerHeight * scale;
    
    var gameObjects = []
    
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
        game.scale.resize(width, height);
    }
    
    function create () {
        hideContent();

        $("html").addClass('quest-fill-page');
        $("boody").addClass('quest-fill-page');
        
        
        background = this.add.image(0, 0, 'background');
        background.setOrigin(0, 0);
        
        var label1 = new GameLabel();
        label1.text = "456";
        label1.label = "🍩";
        gameObjects.push(label1);
        
        var label2 = new GameLabel();
        label2.text = "123";
        label2.label = "🍌";
        label2.xOffset = scale * 140.0;
        gameObjects.push(label2);
        
        // There's some hoes in this house
        
        for (let i = 0; i < 10; i++) { 
            var name = 'house_' + i;
            var x = getRandomInt(width);
            var y = getRandomInt(height);
            var angle = getRandomInt(60) - 30;
            
            var image = this.add.image(x, y, name);
            var src = image.texture.getSourceImage();
            var imageWidth = src.width;
            var imageHeight = src.height;
            
            var imgScale = Math.min(50.0 / imageWidth, 50.0 / imageHeight);
            
            image
                .setOrigin(0, 0)
                .setScale(scale * imgScale)
                .setRotation(angle * Math.PI / 180.0);
        }
        
        // This shuold happen last
        var g = this;
        gameObjects.forEach(function (item, index) {
            item.scale = scale;
            item.create(g);
            item.position(g, width, height);
            item.update(g);
        });
    }
    

    function update() {
        background.setSize(width, height)
            .setScale(width);
        
        
        var g = this;
        gameObjects.forEach(function (item, index) {
            item.position(g, width, height);
            item.update(g);
        });
    }
}