class GameStack extends RenderObject {
    first = undefined;
    second = undefined;
    firstAspectRatio = 1.0;
    secondAspectRatio = 1.0;

    constructor(name, first, second, firstAspectRatio = 1.0, secondAspectRatio = 1.0) {
        super(name);
        this.first = first;
        this.second = second;
        this.firstAspectRatio = firstAspectRatio;
        this.secondAspectRatio = secondAspectRatio;
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
        
        this.updateSize(size, this.first, this.firstAspectRatio);
        this.updateSize(size, this.second, this.secondAspectRatio);
        
        if (width > height) {
            this.first.setPosition(0.25 * width, 0.5 * height);
            this.second.setPosition(0.75 * width, 0.5 * height);
        } else {
            this.first.setPosition(0.5 * width, 0.25 * height);
            this.second.setPosition(0.5 * width, 0.75 * height);
        }
    }

    updateSize(size, object, aspectRatio) {
        if (aspectRatio > 1.0) {
            object.setDisplaySize(size, size / aspectRatio);
        } else {
            object.setDisplaySize(size * aspectRatio, size);
        }
        
    }
}