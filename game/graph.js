function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

class RenderGraph {
    width = 0.0;
    height = 0.0;
    scale = 0.0;

    __objects = {};
    __animations = [];
    
    constructor() {}

    add(object) {
        if (object instanceof AnimationObject) {
            this.__animations.push(object);
            return;
        }
        
        console.assert(object.name.length > 0, "Object doesn't have a name");
        
        this.__objects[object.name] = object;
    }

    remove(object) {
        if (object instanceof AnimationObject) {
            var idx = this.__animations.indexOf(object);
            this.__animations.slice(idx, 1);
            return;
        }
        
        if (this.__objects.hasOwnProperty(object)) {
            var obj = this.__objects[object];
            obj.destroy();
            delete this.__objects[object];
            return;
        }
        
        console.assert(object.name.length > 0, "Object doesn't have a name");
        object.destroy();
        delete this.__objects[object.name];
    }

    get(key) {
        console.assert(key.length > 0, "Provide a key");
        
        return this.__objects[key];
    }
    
    create(g) { 
        for(var key in this.__objects) {
            var item = this.__objects[key];

            item.scale = this.scale;
            item.create(g);
            item.position(g, this.width, this.height);
            item.update(g);
        }
    }
    
    update(g) { 
        var seconds = new Date().getTime();
        
        for(var key in this.__objects) {
            var item = this.__objects[key];
            
            item.position(g, this.width, this.height);
            item.update(g);
        }
        
        for (var idx in this.__animations) {
            var animation = this.__animations[idx];
            animation.update(g, seconds);
        }
    }

    resize(width, height, scale) {
        this.width = width;
        this.height = height;
        this.scale = scale;
    }
}

class RenderObject {
    scale = 0.0;
    name = "";
        
    constructor(name) {
        this.name = name;
    }
    
    create(game) { }
    
    position(game, width, height) { }
    
    update(game) { }

    destroy() { }
}
