var draw;
var image;
var mouseLine;
var line = false;
var activeCar;
var mouseX = 0;
var mouseY = 0;
var curLine;
var hoverCar;

$( document ).ready(function() {
    console.log( "ready!" );
    console.log($(this).height());
    
    draw = SVG('backImg')
    
    console.log($(this).innerHeight());
    var parWidth = $("#mapContainer").css("width");
    parWidth = parWidth.substring(0, parWidth.length - 2);
    image = draw.image(buildGoogleURL($(this).height(), parWidth, "20", "king%20and%2031st,chicago,il")).loaded(function(loader) {
          this.size(loader.width, loader.height)
    });
    
    $("#searchForm input").css('width', parWidth * .6);
    
    
    
    
  /*  
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
    
    function updateMaxHeight() {
        console.log($(this).innerHeight());
        var parWidth = $("#mapContainer").css("width");
        parWidth = parWidth.substring(0, parWidth.length - 2);
        image.replace(draw.image(buildGoogleURL($(this).height(), parWidth, "20", "king%20and%2031st,chicago,il")).loaded(function(loader) {
              this.size(loader.width, loader.height)
        }));
    }*/
    
    
    $("#backImg").mousemove(function(e){
        var wrapper = $(this).parent();
        var parentOffset = wrapper.offset(); 
        var relX = e.pageX - parentOffset.left + wrapper.scrollLeft();
        var relY = e.pageY - parentOffset.top + wrapper.scrollTop();
        
        mouseX = relX;
        mouseY = relY;
        
        if(line) {
            mouseLine.plot(mouseLine.x1, mouseLine.y1, mouseX, mouseY);
        }
    });
    
    $("#backImg").click(function(e){
        if(line) {
            var angle = calcAngle(curLine.x1, curLine.y1, mouseX, mouseY);
            mapCars[activeCar].image.rotate(angle);
            mapCars[activeCar].number.rotate(angle, curLine.x1, curLine.y1);
            console.log(angle);
            line = false;
            mouseLine.remove();
        } else {
            placeCar(carToPlace,mouseX,mouseY);
        }
    });
    
    $("#saveImage").click(function(e) {
        canvg('canvas', $('#backImg').html(), { ignoreMouse: true, ignoreAnimation: true });

        // the canvas calls to output a png
        var canvas = document.getElementById("canvas");
        var img = $('canvas').get(0).toDataURL("img/jpeg");
        
        var parWidth = $("#mapContainer").css("width");
        parWidth = parWidth.substring(0, parWidth.length - 2);
        $.slimbox(img);
        
    });
});

var carToPlace = 0;
var mapCars = [];

function carClicked(num) {
    $("#cars"+num).addClass("grayscale");
    carToPlace = num;
}

function placeCar(num, x, y) {
    if(carToPlace != 0) {
        newMapCar(carToPlace, x, y);
        $("#cars"+num).removeClass("grayscale");
    }
    carToPlace = 0;
}

function mapCarPlaced(num) {
    
}

function newMapCar(num, x, y) {
    mapCars.push({ 
        'image': draw.image('img/car'+num+'.png').x(x-30).y(y-15), 
        'number': draw.text(num+"").x(x-9).y(y-15),
        'type': num });
    mouseLine = draw.line(x, y, mouseX, mouseY).stroke({ width: 3 })
    curLine = {
        x1: x,
        y1: y
    };
    activeCar = mapCars.length-1;
    line = true;
    return 'carms'+num;
}

/*
function newMapCar(num, x, y) {
    $("#mapContainer").append('<a id="carid'+mapCars.length+'" href="#" id="mapCarCopy" onclick="mapCarClicked('+num+')"><div class="carm'+num+'" style="position:absolute;top:0;left:0;"></div></a>');
    $("#carid"+mapCars.length+" div").css({
        left: x-30,
        top: y-15
    });
    mapCars.push({cartNum: carToPlace, rotation: 0});
    return 'carms'+num;
}*/

function addArrow() {

}

function calcAngle(x1, y1, x2, y2) {
    var p1 = {
        x: x1,
        y: y1
    };
     
    var p2 = {
        x: x2,
        y: y2
    };
     
    // angle in radians
    var angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
     
    // angle in degrees
    var angleDeg = Math.atan2((p2.y - p1.y)*-1, p2.x - p1.x) * 180 / Math.PI;
    return -angleDeg;
}

function searchMap() {
    var parWidth = $("#mapContainer").css("width");
    parWidth = parWidth.substring(0, parWidth.length - 2);
    console.log(encodeURIComponent($("#searchText").val()));
    image = image.replace(draw.image(buildGoogleURL($(this).height(), parWidth, "20", encodeURIComponent($("#searchText").val()))));
}

function buildGoogleURL(height, width, zoom, loc) {
    return "http://maps.googleapis.com/maps/api/staticmap?center="+loc+"&zoom="+zoom+"&size=" +height+"x"+width+"&sensor=false&style=feature:transit|element:all|visibility:off&style=feature:poi|element:all|visibility:off&style=feature:landscape|element:all|visibility:off&style=feature:administrative|element:all|visibility:off&scale=3&maptype=hybrid";
}