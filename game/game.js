
var house_count = 10;

function loadGameContent() {
    var scale = window.devicePixelRatio;
    var width = window.innerWidth * scale;
    var height = window.innerHeight * scale;
    
    var graph = new RenderGraph();
    graph.resize(width, height, scale);
    
    const config = {
        type: Phaser.WEBGL,
        
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
    
    function tint () {
        this.setTint(0x979797);
    }

    function clearTint () {
        this.clearTint();
    }

    const game = new Phaser.Game(config);
    
    window.addEventListener('resize', () => {
        setTimeout(resize, 100);
    });
    
    function preload () {
        this.load.image('background', 'background.jpg');
        
        for (let i = 0; i < house_count; i++) { 
            this.load.image('house_' + i, 'houses/' + (i + 1) + '.png');
        }
    }

    var background;
    var set_index = [-1, -1];
    
    function getRandomExcluding(value, excluding) {
        var result = excluding;
        
        while(result == excluding) {
            result = getRandomInt(value);
        }
        
        return result;
    }
    
    function resize() {
        width = window.innerWidth * scale;
        height = window.innerHeight * scale;
        graph.resize(width, height, scale);
        game.scale.resize(width, height);
    }
    
    function makeHouse(game, index, houseIndex) {
        var house = game.add.sprite(0, 0, 'house_' + houseIndex).setInteractive();
        house.setData('house', house);
        house.setData('index', index);
        house.on('pointerdown', tint)
            .on('pointerup', function() {
            this.clearTint();
            
            set_index[index] = -1;
            updateHouseContent(game);
        })
            .on('pointerout', clearTint);
        set_index[index] = houseIndex;
        
        return house;
    }
    
    function updateHouseContent(game) {
        var old = graph.get("house-stack");
        if (old != undefined) {
            graph.remove(old);
            old.first.destroy();
            old.second.destroy();
        }
        
        if (set_index[0] == -1) {
            set_index[0] = getRandomExcluding(house_count, set_index[1]);
        }
        
        if (set_index[1] == -1) {
            set_index[1] = getRandomExcluding(house_count, set_index[0]);
        }
        
        var img1 = makeHouse(game, 0, set_index[0]);
        var img2 = makeHouse(game, 1, set_index[1]);
        
        var stack = new GameStack("house-stack", img1, img2, img1.width / img1.height, img2.width / img2.height);
        graph.add(stack);
        
        resize();
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
        
//        this.input.on('pointerdown', function (pointer, gameObject) {
//            
//        });
        
        // There's some hoes in this house
        
        updateHouseContent(this);
        
//        var g = this;
//        this.input.on('pointerdown', function (pointer, gameObjects) {
//            var value = gameObjects[0].getData('index');
//            if (value == undefined) {
//                return;
//            }
//            
//            set_index[value] = -1;
//            updateHouseContent(g);
//        });
        
        
//        for (let i = 0; i < house_count; i++) { 
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