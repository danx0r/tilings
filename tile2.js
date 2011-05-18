/**
 * @author dbm
 */

TRI5=0;
DECTRI=1;
DECSQ=0;
SIZE=1000;

RZ = (1/3) / (1/3 + 3)

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
    if (DECSQ==1) {
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
    if (DECSQ==2) {
        if (verts.length == 4) {
            con.beginPath();
            con.moveTo(verts[1][0], verts[1][1]);
            con.lineTo(verts[3][0], verts[3][1]);
            con.stroke();
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
        	var V0 = this.verts[0];
        	var V1 = this.verts[1];
        	var V2 = this.verts[2];
        	var A = avg(V0, V1, 0.5);
        	var B = avg(V1, V2, 0.5);
        	var C = avg(V2, V0, 0.5);
        	var t1 = new poly([V0, A, C], this.color);
        	var t2 = new poly([C, A, B, V2], this.color);
        	t2.rect = 1;
        	var t3 = new poly([A, V1, B], this.color);
        	//var t4 = new poly([B, C, A], this.color);
            return new plist([t1, t2, t3]);
        }
        // if square.. (assume clockwise)
        if (this.verts.length == 4) {
	    	var V0 = this.verts[0];
	    	var V1 = this.verts[1];
	    	var V2 = this.verts[2];
	    	var V3 = this.verts[3];
        	if (this.rect) {
		        var A = avg(V0, V1, 2.0/4.0);
		        var B = avg(V1, V2, 2.0/4.0);
		        var C = avg(V2, V3, 2.0/4.0);
		        var D = avg(V3, V0, 2.0/4.0);
		        var E = avg(A, C, 0.5);
		        var sq1 = new poly([V0, A, E, D], this.color);
		        sq1.rect=1
		        var sq2 = new poly([A, V1, B, E], this.color);
		        sq2.rect=1
		        var sq3 = new poly([D, E, C, V3], this.color);
		        sq3.rect=1
		        var sq4 = new poly([E, B, V2, C], this.color);
		        sq4.rect=1
		        return new plist([sq1, sq2, sq3, sq4]);
        	}
        	else {
		        var A = avg(V0, V1, 3.0/4.0);
		        var B = avg(V1, V2, 3.0/4.0);
		        var C = avg(V2, V3, 3.0/4.0);
		        var D = avg(V3, V0, 3.0/4.0);

				var E3 = avg(A, D, 1/3);
				var E = avg(E3, B, RZ);

				var F3 = avg(B, A, 1/3);
				var F = avg(F3, C, RZ);

				var G3 = avg(C, B, 1/3);
				var G = avg(G3, D, RZ);

				var H3 = avg(D, C, 1/3);
				var H = avg(H3, A, RZ);

		        var t1 = new poly([D, A, V0], this.color)
		        var t2 = new poly([D, A, H], this.color)

		        var t3 = new poly([A, B, V1], this.color)
		        var t4 = new poly([A, B, E], this.color)

		        var t5 = new poly([B, C, V2], this.color)
		        var t6 = new poly([B, C, F], this.color)

		        var t7 = new poly([C, D, V3], this.color)
		        var t8 = new poly([C, D, G], this.color)

		        var sq = new poly([E, F, G, H], this.color);
		        return new plist([t1, t2, t3, t4, t5, t6, t7, t8, sq]);
		    }
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

g_lev=1;
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
