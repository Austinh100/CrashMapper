$( document ).ready(function() {
    console.log( "ready!" );
    console.log($(this).height());
    updateMaxHeight();

    var rtime = new Date(1, 1, 2000, 12,00,00);
    var timeout = false;
    var delta = 200;
    $(window).resize(function() {
        rtime = new Date();
        if (timeout === false) {
            timeout = true;
            setTimeout(resizeend, delta);
        }
    });
    
    function resizeend() {
        if (new Date() - rtime < delta) {
            setTimeout(resizeend, delta);
        } else {
            timeout = false;
            updateMaxHeight();
        }               
    }
    
    function updateMaxHeight () {
        console.log($(this).height());
        var parWidth = $("#backImg").parent().css("width");
        parWidth = parWidth.substring(0, parWidth.length - 2);
        $("#backImg").attr("src", buildGoogleURL($(this).height(), parWidth, "20", "king%20and%2031st,chicago,il"));
    }
    
    function buildGoogleURL(height, width, zoom, loc) {
        return "http://maps.googleapis.com/maps/api/staticmap?center="+loc+"&zoom="+zoom+"&size=" +height+"x"+width+"&sensor=false&style=feature:transit|element:all|visibility:off&style=feature:poi|element:all|visibility:off&style=feature:landscape|element:all|visibility:off&style=feature:administrative|element:all|visibility:off&scale=3&maptype=hybrid";
    }
    
});

var carToPlace = 0;

function mapClicked() {
    
    
    placeCar(carToPlace);
}

function carClicked(num) {
    $("#cars"+num).addClass("grayscale");
    carToPlace = num;
}

function placeCar(num) {
    if(carToPlace != 0) {
        
        $("#cars"+num).removeClass("grayscale");
    }
    carToPlace = 0;
}