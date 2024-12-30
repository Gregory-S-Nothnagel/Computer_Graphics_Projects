/*
Gregory Nothnagel
CS 535
Project #4

Description: This is an attempt at shadow buffering with a spotlight in a simulated room. There are two sets of vertex/fragment shaders. The first is for rendering the depth map and packing the depth information into an rgba texture. The spotlight works correctly if it points to the right, but not necessarily correct in other directions. What's weirder is that if you put it at position 5 and point it left and increase the beam, the shadows work for the floor, but not for all the walls. 

See end of <script id="fragment-shader2" type="x-shader/x-fragment"> in html file for information about the error, what may be causing it and what definitely isn't causing it.

PS: any reference to "camera" is a reference to the light source
	any reference to "eye" is a reference to the viewer who sees the scene

*/

"use strict";

var canvas;
var gl;

var numPositions = 0;

var positions = [];
var colors = [];
var cam = [1.5, 1.5, -1.5];
var eye = [.5, .5, 1];
var uCamFOV = 60.0;
var uCamRotation = [-0.0, 0.0];

init();

function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

	// enable depth testing so WebGL doesn't just draw objects in the order they are sent to the GPU and draws them in depth order
    gl.enable(gl.DEPTH_TEST);

	makeScene();
	
	renderMain();
	
	// a ton of event listeners for the various activities
    document.getElementById("increase").onclick = function () {
        uCamFOV += 5.0;
		uCamFOV = Math.min(uCamFOV, 140.0);
		renderMain();
    };
    document.getElementById("decrease").onclick = function () {
        uCamFOV -= 5.0;
		uCamFOV = Math.max(uCamFOV, 20.0);
		renderMain();
    };
	
	document.getElementById("left").onclick = function () {
        uCamRotation = [0.0, -90.0];
		renderMain();
    };
	document.getElementById("right").onclick = function () {
        uCamRotation = [0.0, 90.0];
		renderMain();
    };
	document.getElementById("up").onclick = function () {
        uCamRotation = [-90.0, 0.0];
		renderMain();
    };
	document.getElementById("down").onclick = function () {
        uCamRotation = [90.0, 0.0];
		renderMain();
    };
	
	
	// Event listener for number selection
    document.getElementById("numberSelect").addEventListener("change", function () {
        var selectedNumber = this.value;
		if (selectedNumber == 1) cam = [.5, .5, -1.5];
		else if (selectedNumber == 2) cam = [.5, 1.5, -1.5];
		else if (selectedNumber == 3) cam = [1.5, 1.5, -1.5];
		else if (selectedNumber == 4) cam = [2.5, 1.5, -1.5];
		else if (selectedNumber == 5) cam = [2.5, .5, -1.5];
        renderMain();
    });

    // Event listener for letter selection
    document.getElementById("letterSelect").addEventListener("change", function () {
        var selectedLetter = this.value;
		if (selectedLetter == "A") eye = [-.5, 2.5, 1];
		else if (selectedLetter == "B") eye = [1.5, 2.5, 1];
		else if (selectedLetter == "C") eye = [3.5, 2.5, 1];
		else if (selectedLetter == "D") eye = [-.5, -.5, 1];
		else if (selectedLetter == "E") eye = [1.5, -.5, 1];
		else if (selectedLetter == "F") eye = [3.5, -.5, 1];
        renderMain();
    });	
	
	
}

function renderMain(){
	
	var program1 = initShaders(gl, "vertex-shader-depth", "fragment-shader-depth");
    gl.useProgram(program1);

    var vBuffer = gl.createBuffer();
	var cBuffer = gl.createBuffer();

    var positionLoc = gl.getAttribLocation(program1, "aPosition");

    // Set up vertex attributes (called once)
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
	
	var CamPositionLoc = gl.getUniformLocation(program1, "uCamPosition");
    gl.uniform3fv(CamPositionLoc, cam);
	
	var CamFOVLoc = gl.getUniformLocation(program1, "uCamFOV");
    gl.uniform1f(CamFOVLoc, uCamFOV);
	
	var CamRotationLoc = gl.getUniformLocation(program1, "uCamRotation");
    gl.uniform2fv(CamRotationLoc, uCamRotation);

	
	
	
	
	// Create framebuffer
	const depthFramebuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);

	// Create RGB texture for depth
	const depthTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, depthTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

	// Set texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	// Attach the color texture to the framebuffer
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, depthTexture, 0);

	// Make sure the framebuffer is complete
	if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
		console.log('Depth framebuffer not complete');
	}

	// Unbind to avoid accidental modifications
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	// Bind the depth framebuffer
	gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);

	// Set the viewport to the size of the depth texture
	gl.viewport(0, 0, canvas.width, canvas.height);

	// Render the scene and pack depth values into depthTexture
	render(vBuffer);

	// Unbind the framebuffer to go back to default rendering
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);




	// NOW beginning second rendering phase
	var program2 = initShaders(gl, "vertex-shader2", "fragment-shader2");
	gl.useProgram(program2);

	positionLoc = gl.getAttribLocation(program2, "aPosition");
	var colorLoc = gl.getAttribLocation(program2, "aColor");

	// Set up vertex attributes (called once)
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(positionLoc);

	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(colorLoc);

	// Bind the depth texture
	gl.activeTexture(gl.TEXTURE0); // Use texture unit 0
	gl.bindTexture(gl.TEXTURE_2D, depthTexture);

	// Set the uniform in the shader program (there is a sampler2D in the shader)
	var depthTextureLocation = gl.getUniformLocation(program2, "uDepthTexture");
	gl.uniform1i(depthTextureLocation, 0); // 0 corresponds to TEXTURE0

	CamPositionLoc = gl.getUniformLocation(program2, "uCamPosition");
	gl.uniform3fv(CamPositionLoc, cam);

	var EyePositionLoc = gl.getUniformLocation(program2, "uEyePosition");
	gl.uniform3fv(EyePositionLoc, eye);
	
	CamFOVLoc = gl.getUniformLocation(program2, "uCamFOV");
    gl.uniform1f(CamFOVLoc, uCamFOV);
	
	CamRotationLoc = gl.getUniformLocation(program2, "uCamRotation");
    gl.uniform2fv(CamRotationLoc, uCamRotation);

	gl.viewport(0, 0, canvas.width, canvas.height);

	// Render with the depth texture
	render2(vBuffer, cBuffer);
	
	
}

function makeScene(){
	// clear positions, normals, colors
	numPositions = 0;
	positions = [];
	colors = [];
	
	// make the quads for the room here
	
	// FLOOR
	makeQuad(vec4(-1, -1, -2, 1), vec4(4, 3, -2, 1), 1, vec4(1, 1, 1, 1));
	
	// WALLS
	makeQuad(vec4(0, 0, -2, 1), vec4(0, 2, -1, 1), 2, vec4(1, 0, 0, 1));
	makeQuad(vec4(0, 2, -1, 1), vec4(3, 2, -2, 1), 2, vec4(0, 1, 0, 1));
	makeQuad(vec4(3, 2, -2, 1), vec4(3, 0, -1, 1), 2, vec4(0, 0, 1, 1));
	makeQuad(vec4(3, 0, -1, 1), vec4(2, 0, -2, 1), 2, vec4(1, 0, 0, 1));
	makeQuad(vec4(2, 0, -2, 1), vec4(2, 1, -1, 1), 2, vec4(0, 1, 0, 1));
	makeQuad(vec4(2, 1, -1, 1), vec4(1, 1, -2, 1), 2, vec4(0, 0, 1, 1));
	makeQuad(vec4(1, 1, -2, 1), vec4(1, 0, -1, 1), 2, vec4(1, 0, 0, 1));
	makeQuad(vec4(1, 0, -1, 1), vec4(0, 0, -2, 1), 2, vec4(0, 1, 0, 1));
}

function render(vBuffer) {
    
	// Upload updated data to GPU
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);

    // clear the screen
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // draw the objects
    gl.drawArrays(gl.TRIANGLES, 0, numPositions);

}

function render2(vBuffer, cBuffer) {
    
    // Upload updated data to GPU
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);
	
	// Upload updated data to GPU
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    // clear the screen
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // draw the objects
    gl.drawArrays(gl.TRIANGLES, 0, numPositions);

}


function makeTri(v1, v2, v3, c1, c2, c3){
	
	//pretty basic. numPositions is incremented by 3, and reset to zero at each call to render
	
	positions.push(v1);
	positions.push(v2);
	positions.push(v3);
	
	colors.push(c1);
	colors.push(c2);
	colors.push(c3);
	
	numPositions += 3;
	
}

function makeQuad(v1, v2, axis, c){ // two opposite corners and axis
	
	var v3 = vec4(v1[0], v1[1], v1[2], v1[3]);
	var v4 = vec4(v2[0], v2[1], v2[2], v2[3]);
	v3[axis] = v2[axis];
	v4[axis] = v1[axis];
	
	makeTri(v1, v2, v3, c, c, c);
	makeTri(v1, v2, v4, c, c, c);
	
}
