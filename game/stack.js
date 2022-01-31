class GameStack extends RenderObject {
    first = undefined;
    second = undefined;

    constructor(name, first, second) {
        super(name);
        this.first = first;
        this.second = second;
    }

    position(game, width, height) {
        var padding = 0.0;
        var size = 0.0;
        
        if (width > height) {
            size = Math.min(width / 2.0, height);
        } else {
            size = Math.min(width, height / 2.0);
        }
        
        padding = 0.1 * size;
        size -= padding * 2.0;
        
        this.first.setDisplaySize(size, size);
        this.second.setDisplaySize(size, size);
        
        if (width > height) {
            this.first.setPosition(0.25 * width, 0.5 * height);
            this.second.setPosition(0.75 * width, 0.5 * height);
        } else {
            this.first.setPosition(0.5 * width, 0.25 * height);
            this.second.setPosition(0.5 * width, 0.75 * height);
        }
    }
}