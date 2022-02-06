
var house_count = 10;

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}
var __index = undefined;
var __houseIndex = 0;

function randomHouse() {
    if (__index == undefined) {
        __index = [];
        for (var i = 0; i < house_count; i++) {
            __index.push(i);
        }
        
        __index = shuffle(__index);
    }
    
    var index = __index[__houseIndex];
    __houseIndex = (__houseIndex + 1) % house_count;
    return index;
}

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
        this.load.image('lyrics', 'lyrics.png');
        
        for (let i = 0; i < house_count; i++) { 
            this.load.image('house_' + i, 'houses/' + (i + 1) + '.png');
        }
    }

    var background;
    var set_index = [-1, -1];
    
    function getRandomExcluding(value, excluding) {
        var result = excluding;
        
        while(result == excluding) {
            result = randomHouse();
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
        }
        
        if (set_index[0] == -1) {
            set_index[0] = getRandomExcluding(set_index[1]);
        }
        
        if (set_index[1] == -1) {
            set_index[1] = getRandomExcluding(set_index[0]);
        }
        
        var img1 = makeHouse(game, 0, set_index[0]);
        var img2 = makeHouse(game, 1, set_index[1]);
        
        var stack = new GameStack("house-stack", img1, img2);
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
        
        
        var lyricsSprite = this.add.sprite(0, 0, 'lyrics');
        var lyrics = new CenterStack("lyrics", lyricsSprite);
        graph.add(lyrics);
        
        var scaleAnimation = new ScaleAnimation(lyrics, 1000, -1, true, 'easeInOut');
        graph.add(scaleAnimation);
        scaleAnimation.start();
        
        var g = this;
        setTimeout(function() {
            scaleAnimation.stop();
            
            graph.remove(scaleAnimation);
            graph.remove('lyrics');
            
            updateHouseContent(g);
        }, 6000);
        
        // This shuold happen last
        graph.create(this);
    }
    

    function update() {
        background.setSize(width, height)
            .setScale(width);
        
        graph.update(this);
    }
}