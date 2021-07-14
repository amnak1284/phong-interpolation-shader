class Camera{

    constructor(){
    this.fov = 60;
    this.eye = new Vector3([0,0,-1]);
    this.at = new Vector3([0, 0,0]);
    this.up = new Vector3([0,1,0]);
    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();

    this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    this.projectionMatrix.setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
    
    }


    

    moveForward(){
// compute the forward vector
 /* var f = new Vector3();


 f.set(this.at);
 console.log("FFF");
 console.log("the f value after set");
 console.log(f);
 
 let subt = f.sub(this.eye);
 console.log("the subt value");
 console.log(subt);
 f.normalize();
 f.mul(2);
 console.log("value of eye");
 console.log(this.eye);
 console.log(f);

 
 let sum = this.eye.add(f);
 console.log("the sum value");
 console.log(sum);
 this.at.add(f);
   */
  var f = new Vector3();
  f.set(this.at);
  f.sub(this.eye);
  f.normalize();
  f.mul(0.2);
  this.eye.add(f);
  this.at.add(f);

  this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);



    }


moveBackward(){
    let b = new Vector3();
    b.set(this.eye);
    b.sub(this.at);
    b.normalize();
    b.mul(.2);
    this.eye.add(b) ; 
    this.at.add(b); 
    this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
}
panLeft(){
    var f = new Vector3();
    f.set(this.at);
    f.sub(this.eye);
    let rotataionMatrix = new Matrix4();
    rotataionMatrix.setRotate(10, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    let f_prime = new Vector3();
    f_prime = rotataionMatrix.multiplyVector3(f);
    let tempEye = new Vector3();
    tempEye.set(this.eye);
    this.at = tempEye.add(f_prime);
    this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
}

panRight(){
    var f = new Vector3();
    f.set(this.at);
    f.sub(this.eye);
    let rotataionMatrix = new Matrix4();
    rotataionMatrix.setRotate(-10, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    let f_prime = new Vector3();
    f_prime = rotataionMatrix.multiplyVector3(f);
    let tempEye = new Vector3();
    tempEye.set(this.eye);
    this.at = tempEye.add(f_prime);
    this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
}


moveLeft(){
    let f = new Vector3();

    f.set(this.at);
  f.sub(this.eye);
    let s = new Vector3();
    
    s= Vector3.cross(this.up, f);
   
    s.normalize();
    s.mul(.2);
    this.eye.add(s); 
    this.at.add(s);
    this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);

}

moveRight(){
    let f = new Vector3();

    f.set(this.at);
  f.sub(this.eye);
    let s = new Vector3();
    
    s= Vector3.cross(f, this.up);
   
    s.normalize();
    s.mul(.2);
    this.eye.add(s); 
    this.at.add(s);
    this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);

    

}

}