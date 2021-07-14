// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  `
  precision mediump float;
  attribute vec4 a_Position; 
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() { 
  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_Normal = a_Normal;
    v_UV = a_UV;
    v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE =
  `
  precision mediump float; 
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform vec3 u_lightPos;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform vec3 u_cameraPos;
  uniform int u_whichTexture;
  varying vec4 v_VertPos;
  uniform bool u_lightOn;

  void main() {
    if(u_whichTexture == -3){
      gl_FragColor = vec4((v_Normal + 1.0 )/2.0, 1.0);
    }
    else if(u_whichTexture == -2){
      gl_FragColor = u_FragColor;
    }
    else if(u_whichTexture == -1){
      gl_FragColor = vec4(v_UV, 1.0,1.0);
    }

    else if(u_whichTexture == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    }
    else if(u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    }
    else{
      gl_FragColor = vec4(1, .2, .2, 1);
    }

    vec3 lightVector =   u_lightPos - vec3(v_VertPos);
    float r = length(lightVector);

    //if(r<1.0){
      //gl_FragColor= vec4(1,0,0,1);
   // }
    //else if(r < 2.0){
    //  gl_FragColor= vec4(0,1,0,1);
   // }

   //gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1);
  vec3 L = normalize(lightVector);
  vec3 N = normalize(v_Normal);
  float nDotL = max(dot(N,L), 0.0);
  
  //Reflection
  vec3 R = reflect(-L,N);
  //EYE

  vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

  float specular = pow(max(dot(E, R), 0.0),30.0);

  
  vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
  vec3 ambient = vec3(gl_FragColor) *0.3;

    if(u_lightOn){
      gl_FragColor = vec4(specular +diffuse + ambient, 1.0);
    }
    else{
      gl_FragColor = vec4(diffuse + ambient, 1.0);
    }


  
  
    
  }`

  //Global variables
  let canvas;
  let gl;
  let a_Position;
  let a_UV;
  let u_FragColor;
  let u_Size;
  let u_ModelMatrix;
  let u_ProjectionMatrix;
  let u_ViewMatrix;
  let u_GlobalRotateMatrix;
  let u_Sampler ;
  let u_Sampler1 ;
  let u_whichTexture;
  let camera;
  let identityM;
  let u_lightPos;
  let u_cameraPos;
  let u_lightOn;
  
  function setupWebGL(){
    // Retrieve <canvas> element
 canvas = document.getElementById('webgl');

// Get the rendering context for WebGL
 //gl = getWebGLContext(canvas);
 gl= canvas.getContext("webgl", {preserveDrivingBuffer: true});
if (!gl) {
  console.log('Failed to get the rendering context for WebGL');
  return;
}

gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){

// Initialize shaders
if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
console.log('Failed to intialize shaders.');
return;
}

// // Get the storage location of a_Position
 a_Position = gl.getAttribLocation(gl.program, 'a_Position');
if (a_Position < 0) {
console.log('Failed to get the storage location of a_Position');
return;
}
 a_UV = gl.getAttribLocation(gl.program, 'a_UV');
if (a_UV < 0) {
console.log('Failed to get the storage location of a_UV');
return;
}
a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
if (a_Normal < 0) {
console.log('Failed to get the storage location of a_Normal');
return;
}

// Get the storage location of u_FragColor
u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
if (!u_FragColor) {
console.log('Failed to get the storage location of u_FragColor');
return;
}
u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
if (!u_whichTexture) {
console.log('Failed to get the storage location of u_whichTexture');
return;
}
u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
if (!u_lightPos) {
console.log('Failed to get the storage location of u_lightPos');
return;
}
u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
if (!u_cameraPos) {
console.log('Failed to get the storage location of u_cameraPos');
return;
}

u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
if (!u_lightOn) {
console.log('Failed to get the storage location of u_lightOn');
return;
}

u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
if(!u_ModelMatrix){
console.log('Failed to get the storage location of u_ModelMatrix');
return;
}
u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
if(!u_GlobalRotateMatrix){
console.log('Failed to get the storage location of u_ModelMatrix');
return;
}


 u_ProjectionMatrix= gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
if(!u_ProjectionMatrix){
console.log('Failed to get the storage location of u_ProjectionMatrix');
return;
}

u_ViewMatrix= gl.getUniformLocation(gl.program, 'u_ViewMatrix');
if(!u_ViewMatrix){
  console.log('Failed to get the storage location of u_ViewMatrix');
  return;
}

u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler0'); // Create a texture object

  if(!u_Sampler){
    console.log("failed to load storage location of u_Sampler0");
    return false;
  }
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1'); // Create a texture object

  if(!u_Sampler1){
    console.log("failed to load storage location of u_Sampler1");
    return false;
  }
  

 //----------------------------------------

 identityM = new Matrix4();
gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);





}
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
//Globals related to ui
let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize=5;
let g_selectedType = POINT;
let g_selectedSegment =10;
let g_globalAngle = 0;
let g_beakAngle =0;
let g_pinkAngle = 0;
let g_animation = false;
let g_animationArm = false;
let g_animationHead = false;
let g_rightArm = 90;
let g_normalOn = false;
let g_lightPos = [0,1,-2];
let g_lightOn = false;


//--------------------------------------------
function addActionsforHtmlUI(){
//buttons

//add Slider Events

document.getElementById("beakSlide").addEventListener("mousemove", function(){g_beakAngle = this.value; renderAllShapes();});
document.getElementById("pinkSlide").addEventListener("mousemove", function(){g_pinkAngle = this.value; renderAllShapes();});
//document.getElementById("sizeSlide").addEventListener('mouseup', function(){g_selectedSize = this.value})
document.getElementById("angleSlide").addEventListener('mousemove', function(){g_globalAngle= this.value; renderAllShapes();});
document.getElementById("animationOn").onclick = function(){g_animation = true}
document.getElementById("animationOff").onclick = function(){g_animation = false}


document.getElementById("normalOn").onclick = function(){g_normalOn= true; }
document.getElementById("normalOff").onclick = function(){g_normalOn= false; }

document.getElementById("lightOn").onclick = function(){g_lightOn= true; }
document.getElementById("lightOff").onclick = function(){g_lightOn= false; }



document.getElementById("animationOnArm").onclick = function(){g_animationArm = true;}
document.getElementById("animationOffArm").onclick = function(){g_animationArm = false;}

document.getElementById("animationOnHead").onclick = function(){g_animationHead = true};
document.getElementById("animationOffHead").onclick = function(){g_animationHead = false;}

document.getElementById("rightArmSlide").onclick = function(){g_rightArm = this.value; renderAllShapes();}
document.getElementById("lightSlideX").addEventListener("mousemove", function(){g_lightPos[0] = this.value/100; renderAllShapes(); });

document.getElementById("lightSlideY").addEventListener("mousemove", function(){g_lightPos[1] = this.value/100; renderAllShapes(); }); 
document.getElementById("lightSlideZ").addEventListener("mousemove", function(){g_lightPos[2] = this.value/100; renderAllShapes(); }); 

//------------  




}





function initTextures(gl, n){

  

  var image = new Image();
  var image2 = new Image();
  if(!image){
    console.log("failed to create the image object");
    return false;
  }

  image.onload = function(){sendTextureToGLSL(image);};
  
  image.src = "sky.jpeg"


  

  return true;


}


function sendTextureToGLSL(image){

  var texture = gl.createTexture(); // Create a texture object

  if(!texture){
    console.log("failed to load storage location of u_Sampler");
    return false;
  }
  
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE0);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

 // Set the texture unit 0 to the sampler
 gl.uniform1i(u_Sampler, 0);


 

// Set the texture unit 0 to the sampler


 

 console.log("loaded texture");



}



















function main() {
setupWebGL();

connectVariablesToGLSL();
addActionsforHtmlUI();
camera = new Camera();


initTextures();
// Register function (event handler) to be called on a mouse press



document.addEventListener('keydown', (event) => {
  const keyName = event.key;

  // As the user releases the Ctrl key, the key is no longer active,
  // so event.ctrlKey is false.
  if (keyName === 'w') {
    camera.moveForward();
  }
  if (keyName === 'a') {
    camera.moveLeft();
  }
  if (keyName === 's') {
    camera.moveBackward();
  }
  if (keyName === 'd') {
    camera.moveRight();
  }
  if (keyName === 'e') {
    camera.panRight();
  }
  if (keyName === 'q') {
    camera.panLeft();
  }
}, false);



canvas.onmousedown = click;
canvas.onmousemove = function(ev){if(ev.buttons == 1){ click(ev);} }

// Specify the color for clearing <canvas>
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// Clear <canvas>
//gl.clear(gl.COLOR_BUFFER_BIT);

requestAnimationFrame(tick);
//renderAllShapes()


}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

function tick(){
g_seconds = performance.now()/1000.0-g_startTime;

updateAnimationAngles()
renderAllShapes();

requestAnimationFrame(tick); 

}

//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes = [];



var g_shapesList = [];

function click(ev) {
g_selectedSegment = document.getElementById("segmentSlide").value;
[x,y] = convertCoordinatesEventToGL(ev);

let point;
if(g_selectedType == POINT){
   point = new Point();
   
}
else if(g_selectedType == TRIANGLE){
   point = new Triangle();
}
else{
   point = new Circle();

   point.segments = g_selectedSegment;
}
// Store the coordinates to g_points array

point.position = [x, y];
point.color = g_selectedColor.slice();
point.size = g_selectedSize;
g_shapesList.push(point);


/* g_points.push([x, y]);
g_colors.push(g_selectedColor.slice());
g_sizes.push(g_selectedSize); */


// Store the coordinates to g_points array
/*   if (x >= 0.0 && y >= 0.0) {      // First quadrant
g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
} else if (x < 0.0 && y < 0.0) { // Third quadrant
g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
} else {                         // Others
g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
} */

// Clear <canvas>




}


function convertCoordinatesEventToGL(ev){
var x = ev.clientX; // x coordinate of a mouse pointer
var y = ev.clientY; // y coordinate of a mouse pointer
var rect = ev.target.getBoundingClientRect();

x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
return([x,y]);
}
function updateAnimationAngles(){
if(g_animation){
g_beakAngle = (-45*Math.sin(g_seconds));
}
if(g_animationArm){
g_rightArm = (90*Math.sin(g_seconds));
}
if(g_animationHead){
g_pinkAngle = (-35*Math.sin(g_seconds));
}


  g_lightPos[0] = Math.cos(g_seconds);

}

var g_map = 
[ [0,0,1,1,0],
  [1,0,0,0,1],
  [1,0,0,1,0],
  [1,0,1,0,1],
  [1,1,0,1,0]
  
  
  /* [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0], 
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0], 
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0], 
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0], 
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], */

];


function renderAllShapes(){
var startTime = performance.now();


var globalRotMat = new Matrix4().rotate(g_globalAngle, 0,1,0);
gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

var projMat = new Matrix4();
//projMat.setPerspective(60, canvas.width/canvas.height, .1, 100)
gl.uniformMatrix4fv(u_ProjectionMatrix, false, camera.projectionMatrix.elements);

var viewMat = new Matrix4();
viewMat.setLookAt(0,0,3, 0,0,-100, 0,1,0); //eye at up
gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMatrix.elements);



gl.clear(gl.COLOR_BUFFER_BIT);



gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
gl.uniform3f(u_cameraPos, camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2]);
gl.uniform1i(u_lightOn, g_lightOn);

var light = new Cube();
light.color = [2,2,0,1];
light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
light.matrix.scale(-.1,-.1,-.1);
light.matrix.translate(-.5,-.5,-.5);
light.textureNum = -2;
light.render();


//drawTriangle3D([-1.0,0.0,0.0, -0.5,-1.0,0.0, 0.0,0.0,0.0]);



//draw the floor-
var floor = new Cube();
floor.color= [1.0,0.0,0.0,1.0];
floor.textureNum = 0;
floor.matrix.translate(0,-.75, 0.0);
floor.matrix.scale(10,0,10);
floor.matrix.translate(-.5,0,-.5);
floor.render();


///draws the sky
var sky = new Cube();
sky.color = [0.3,0.8, 1.0, 1.0];
sky.textureNum = -2;
if(g_normalOn){
  sky.textureNum=-3;
}
sky.matrix.scale(-5,-5,-5);
sky.matrix.translate(-.5,-.5,-.5);
sky.render();
// ---the map
//drawMap();



// ------------------------------- Working code
var body = new Cube();
body.color = [0.0,1.0,0.5,1.0];
body.matrix.translate(-.25, -.75, 0.0);
body.matrix.rotate(-5,1,0,0);
body.matrix.scale(0.5, .3, .5);
if(g_normalOn){
  body.textureNum=-3;
}
body.render();

//draw yellow body
var leftArm = new Cube();
leftArm.color = [.2,.5,0.2,1.0];
leftArm.matrix.setTranslate(0,-.5,0.0);
leftArm.matrix.rotate(-5,1,0,0);
//  if(g_animation){
//  leftArm.matrix.rotate(45*Math.sin(g_seconds),0,0,1);
//  }
//  else{
//    leftArm.matrix.rotate(-g_beakAngle, 0,0,1);
//  }
leftArm.matrix.rotate(-g_beakAngle, 0,0,1);
var yellowCordMat = new Matrix4(leftArm.matrix);
var yellowCord = new Matrix4(leftArm.matrix);
var yellowCord2 = new Matrix4(leftArm.matrix);
leftArm.matrix.scale(.25,.7,.5);
leftArm.matrix.translate(-.5,0,0);
if(g_normalOn){
  leftArm.textureNum=-3;
}
leftArm.render();



var arm1 = new Cube();
arm1.color= [0.0,1,.2,1.0];
arm1.matrix= yellowCordMat;

arm1.matrix.translate(0.121,.4,0.0);
arm1.matrix.rotate(-g_rightArm,0,0,1);
arm1.matrix.scale(.05,.3,.1);
if(g_normalOn) arm1.textureNum = -3;
arm1.render();

//box magenta
var box = new Cube();
box.color = [0.0,1.0,0.5,1.0];

box.matrix = yellowCord;

box.matrix.translate(0,.65,0);

box.matrix.rotate(g_pinkAngle,0,0,1);

if(g_normalOn) box.textureNum = -3;


var eyemat = new Matrix4(box.matrix);
box.matrix.scale(.3,.3,.3);
box.matrix.translate(-.5,0,-0.0001);

box.render(); 


var arm2 = new Cube();
arm2.color= [0.0,1,.2,1.0];

arm2.matrix= yellowCord;
arm2.matrix.translate(-.1,-1,0.0);
arm2.matrix.rotate(-90,0,0,1);
arm2.matrix.scale(.1,.8,.5);
if(g_normalOn){
  arm2.textureNum=-3;
}
arm2.render();


var eye1 = new Cube();

eye1.color= [0.0,0,0,1.0];
eye1.matrix= eyemat;
eye1.matrix.translate(-.1,0.03,0);
eye1.matrix.rotate(-90,0,0,1);
eye1.matrix.scale(.1,.1,.1);
eye1.matrix.translate(-2,-.3,-.2);
if(g_normalOn){
  eye1.textureNum=-3;
}
eye1.render();  



var eye2 = new Cube();

eye2.color= [0.0,0,0,1.0];
eye2.matrix= eyemat;
eye2.matrix.translate(.35,0.6,0);
eye2.matrix.rotate(-90,0,0,1);
eye2.matrix.scale(.98,1,.1);
eye2.matrix.translate(-2,-.3,-.2);
if(g_normalOn){
  eye2.textureNum=-3;
}
eye2.render();  

var nose = new Cube();
nose.color= [0.0,0,,1.0];
nose.matrix= eyemat;
nose.matrix.translate(1.2,0.6,0);
nose.matrix.rotate(-90,0,0,1);
nose.matrix.scale(.5,.5,.1);
nose.matrix.translate(-2,-.3,-.2);
if(g_normalOn){
  nose.textureNum=-3;
}
nose.render();  



//-------sphere
var sphere = new Sphere();
sphere.color = [1,1,1,1];
sphere.matrix.translate(.5, 0,-.5);
sphere.matrix.scale(.2,.2,.2)
if(g_normalOn) sphere.textureNum = -3;

sphere.render();


//var duration = performance.now() - startTime;
//sendTextToHTML("ms" + Math.floor(duration)+ "fps: " + Math.floor(10000/duration))

}
