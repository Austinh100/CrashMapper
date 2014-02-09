var draw;
var image;
var mouseLine = false;
var motionline2 = false;
var line = false;
var activeCar;
var mouseX = 0;
var mouseY = 0;
var curLine;
var hoverCar;
var motionline = false;
var colors = ['#7e0000','#7f3b00', '#7f7d00', '#447f00', '#007f02'];
var grad;

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
    var triangle = draw.defs().add("marker");
    triangle
        .attr("id", "triangle")
        .attr("viewbox", "0 0 10 10")
        .attr("refX", 0)
        .attr("refY", 5)
        .attr("markerUnits","strokeWidth")
        .attr("markerWidth", 4)
        .attr("markerHeight", 3)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z");
    var testLine = draw.line(100, 50.5, 300, 50.5).stroke({ width: 10 }).attr('markerEnd','url(#triangle)');
    */
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
        if(motionline){
            grad = draw.gradient('linear', function(stop) {
              stop.at({ offset: 0, color: '#000' })
              stop.at({ offset: 1, color: colors[activeCar-1] })
            });
            var angle = calcAngle(curLine.x1, curLine.y1, mouseX, mouseY);
            console.log(angle);
            if(angle > 90.0 || angle < -90.0) {
                grad.from(1,0).to(0,0);
            } else {
                grad.from(0,0).to(1,0);
            }
            
            motionLine[motionLine.length-1].line.plot(mouseLine.x1, mouseLine.y1, mouseX, mouseY).stroke({ color:grad, width: 10 });
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
        
        if(motionline) {
            if(!motionline2) {
                grad = draw.gradient('linear', function(stop) {
                  stop.at({ offset: 0, color: '#000' })
                  stop.at({ offset: 1, color: colors[activeCar-1] })
                });
                motionLine[motionLine.length-1].line = draw.line(mouseX, mouseY, mouseX, mouseY).stroke({ color:grad, width: 10 });
                curLine = {
                    x1: mouseX,
                    y1: mouseY
                };
                motionline2 = true;
            } else {
                motionline = false;
                motionline2 = false;
            }
        }
    });
    
    $("#makeLine").click(function(e){
        if(!motionline) {
            motionline = true;
            motionLine.push({"line":draw.line(0, 0, 0, 0).stroke({ width: 0 })});
            $("#makeLine").addClass("pure-button-active");
        } else if(activeCar != 0) {
            
            $("#makeLine").removeClass("pure-button-active");
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

var motionLine = [];

function carClicked(num) {
    if(!motionline) {
        $("#cars"+num).addClass("grayscale");
        carToPlace = num;
    } else {
        activeCar = num;
    }
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