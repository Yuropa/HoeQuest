class AnimationObject {
    _startTime = undefined;
    _started = false;
    _timing;
    
    target;
    duration;
    repeat = 1;
    autoReverse = false;
        
    constructor(target, duration, repeat = 1, autoReverse = false, timing = 'linear') {
        this.target = target;
        this.duration = duration;
        this.repeat = repeat;
        this.autoReverse = autoReverse;
        
        if (timing == 'easeInOut') {
            this._timing = function(t) {
                if (t <= 0.5) {
                    return 2.0 * t * t;
                }
            
                t -= 0.5;
                return 2.0 * t * (1.0 - t) + 0.5;
            };
        } else {
            this._timing = function(x) { return x; };
        }
    }
    
    update(game, time) { 
        if (this._started) {
            this._started = false;
            this._startTime = time;
        }
        
        var start = this._startTime;
        if (start == undefined) {
            return;
        }
        
        var dt = time - start;
        var progress = this._resolveProgress(dt);
        progress = this._timing(progress);
        this._update(this.target, progress);
    }

    _resolveProgress(dt) {
        var count = Math.floor(dt / this.duration);
        if (this.repeat >= 0 && this.repeat < count) {
            this._startTime = undefined;
            return 0.0;
        }
        
        var remainder = Number((dt - (count * this.duration)).toPrecision(8));
        var progress = remainder / this.duration;
        
        if (this.autoReverse && (count % 2) == 1) {
            progress = 1.0 - progress;
        }
        
        return progress;
    }

    _update(target, progress) {
        
    }

    start() { 
        if (this._startTime != undefined) {
            return;
        }
        
        this._started = true;
    }

    stop() {
        if (this._startTime == undefined) {
            return;
        }
        
        this._startTime = undefined;
    }
}

class ScaleAnimation extends AnimationObject {
    _update(target, progress) {
        this.target.scale = 1.0 + progress * 0.2;
    }
}