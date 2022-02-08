class ImageLoader {
    count;
    dir;
    name;
    generator;
    
    constructor(count, dir) {
        this.count = count;
        this.dir = dir;
        this.name = dir;
        this.generator = new RandomGenerator(count);
    }
    
    preload(game) {
        for (let i = 0; i < this.count; i++) { 
            game.load.image(this.name + '_' + i, this.dir + '/' + (i + 1) + '.png');
        }
    }
    
    get (game, idx) {
        return game.add.sprite(0, 0, this.name + '_' + idx).setInteractive();
    }
    
    getRandom(game) {
        var index = this.generator.get();
        return this.get(game, index);
    }
}

var houseLoader = new ImageLoader(10, 'houses');
var donutLoader = new ImageLoader(8, 'donuts');
var bananaLoader = new ImageLoader(6, 'bananas');

function loadGameContent() {
    var scale = window.devicePixelRatio;
    var width = window.innerWidth * scale;
    var height = window.innerHeight * scale;
    var animatingGame = false;
    var totalCount = 0;
    var bananaCount = 0;
    var donuteCount = 0;
    
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
        this.load.image('blank', 'blank.png');
        
        this.load.image('top', 'labels/top.png');
        this.load.image('bottom', 'labels/bottom.png');
        this.load.image('vers', 'labels/vers.png');
        
        houseLoader.preload(this);
        donutLoader.preload(this);
        bananaLoader.preload(this);
    }

    var background;
    var set_index = [-1, -1];
    
    function resize() {
        width = window.innerWidth * scale;
        height = window.innerHeight * scale;
        graph.resize(width, height, scale);
        game.scale.resize(width, height);
    }
    
    function makeHouse(game, index, houseIndex) {
        var house = houseLoader.get(game, houseIndex);
        house.setData('house', house);
        house.setData('index', index);
        house.on('pointerdown', tint)
            .on('pointerup', function() {
            if (animatingGame) {
                return;
            }
            
            this.clearTint();
            
            set_index[index] = -1;
            showOverlap(game, index);
        })
            .on('pointerout', clearTint);
        set_index[index] = houseIndex;
        
        return house;
    }
    
    function showOverlap(game, index) {
        animatingGame = true;
        var sprite;
        if (getRandomInt(2) == 0) {
            // donut
            sprite = donutLoader.getRandom(game);
            
            var label = graph.get("donut-label");
            label.text = "" + (1 + parseInt(label.text));
            totalCount++;
            donuteCount++;
        } else {
            // banana
            sprite = bananaLoader.getRandom(game);
            
            var label = graph.get("banana-label");
            label.text = "" + (1 + parseInt(label.text));
            totalCount++;
            bananaCount++;
        }
        
        var container;
        var blank = game.add.sprite(0, 0, 'blank');
        if (index == 0) {
            container = new GameStack("house-overlay", sprite, blank);
        } else {
            container = new GameStack("house-overlay", blank, sprite);
        }
        
        var animation = new ScaleAnimation(container, 1000, -1, true, 'easeInOut');
        graph.add(container);
        
        graph.add(animation);
        animation.start();
        
        setTimeout(function() {
            animation.stop();
            
            animatingGame = false;
            
            
            if (totalCount >= 10) {
                clearContent();
                endGame(game);
            } else {
                updateHouseContent(game);
            }
        }, 3000);
    }
    
    function clearContent() {
        var old = graph.get("house-stack");
        if (old != undefined) {
            graph.remove(old);
        }
        
        var old_overlay = graph.get("house-overlay");
        if (old_overlay != undefined) {
            graph.remove(old_overlay);
        } 
    }
    
    function updateHouseContent(game) {
        clearContent();
        
        if (set_index[0] == -1) {
            set_index[0] = houseLoader.generator.getExcluding(set_index[1]);
        }
        
        if (set_index[1] == -1) {
            set_index[1] = houseLoader.generator.getExcluding(set_index[0]);
        }
        
        var img1 = makeHouse(game, 0, set_index[0]);
        var img2 = makeHouse(game, 1, set_index[1]);
        
        var stack = new GameStack("house-stack", img1, img2);
        graph.add(stack);
        
        resize();
    }
    
    function endGame(game) {
        var label = "vers";
        if (bananaCount > donuteCount) {
            label = "bottom";
        } else if (bananaCount < donuteCount) {
            label = "top";
        }
        
        var labelSprite = game.add.sprite(0, 0, label);
        var labelContainer = new CenterStack("labelContainer", labelSprite);
        graph.add(labelContainer);
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