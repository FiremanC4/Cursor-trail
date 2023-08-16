function hslToRgb(h, s, l) {
    var r, g, b;
  
    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      }
  
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
  
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    r = Math.floor(r * 255);
    g = Math.floor(g * 255);
    b = Math.floor(b * 255);
    
    let NumStr = r*65536 + g*256 + b
    NumStr = NumStr.toString(16)
    NumStr = '0'.repeat(6 - NumStr.length) + NumStr

    return `#${NumStr}`
    return `rgb(${r * 255}, ${g * 255}, ${b * 255})`;
}

var circle = function(x, y, rad, fillC)
    {
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2, false);
        if(fillC)
        {
            ctx.fill();
        } else 
        {
            ctx.stroke();
        }
    };

    var drawBee = function(x, y)
    {
        ctx.lineWidth = 8;
        ctx.strokeStyle = "Black";
        ctx.fillStyle = "Gold";

        circle(x, y, 32, true);
        circle(x, y, 32, false);
        circle(x - 20, y - 44, 20, false);
        circle(x + 20, y - 44, 20, false);
        circle(x - 8, y - 4, 8, false);
        circle(x + 8, y - 4, 8, false);
    };

    var drawTrail = function(list, tension) {

        
        ctx.lineWidth = 9;
        ctx.lineJoin='round';
        ctx.shadowBlur = 20;

        let dnow = Date.now() /2000
        
        preColor = (dnow) - Math.floor(dnow)
        if (preColor >= 1){preColor = preColor-1}

        colors = `${hslToRgb(preColor, 1, 0.5)}` //`Chartreuse`//

        ctx.strokeStyle = colors;
        ctx.shadowColor = colors;
        ctx.fillStyle = colors;
        
        ctx.beginPath();
        
        // if (list.length - 1){
        //     ctx.arc(list[0][0], list[0][1], ctx.lineWidth/12, 0, Math.PI * 2);
        //     const element = list[list.length-1];
        //     ctx.arc(element[0], element[1], ctx.lineWidth/12, 0, Math.PI * 2);
        // }
        ctx.moveTo(list[0].x, list[0].y);
        ctx.arc(list[0].x, list[0].y, ctx.lineWidth/20, 0, Math.PI * 2, false);
        if (list.length > 2){
        // for (i = 1; i < list.length - 2; i ++){
        //     var xc = (list[i].x + list[i + 1].x) / 2;
        //     var yc = (list[i].y + list[i + 1].y) / 2;
        //     ctx.quadraticCurveTo(list[i].x, list[i].y, xc, yc);
        // }
        // // curve through the last two list
        // ctx.quadraticCurveTo(list[i].x, list[i].y, list[i+1].x,list[i+1].y);
        
        var Mx = list[list.length - 1].x,
            My = list[list.length - 1].y;

        var t = (tension != null) ? tension : 1;
            for (var i = 0; i < list.length - 1; i++) {
                var p1 = list[i];
                const Sx = -Math.sign(Mx - p1.x)
                const Sy = -Math.sign(My - p1.y)
                const dis = Math.sqrt((p1.x - Mx)**2 + (p1.y - My)**2)

                list[i].x = p1.x + Sx*(dis / moveOffest)
                list[i].y = p1.y + Sy*(dis / moveOffest)

                p1 = list[i];
                var p0 = (i > 0) ? list[i - 1] : list[0];
                var p2 = list[i + 1];

                if (((p1.x - p2.x)**2 + (p1.y - p2.y)**2) > 100){

                var p3 = (i != list.length - 2) ? list[i + 2] : p2;

                var cp1x = p1.x + (p2.x - p0.x) / 6 * t;
                var cp1y = p1.y + (p2.y - p0.y) / 6 * t;

                var cp2x = p2.x - (p3.x - p1.x) / 6 * t;
                var cp2y = p2.y - (p3.y - p1.y) / 6 * t;

                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
            } else {
                ctx.lineTo(p2.x, p2.y)
            }
            }
        }
        ctx.stroke();
                
    }

    var update = function(cord)
    {
        // var offset = Math.random() * 32 - 16;
        // cord += offset;
        return cord;
    };

    var clickBee = function(event)
    {
        x = event.pageX;
        y = event.pageY;
    };

    var MouseCoords = {

        getX: function(e){
        if (e.pageX){
            return e.pageX;
        }
        else if (e.clientX){
            return e.clientX+(document.documentElement.scrollLeft || document.body.scrollLeft) - document.documentElement.clientLeft;
        }

        return 0;
        },


        getY: function(e){
        if (e.pageY){
            return e.pageY;
        }
        else if (e.clientY){
            return e.clientY+(document.documentElement.scrollTop || document.body.scrollTop) - document.documentElement.clientTop;
        }
        return 0;
        }
    }




    var canvas = document.getElementById("canvas-trail");
    var ctx = canvas.getContext("2d");

    var x = canvas.width/2;
    var y = canvas.height/2;

    var lifetime = 1000;
    var curveOffset = 15;
    var moveOffest = 10

    var padd = 100;
    var colors = hslToRgb(1, 1, 0.5);
    var preColor = 0;
    var mouseChekPoints = [];


    var lastCalledTime;
var fps;

function requestAnimFrame() {

  if(!lastCalledTime) {
     lastCalledTime = Date.now();
     fps = 0;
     return;
  }
  delta = (Date.now() - lastCalledTime)/1000;
  lastCalledTime = Date.now();
  fps = 1/delta;
}	

    document.onmousemove = function(e){
        if (!e) e = window.event;
        // var Mx = MouseCoords.getX(e) - x;
        // var My = MouseCoords.getY(e) - y;

        x = MouseCoords.getX(e)
        y = MouseCoords.getY(e)
        mouseChekPoints.push({ x: x, y: y, dt : Date.now()});

        // if (mouseChekPoints.length > 16){mouseChekPoints.shift()};


        // setTimeout(function() {
        //     mouseChekPoints.shift()
        // }, 250)
            
    }


    setInterval(
        function(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (mouseChekPoints.length){
                drawTrail(mouseChekPoints, 1);

                for (let idx = 0; idx < Math.floor(mouseChekPoints.length / 3); idx++) {
                    const element = mouseChekPoints[idx];
                    if (Date.now() - element.dt >= lifetime) {
                        mouseChekPoints.shift();
                    };
                    
                }
            };
            // ctx.strokeStyle = colors;
            // circle(x,y, 10, true)

                
            

            ctx.fillText(mouseChekPoints.length, 10, 50);
            ctx.fillText(`${Math.round(fps)} fps`, 10, 70);



            
            // if (mouseChekPoints.length && timer == 0){
                //     timer = 10;
                //     mouseChekPoints.shift();
                // };
                // if (timer > 0){timer = timer - 2};
                
                
            // drawBee(x, y);
            // ctx.strokeRect(0, 0, canvas.width, canvas.height);
requestAnimFrame()
        }
    , 30);