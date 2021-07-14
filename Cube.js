class Cube{
  constructor(){
      this.type="cube";
      //this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      //this.size = 5.0;
      //this.segments = 10;
      this.matrix = new Matrix4();
      this.textureNum = -1;
  }
  render(){
     
    //var xy = this.position;
    var rgba = this.color;
  //  var size = this.size;
   
    //console.log(segments);
    // Pass the position of a point to a_Position variable
    //gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // Pass the color of a point to u_FragColor variable
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    //pass size of point
    //gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
   
      drawTriangle3DUVNormal([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0], [0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1]);
      drawTriangle3DUVNormal([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0], [0,0, 1,1, 1,0], [0,0,-1, 0,0,-1, 0,0,-1]);

      //make lighting
      //gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
      //fill in other sides
      //normal top
      drawTriangle3DUVNormal([0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1], [0,1,0, 0,1,0, 0,1,0]);
      drawTriangle3DUVNormal([0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0], [0,1,0, 0,1,0, 0,1,0]);

      //top of cube
      drawTriangle3D([0,1,0, 0,1,1, 1,1,1]);
      drawTriangle3D([0,1,0, 1,1,1, 1,1,0]);

      //bottm
      //drawTriangle3D([1,1,1, 0,0,1, 1,1,0]);
      //--------------------------------------------------------
      //left side for normal
      //gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);
      drawTriangle3DUVNormal([0,1,0, 0,0,0, 0,0,1], [0,0, 1,1, 1,0], [-1,0,0, -1, 0,0, -1,0,0]);
      drawTriangle3DUVNormal([0,1,0, 0,1,1, 0,0,1], [0,0, 1,1, 1,0], [-1,0,0, -1, 0,0, -1,0,0]);

      //leftside
      drawTriangle3D([0,1,0, 0,0,0, 0,0,1]);
      drawTriangle3D([0,1,0, 0,1,1, 0,0,1]);
      //================================================================
      //gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);
      drawTriangle3DUVNormal([0,0,1, 0,1,1, 1,1,1],[0,0, 0,1, 1,1], [1,0,0, 1,0,0, 1,0,0] );
      drawTriangle3DUVNormal([0,0,1, 1,0,1, 1,1,1],[0,0, 1,1, 1,0] ,[1,0,0, 1,0,0, 1,0,0] );
      //other side
      drawTriangle3D([0,0,1, 0,1,1, 1,1,1]);
      drawTriangle3D([0,0,1, 1,0,1, 1,1,1]);
      //=============================================================
     // gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2]*.5, rgba[3]);
      drawTriangle3DUVNormal([1,0,1, 1,1,1, 1,1,0],[0,0, 0,1, 1,1], [0,0,1, 0,0,1 ,0,0,1]);
      drawTriangle3DUVNormal([1,0,1, 1,0,0, 1,1,0], [0,0, 0,1, 1,1], [0,0,1, 0,0,1 ,0,0,1]);

      //back
      drawTriangle3D([1,0,1, 1,1,1, 1,1,0]);
      drawTriangle3D([1,0,1, 1,0,0, 1,1,0]);
      //=================================================
      //gl.uniform4f(u_FragColor, rgba[0]*.4, rgba[1]*.4, rgba[2]*.4, rgba[3]);
      // normal botttom 
      drawTriangle3DUVNormal([1,0,0, 1,0,1, 0,0,1],[0,0, 0,1, 1,1], [0,-1,0, 0,-1,0 ,0,-1,0] );
      drawTriangle3DUVNormal([1,0,0, 0,0,0, 0,0,1],[0,0, 1,1, 1,0], [0,-1,0, 0,-1,0 ,0,-1,0] );

      //bottom
      drawTriangle3D([1,0,0, 1,0,1, 0,0,1]);
      drawTriangle3D([1,0,0, 0,0,0, 0,0,1]);

      //drawTriangle3D(0,0,0, 0,0,1, 1,0,1);
}




      
}

