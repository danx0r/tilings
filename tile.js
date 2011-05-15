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


main = function(){
    can = document.getElementById("can");
    con = can.getContext('2d');
    /*
    con.beginPath();
    con.lineTo(100, 100);
    con.lineTo(300, 200);
    con.lineTo(100, 200);
    con.closePath()
    con.fillStyle = "rgb(200,200,155)";
    con.fill();
    con.stroke();
    */
   draw([[100,100],[300,200],[100,150]], "rgb(150,180,150)");
}
