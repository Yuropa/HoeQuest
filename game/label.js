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
        var textColor = '#f08f8e';
        
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