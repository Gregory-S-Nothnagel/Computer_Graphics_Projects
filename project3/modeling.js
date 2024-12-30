/*
Gregory Nothnagel
Project #3
CS 535

Description: Colored cylinders and boxes are combined in a scene to display a gas station sign. Buttons exist to rotate the scene in 3D space and change the numbers on the sign.

Details: There is a function Cylinder() which places a cylinder which places a cylinder where you want in the scene with desired rotation and scale and color. The Cylinder() and makebox() function both use the Tri() function, which creates a triangle from the given vertices, vert normals and vert colors. Normals for each vertex of a cylinder/box are calculated by normalizing their position values after rotating and scaling but prior to moving positions. Along with a uniform viewing angle rotation theta, there is also a uniform light direction used for vertex normal shading, in the direction of [1.0, 1.0, 1.0] (see init() funtion).

*/


"use strict";


//These are all the templates for different letters and digits. They are used to determine where cylinders are placed.
var A = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1]
];

var D = [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0]
];

var E = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1]
];

var G = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
];

var I = [
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0]
];

var L = [
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1]
];

var M = [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1]
];

var N = [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1]
];

var P = [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0]
];

var R = [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1]
];

var S = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
];

var U = [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
];

var digit_0 = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
];

var digit_1 = [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [1, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1]
];

var digit_2 = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1]
];

var digit_3 = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
];

var digit_4 = [
    [0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0]
];

var digit_5 = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
];

var digit_6 = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
];

var digit_7 = [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0]
];

var digit_8 = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
];

var digit_9 = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
];




var canvas;
var gl;

var numPositions = 0;

var positions = [];
var normals = [];
var colors = [];

var xAxis = 0; // axis labels for more readable code 
var yAxis = 1;
var zAxis = 2;

var axis = 0; // which axis we're changing the rotation of
var theta = [0, 0, 0]; // scene rotation

var thetaLoc;

var viewScale = 150; // applied to vertex position w-coords to have the ultimate effect of scaling the scene

var rotate_flag = false;

var gas_numbers = [100, 100, 100];
var gas_index = 0; // default is unleaded

init();

function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

	// enable depth testing so WebGL doesn't just draw objects in the order they are sent to the GPU and draws them in depth order
    gl.enable(gl.DEPTH_TEST);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var vBuffer = gl.createBuffer();
    var nBuffer = gl.createBuffer();
	var cBuffer = gl.createBuffer();

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    var normalLoc = gl.getAttribLocation(program, "aNormal");
	var colorLoc = gl.getAttribLocation(program, "aColor");

    thetaLoc = gl.getUniformLocation(program, "uTheta");
    var lightDirectionLoc = gl.getUniformLocation(program, "uLightDirection");

    // Set the light direction
    gl.uniform3fv(lightDirectionLoc, [1.0, 1.0, 1.0]);

    // Set up vertex attributes (called once)
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

	// Set up normal attributes (called once)
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);
	
	// Set up color attributes (called once)
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

	// a ton of event listeners for the various activities
    document.getElementById("xButton").onclick = function () {
        axis = xAxis;
    };
    document.getElementById("yButton").onclick = function () {
        axis = yAxis;
    };
    document.getElementById("zButton").onclick = function () {
        axis = zAxis;
    };
	document.getElementById("UNLEADED").onclick = function () {
        gas_index = 0;
    };
	document.getElementById("MIDGRADE").onclick = function () {
        gas_index = 1;
    };
	document.getElementById("SUPREME").onclick = function () {
        gas_index = 2;
    };
	document.getElementById("Up").onclick = function () {
        gas_numbers[gas_index] = Math.min(999, gas_numbers[gas_index] + 1);
    };
	document.getElementById("Down").onclick = function () {
        gas_numbers[gas_index] = Math.max(0, gas_numbers[gas_index] - 1);
    };
	document.getElementById("Start").onclick = function () {
        rotate_flag = true;
    };
	document.getElementById("Stop").onclick = function () {
        rotate_flag = false;
    };

    // Start the render loop
    render(vBuffer, nBuffer, cBuffer);
}

function makebox(position, scales, color) {
	
	//I just brute forced this code without trying to make something fancy, since it was faster to implement and it works
	//multiplying the w coord of each vertex has a scaling effect when the scene is projected to the camera, since all coords are scaled to w coord before rendering each vertex
	
	makeTri(
	vec4(position[0] - scales[0], position[1] - scales[1], position[2] - scales[2], 1.0 * viewScale),
	vec4(position[0] - scales[0], position[1] - scales[1], position[2] + scales[2], 1.0 * viewScale),
	vec4(position[0] - scales[0], position[1] + scales[1], position[2] - scales[2], 1.0 * viewScale),
	normalize(vec3(-scales[0], -scales[1], -scales[2])),
	normalize(vec3(-scales[0], -scales[1], scales[2])),
	normalize(vec3(-scales[0], scales[1], -scales[2])),
	color,
	color,
	color,
	);
	
	makeTri(
	vec4(position[0] - scales[0], position[1] - scales[1], position[2] + scales[2], 1.0 * viewScale),
	vec4(position[0] - scales[0], position[1] + scales[1], position[2] - scales[2], 1.0 * viewScale),
	vec4(position[0] - scales[0], position[1] + scales[1], position[2] + scales[2], 1.0 * viewScale),
	normalize(vec3(-scales[0], -scales[1], scales[2])),
	normalize(vec3(-scales[0], scales[1], -scales[2])),
	normalize(vec3(-scales[0], scales[1], scales[2])),
	color,
	color,
	color,
	);
	
	makeTri(
	vec4(position[0] - scales[0], position[1] + scales[1], position[2] - scales[2], 1.0 * viewScale),
	vec4(position[0] - scales[0], position[1] + scales[1], position[2] + scales[2], 1.0 * viewScale),
	vec4(position[0] + scales[0], position[1] + scales[1], position[2] - scales[2], 1.0 * viewScale),
	normalize(vec3(-scales[0], scales[1], -scales[2])),
	normalize(vec3(-scales[0], scales[1], scales[2])),
	normalize(vec3(scales[0], scales[1], -scales[2])),
	color,
	color,
	color,
	);
	
	makeTri(
	vec4(position[0] - scales[0], position[1] + scales[1], position[2] + scales[2], 1.0 * viewScale),
	vec4(position[0] + scales[0], position[1] + scales[1], position[2] - scales[2], 1.0 * viewScale),
	vec4(position[0] + scales[0], position[1] + scales[1], position[2] + scales[2], 1.0 * viewScale),
	normalize(vec3(-scales[0], scales[1], scales[2])),
	normalize(vec3(scales[0], scales[1], -scales[2])),
	normalize(vec3(scales[0], scales[1], scales[2])),
	color,
	color,
	color,
	);
	
	makeTri(
	vec4(position[0] + scales[0], position[1] + scales[1], position[2] - scales[2], 1.0 * viewScale),
	vec4(position[0] + scales[0], position[1] + scales[1], position[2] + scales[2], 1.0 * viewScale),
	vec4(position[0] + scales[0], position[1] - scales[1], position[2] - scales[2], 1.0 * viewScale),
	normalize(vec3(scales[0], scales[1], -scales[2])),
	normalize(vec3(scales[0], scales[1], scales[2])),
	normalize(vec3(scales[0], -scales[1], -scales[2])),
	color,
	color,
	color,
	);
	
	makeTri(
	vec4(position[0] + scales[0], position[1] + scales[1], position[2] + scales[2], 1.0 * viewScale),
	vec4(position[0] + scales[0], position[1] - scales[1], position[2] - scales[2], 1.0 * viewScale),
	vec4(position[0] + scales[0], position[1] - scales[1], position[2] + scales[2], 1.0 * viewScale),
	normalize(vec3(scales[0], scales[1], scales[2])),
	normalize(vec3(scales[0], -scales[1], -scales[2])),
	normalize(vec3(scales[0], -scales[1], scales[2])),
	color,
	color,
	color,
	);
	
	makeTri(
	vec4(position[0] + scales[0], position[1] - scales[1], position[2] - scales[2], 1.0 * viewScale),
	vec4(position[0] + scales[0], position[1] - scales[1], position[2] + scales[2], 1.0 * viewScale),
	vec4(position[0] - scales[0], position[1] - scales[1], position[2] - scales[2], 1.0 * viewScale),
	normalize(vec3(scales[0], -scales[1], -scales[2])),
	normalize(vec3(scales[0], -scales[1], scales[2])),
	normalize(vec3(-scales[0], -scales[1], -scales[2])),
	color,
	color,
	color,
	);
	
	makeTri(
	vec4(position[0] + scales[0], position[1] - scales[1], position[2] + scales[2], 1.0 * viewScale),
	vec4(position[0] - scales[0], position[1] - scales[1], position[2] - scales[2], 1.0 * viewScale),
	vec4(position[0] - scales[0], position[1] - scales[1], position[2] + scales[2], 1.0 * viewScale),
	normalize(vec3(scales[0], -scales[1], scales[2])),
	normalize(vec3(-scales[0], -scales[1], -scales[2])),
	normalize(vec3(-scales[0], -scales[1], scales[2])),
	color,
	color,
	color,
	);
	
	
	makeTri(
	vec4(position[0] - scales[0], position[1] - scales[1], position[2] + scales[2], 1.0 * viewScale),
	vec4(position[0] - scales[0], position[1] + scales[1], position[2] + scales[2], 1.0 * viewScale),
	vec4(position[0] + scales[0], position[1] + scales[1], position[2] + scales[2], 1.0 * viewScale),
	normalize(vec3(-scales[0], -scales[1], scales[2])),
	normalize(vec3(-scales[0], scales[1], scales[2])),
	normalize(vec3(scales[0], scales[1], scales[2])),
	color,
	color,
	color,
	);
	
	makeTri(
	vec4(position[0] - scales[0], position[1] - scales[1], position[2] + scales[2], 1.0 * viewScale),
	vec4(position[0] + scales[0], position[1] + scales[1], position[2] + scales[2], 1.0 * viewScale),
	vec4(position[0] + scales[0], position[1] - scales[1], position[2] + scales[2], 1.0 * viewScale),
	normalize(vec3(-scales[0], -scales[1], scales[2])),
	normalize(vec3(scales[0], scales[1], scales[2])),
	normalize(vec3(scales[0], -scales[1], scales[2])),
	color,
	color,
	color,
	);
	
	makeTri(
	vec4(position[0] - scales[0], position[1] - scales[1], position[2] - scales[2], 1.0 * viewScale),
	vec4(position[0] + scales[0], position[1] + scales[1], position[2] - scales[2], 1.0 * viewScale),
	vec4(position[0] - scales[0], position[1] + scales[1], position[2] - scales[2], 1.0 * viewScale),
	normalize(vec3(-scales[0], -scales[1], -scales[2])),
	normalize(vec3(scales[0], scales[1], -scales[2])),
	normalize(vec3(-scales[0], scales[1], -scales[2])),
	color,
	color,
	color,
	);
	
	makeTri(
	vec4(position[0] - scales[0], position[1] - scales[1], position[2] - scales[2], 1.0 * viewScale),
	vec4(position[0] + scales[0], position[1] + scales[1], position[2] - scales[2], 1.0 * viewScale),
	vec4(position[0] + scales[0], position[1] - scales[1], position[2] - scales[2], 1.0 * viewScale),
	normalize(vec3(-scales[0], -scales[1], -scales[2])),
	normalize(vec3(scales[0], scales[1], -scales[2])),
	normalize(vec3(scales[0], -scales[1], -scales[2])),
	color,
	color,
	color,
	);
	
}

function makeTri(v1, v2, v3, n1, n2, n3, c1, c2, c3){
	
	//pretty basic. numPositions is incremented by 3, and reset to zero at each call to render
	
	positions.push(v1);
	positions.push(v2);
	positions.push(v3);
	
	normals.push(n1);
	normals.push(n2);
	normals.push(n3);
	
	colors.push(c1);
	colors.push(c2);
	colors.push(c3);
	
	numPositions += 3;
	
}

function Cylinder(position, scales, vertCount, rotations, color){ // vertCount is num vertices in each ring
	
	//rotation vector as a vec3 of radians
	var r = vec3(rotations[0] * (Math.PI / 180), rotations[1] * (Math.PI / 180), rotations[2] * (Math.PI / 180))

    // Rotation matrices for x, y, z axes
    var rx = mat4(1.0, 0.0, 0.0, 0.0,
                   0.0, Math.cos(r[0]), Math.sin(r[0]), 0.0,
                   0.0, -Math.sin(r[0]), Math.cos(r[0]), 0.0,
                   0.0, 0.0, 0.0, 1.0);
    var ry = mat4(Math.cos(r[1]), 0.0, -Math.sin(r[1]), 0.0,
                   0.0, 1.0, 0.0, 0.0,
                   Math.sin(r[1]), 0.0, Math.cos(r[1]), 0.0,
                   0.0, 0.0, 0.0, 1.0);
    var rz = mat4(Math.cos(r[2]), Math.sin(r[2]), 0.0, 0.0,
                   -Math.sin(r[2]), Math.cos(r[2]), 0.0, 0.0,
                   0.0, 0.0, 1.0, 0.0,
                   0.0, 0.0, 0.0, 1.0);
	
	// Scale matrix
	var scaler = mat4(scales[0], 0.0, 0.0, 0.0,
                   0.0, scales[1], 0.0, 0.0,
                   0.0, 0.0, scales[2], 0.0,
                   0.0, 0.0, 0.0, 1.0);
	
	
	
	
	var vLayer1 = []; // top layer of vertices
	var vLayer2 = []; // bottom layer of vertices
	
	var nLayer1 = []; // top layer of normals
	var nLayer2 = []; // bottom layer of normals
	
	// get verts and normals
	for (let i = 0; i < vertCount; i++){
		
		var theta = (i / vertCount) * 2 * Math.PI;
		
		var startPos1 = vec4(Math.cos(theta), Math.sin(theta), 1, 1.0 * viewScale);
		var startPos2 = vec4(Math.cos(theta),  Math.sin(theta), 0, 1.0 * viewScale);
		var endPos1 = mult(rx, mult(ry, mult(rz, mult(scaler, startPos1))));
		var endPos2 = mult(rx, mult(ry, mult(rz, mult(scaler, startPos2))));
		
		nLayer1.push(normalize(vec3(endPos1[0], endPos1[1], endPos1[2])));
		vLayer1.push(vec4(position[0] + endPos1[0], position[1] + endPos1[1], position[2] + endPos1[2], 1.0 * viewScale));
		
		nLayer2.push(normalize(vec3(endPos2[0], endPos2[1], endPos2[2])));
		vLayer2.push(vec4(position[0] + endPos2[0], position[1] + endPos2[1], position[2] + endPos2[2], 1.0 * viewScale));
		
	}
	
	// connect the correct vertices with each other to get the proper rendered triangles
	for (let i = 0; i < vertCount - 1; i++){
		
		makeTri(vLayer1[i], vLayer2[i], vLayer2[i + 1], nLayer1[i], nLayer2[i], nLayer2[i + 1], color, color, color);
		makeTri(vLayer1[i], vLayer1[i + 1], vLayer2[i + 1], nLayer1[i], nLayer1[i + 1], nLayer2[i + 1], color, color, color);
		
	}
	
	// connecting the end of the loop with the beginning of the loop with 2 triangles
	var last = vertCount - 1;
	makeTri(vLayer1[last], vLayer2[last], vLayer2[0], nLayer1[last], nLayer2[last], nLayer2[0], color, color, color);
	makeTri(vLayer1[last], vLayer1[0], vLayer2[0], nLayer1[last], nLayer1[0], nLayer2[0], color, color, color);
	
	// triangle fan from top and bottom vertex rings
	for (let i = 0; i < vertCount - 2; i++){
		
		makeTri(vLayer1[0], vLayer1[i + 1], vLayer1[i + 2], nLayer1[0], nLayer1[i + 1], nLayer1[i + 2], color, color, color);
		makeTri(vLayer2[0], vLayer2[i + 1], vLayer2[i + 2], nLayer2[0], nLayer2[i + 1], nLayer2[i + 2], color, color, color);
		
	}
	
	
}

function makeLetter(position, template, color){
	
	for (let i = 0; i < 7; i++){ // for each row of the template
		for (let j = 0; j < 5; j++){ // for each column of the template
			if (template[i][j] == 1){ // make a cylinder at that position only if value is 1
				Cylinder([position[0] + j * 2, position[1] - i * 2, position[2]], [1, 1, 1], 5, vec3(0, 0, 0), color);
			}
		}
	}
	
}

function makeWord(startPosition, templateArr, color){
	
	for (let i = 0; i < templateArr.length; i++){
		makeLetter([startPosition[0] + 12 * i, startPosition[1], startPosition[2]], templateArr[i], color); // increment by 12 units in the x-axis because each letter is 12 units wide
	}
	
}

function makeNumber(startPosition, number, color){
	
	var text = number.toString();
	
	for (let i = 0; i < 3 && i < text.length; i++){
		
		
		switch (text[i]) {
		  case '0':
			makeLetter([startPosition[0] + 12 * i, startPosition[1], startPosition[2]], digit_0, color);
			break;
		  case '1':
			makeLetter([startPosition[0] + 12 * i, startPosition[1], startPosition[2]], digit_1, color);
			break;
		  case '2':
			makeLetter([startPosition[0] + 12 * i, startPosition[1], startPosition[2]], digit_2, color);
			break;
		  case '3':
			makeLetter([startPosition[0] + 12 * i, startPosition[1], startPosition[2]], digit_3, color);
			break;
		  case '4':
			makeLetter([startPosition[0] + 12 * i, startPosition[1], startPosition[2]], digit_4, color);
			break;
		  case '5':
			makeLetter([startPosition[0] + 12 * i, startPosition[1], startPosition[2]], digit_5, color);
			break;
		  case '6':
			makeLetter([startPosition[0] + 12 * i, startPosition[1], startPosition[2]], digit_6, color);
			break;
		  case '7':
			makeLetter([startPosition[0] + 12 * i, startPosition[1], startPosition[2]], digit_7, color);
			break;
		  case '8':
			makeLetter([startPosition[0] + 12 * i, startPosition[1], startPosition[2]], digit_8, color);
			break;
		  case '9':
			makeLetter([startPosition[0] + 12 * i, startPosition[1], startPosition[2]], digit_9, color);
			break;
		}
		
	}
	
}

function render(vBuffer, nBuffer, cBuffer) {
    // clear positions, normals, colors
	numPositions = 0;
	positions = [];
	normals = [];
	colors = [];
	
	// the backboard and post of the sign
    makebox([0, 76, -5], [68, 26, 5], vec4(0, 1, 0, 1));
	Cylinder([0, -50, -5], [5, 5, 100], 20, vec3(90, 0, 0), vec4(0.5, 0.5, 0.5, 1));
	
	// gas names
	makeWord([-66, 100, 0], [U, N, L, E, A, D, E, D], vec4(1, 0, 0, 1));
	makeWord([-66, 82, 0], [M, I, D, G, R, A, D, E], vec4(0, 0, 1, 1));
	makeWord([-66, 64, 0], [S, U, P, R, E, M, E], vec4(0, 1, 1, 1));
	
	// gas prices
	makeNumber([34, 100, 0], gas_numbers[0], vec4(1, 0, 0, 1));
	makeNumber([34, 82, 0], gas_numbers[1], vec4(0, 0, 1, 1));
	makeNumber([34, 64, 0], gas_numbers[2], vec4(0, 1, 1, 1));

    // Upload updated data to GPU
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    // clear the screen
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // update rotation angles
    if (rotate_flag) theta[axis] += 1.0;
	
	// upload rotation values uniform to vertex shader
    gl.uniform3fv(thetaLoc, theta);

    // draw the objects
    gl.drawArrays(gl.TRIANGLES, 0, numPositions);

    requestAnimationFrame(function () {
        render(vBuffer, nBuffer, cBuffer);
    });
}