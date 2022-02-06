class RandomGenerator {
    __index = undefined;
    __itemIndex = 0;
    count;

    constructor(count) {
        this.count = count;
        
        this.__index = [];
        for (var i = 0; i < this.count; i++) {
            this.__index.push(i);
        }
        
        this.shuffle();
    }

    __shuffle(array) {
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

    shuffle() {
        this.__index = this.__shuffle(this.__index);
    }

    get() {
        var index = this.__index[this.__itemIndex];
        this.__itemIndex = (this.__itemIndex + 1);
        
        if (this.__itemIndex >= this.count) {
            this.__itemIndex = 0;
            this.shuffle();
        }
        
        return index;
    }

    getExcluding(excluding) {
        var result = excluding;
        
        while(result == excluding) {
            result = this.get();
        }
        
        return result;
    }

}