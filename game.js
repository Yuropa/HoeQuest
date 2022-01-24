function loadGameContent() {
    setTimeout(function() {
        var index = Math.floor(Math.random() * 10);
        var newContent = '<div style="position: relative; display: inline;"><img src="background.jpg" class="fill-image"><img src="houses/' + index + '.png" class="fill-image"></div>'
        
        $(newContent).appendTo('body')
        
        hideContent();
    }, 3000);
    
}