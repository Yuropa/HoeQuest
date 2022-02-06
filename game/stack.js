// , img2.width / img2.height

function __updateSize(size, object, aspectRatio) {
    if (aspectRatio > 1.0) {
        object.setDisplaySize(size, size / aspectRatio);
    } else {
        object.setDisplaySize(size * aspectRatio, size);
    }

}

function __getAspectRatio(obj, ratio) {
    if (ratio != undefined) {
        return ratio
    }
    
    if ('width' in obj && 'height' in obj) {
        return obj.width / obj.height;
    }
    
    return 1.0;
}

class GameStack extends RenderObject {
    first = undefined;
    second = undefined;
    firstAspectRatio = 1.0;
    secondAspectRatio = 1.0;

    constructor(name, first, second, firstAspectRatio, secondAspectRatio) {
        super(name);
        this.first = first;
        this.second = second;
        this.firstAspectRatio = __getAspectRatio(first, firstAspectRatio);
        this.secondAspectRatio = __getAspectRatio(second, secondAspectRatio);
    }

    destroy() {
        this.first.destroy();
        this.second.destroy();
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
        
        __updateSize(size, this.first, this.firstAspectRatio);
        __updateSize(size, this.second, this.secondAspectRatio);
        
        if (width > height) {
            this.first.setPosition(0.25 * width, 0.5 * height);
            this.second.setPosition(0.75 * width, 0.5 * height);
        } else {
            this.first.setPosition(0.5 * width, 0.25 * height);
            this.second.setPosition(0.5 * width, 0.75 * height);
        }
    }
}

class CenterStack extends RenderObject {
    first = undefined;
    firstAspectRatio = 1.0;
    scale = 1.0;

    constructor(name, first, firstAspectRatio) {
        super(name);
        this.first = first;
        this.firstAspectRatio = __getAspectRatio(first, firstAspectRatio);
    }

    destroy() {
        this.first.destroy();
    }

    position(game, width, height) {
        var size = 0.0;
        
        if (width > height) {
            size = Math.min(width, height);
        } else {
            size = Math.min(width, height);
        }
        
        size *= this.scale;
        
        __updateSize(size, this.first, this.firstAspectRatio);
        this.first.setPosition(0.5 * width, 0.5 * height);
    }

    updateSize(size, object, aspectRatio) {
        if (aspectRatio > 1.0) {
            object.setDisplaySize(size, size / aspectRatio);
        } else {
            object.setDisplaySize(size * aspectRatio, size);
        }
        
    }
}