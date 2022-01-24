function loadGameContent() {
    setTimeout(function() {
        var index = Math.floor(Math.random() * 10) + 1;
        var newContent = '<div style="position: relative; display: inline;"><img src="background.jpg" class="quest-fill-image quest-fill-image-fill"><img src="houses/' + index + '.png" class="quest-fill-image"></div>'
        
        $(newContent).appendTo('body')
        
        hideContent();
    }, 3000);
    
}