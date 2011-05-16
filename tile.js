/**
 * @author dbm
 */

TRI5=0;
DECTRI=1;
DECSQ=0;
REV1=1;
REV2=1;
SIZE=1000;

function draw(verts, fill){
    con.beginPath();
    con.moveTo(verts[0][0], verts[0][1]);
    for (var i = 1; i < verts.length; i++) {
        //        console.log("lineTo:", verts[i])
        con.lineTo(verts[i][0], verts[i][1]);
    }
    con.closePath();
    con.fillStyle = fill;
    con.fill();
    con.stroke();
    if (DECTRI) {
        if (verts.length == 3) {
            var A = avg(verts[2], verts[1], 1.0 / 2.0);
            con.beginPath();
            con.moveTo(verts[0][0], verts[0][1]);
            con.lineTo(A[0], A[1]);
            con.stroke();
            con.lineTo(verts[1][0], verts[1][1]);
            con.closePath();
            con.fillStyle = "rgb(200,0,0)";
            con.fill();
        }
    }
    if (DECSQ) {
        if (verts.length == 4) {
            con.beginPath();
            con.moveTo(verts[0][0], verts[0][1]);
            con.lineTo(verts[2][0], verts[2][1]);
            con.stroke();
            //con.lineTo(verts[3][0], verts[3][1]);
            //con.closePath();
            //con.fillStyle="rgb(100,100,100)";
            //con.fill();
        }
    }
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
    //this.color = "rgb("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+")";
    this.draw = function(){
        draw(this.verts, this.color);
    }
    
    // crux of matter: return 5 sub-polys acc to pinwheel logic
    this.subdivide = function(){
    
        // if triangle...
        if (this.verts.length == 3) {
            var A = avg(this.verts[0], this.verts[1], 1.0/5.0);
            var B = avg(this.verts[0], this.verts[1], 2.0/5.0);
            var C = avg(this.verts[0], this.verts[1], 3.0/5.0);
            var D = avg(this.verts[1], this.verts[2], 1.0/2.0);
            var F = avg(this.verts[2], A, 1.0/2.0);
            var E = avg(D, F, 1.0/2.0);
            if (TRI5) {
                var s1 = new poly([D, A, C], this.color);
                var s2 = new poly([A, D, F], this.color)//"rgb(200,0,0)")
            }
            else {
                var s1 = new poly([A, B, E, F], this.color);
                var s2 = new poly([B, C, D, E], this.color);
                if(REV1) s1.reverse();
                if(REV2) s2.reverse();
            }
            var t1 = new poly([this.verts[0], this.verts[2], A], this.color);
            var t2 = new poly([D, this.verts[1], C], this.color);
            var t3 = new poly([this.verts[2], D, F], this.color);
            return new plist([s1, s2, t1, t2, t3]);
        }
        // if square.. (assume clockwise)
        if (this.verts.length == 4) {
            var A = avg(this.verts[0], this.verts[2], 1.0/5.0);
            var B = avg(this.verts[1], this.verts[3], 1.0/5.0);
            var C = avg(this.verts[2], this.verts[0], 1.0/5.0);
            var D = avg(this.verts[3], this.verts[1], 1.0/5.0);
            var E = avg(A, B, 2.0/3.0);
            var F = avg(B, C, 2.0/3.0);
            var G = avg(C, D, 2.0/3.0);
            var H = avg(D, A, 2.0/3.0);
            var t1 = new poly([this.verts[0], this.verts[1], H], this.color)
            var t2 = new poly([this.verts[1], this.verts[2], E], this.color)
            var t3 = new poly([this.verts[2], this.verts[3], F], this.color)
            var t4 = new poly([this.verts[3], this.verts[0], G], this.color)
            var sq = new poly([E,F,G,H], this.color);
            return new plist([t1, t2, t3, t4, sq]);
        }
        else {
            alert("can't subdivide except tri's and squares")
        }
    }
    
    this.subrec = function(lev) {
        if (lev==0) {
            return this;
        }
        var sub = this.subdivide();
        if (lev==1) {
            return sub;
        }
        for(var i=0; i<sub.polys.length; i++) {
            sub.polys[i] = sub.polys[i].subrec(lev-1);
        }
        return sub;
    }
    
    this.reverse = function(){
        var nu = []
        for (var i = this.verts.length - 1; i >= 0; i--) {
            nu.push(this.verts[i]);
        }
        this.verts = nu;
    }
}

function plist(polys) {
//    console.log("polys:", polys)
    this.polys = polys;
    this.draw = function () {
        for (p in this.polys) {
            polys[p].draw();
        }
    }
}

g_lev=0;
main = function(){
    can = document.getElementById("can");
    con = can.getContext('2d');
//   draw([[100,100],[300,200],[100,150]], "rgb(150,180,150)");
    var col = "rgb(150,150,150)";
    var sq = new poly([[0,0], [SIZE,0], [SIZE,SIZE], [0,SIZE]], col);
    sq = sq.subrec(g_lev);
    sq.draw();
}

up = function() {
    g_lev++;
    document.getElementById("level").innerHTML="level: " + g_lev;
    main();
}

down = function() {
    g_lev--;
    document.getElementById("level").innerHTML="level: " + g_lev;
    main();
}
