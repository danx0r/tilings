/**
 * @author dbm
 */

function draw(verts, fill) {
    con.beginPath();
    con.moveTo(verts[0][0],verts[0][1]);
    for (var i=1; i<verts.length; i++) {
        console.log("lineTo:", verts[i])
        con.lineTo(verts[i][0], verts[i][1]);
    }
    con.closePath();
    con.fillStyle=fill;
    con.fill();
    con.stroke();
}

function poly(verts, color) {
    this.verts=verts;
    this.color=color;
    this.draw = function () {
        draw(this.verts, this.color);
    }
}

main = function(){
    can = document.getElementById("can");
    con = can.getContext('2d');
//   draw([[100,100],[300,200],[100,150]], "rgb(150,180,150)");
    var tri = new poly([[100,100],[300,200],[100,150]], "rgb(150,180,150)");
    tri.draw();
}
