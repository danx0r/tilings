/**
 * @author dbm
 */

function draw(verts, fill) {
    con.beginPath();
    con.moveTo(verts[0][0],verts[0][1]);
    for (var i=1; i<verts.length; i++) {
//        console.log("lineTo:", verts[i])
        con.lineTo(verts[i][0], verts[i][1]);
    }
    con.closePath();
    con.fillStyle=fill;
    con.fill();
    con.stroke();
}

// return average point at f way between a and b (0 <= f <= 1.0)
function avg(a, b, f) {
    var x = b[0] * f + a[0] * (1.0-f);
    var y = b[1] * f + a[1] * (1.0-f);
    return [x, y];
}

function poly(verts, color){
    this.verts = verts;
    this.color = color;
    this.draw = function(){
        draw(this.verts, this.color);
    }
    
    // crux of matter: return 5 sub-polys acc to pinwheel logic
    this.subdivide = function(){
    
        // if triangle...
        if (this.verts.length == 3) {
        
        }
        // if square.. (assume clockwise)
        if (this.verts.length == 4) {
            var A = avg(this.verts[0], this.verts[1], 2.0/3.0);
            var B = avg(this.verts[1], this.verts[2], 2.0/3.0);
            var C = avg(this.verts[2], this.verts[3], 2.0/3.0);
            var D = avg(this.verts[3], this.verts[0], 2.0/3.0);
            return new plist([new poly([A,B,C,D], this.color)]);
        }
        else {
            alert("can't subdivide except tri's and squares")
        }
    }
}

function plist(polys) {
    console.log("polys:", polys)
    this.polys = polys;
    this.draw = function () {
        for (p in this.polys) {
            polys[p].draw();
        }
    }
}

main = function(){
    can = document.getElementById("can");
    con = can.getContext('2d');
//   draw([[100,100],[300,200],[100,150]], "rgb(150,180,150)");
    var sq = new poly([[0,0], [500,0], [500,500], [0,500]], "rgb(150,180,150)");
    s2 = sq.subdivide();
    s2.draw();
}
