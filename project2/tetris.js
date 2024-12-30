/*
Gregory Nothnagel
Project 2
CS 535

Description: The main thrust of the rationale and the details of implementation can be found in the Tetrimino class comments. Basically, clicking and dragging works as I'm sure you'd expect. The things you might not expect:

I couldn't figure out how to make the minos not overlap in a gross looking way. Dragging overlapped pieces works fine but it just looks bad. I think maybe I should have incorporated depth into position from the very beginning, but going back to change that now would be too difficult.

Rotation occurs around EXACTLY where your mouse clicks, not in the middle of the mino you click on. So technically the tetrimino rotates around the mino you clicked, but it's not quite as satisfying as a perfect grid-like rotation.

I wasn't sure if the mino should disappear as soon as it touches the border, or only if let go on the border, so I just assumed as soon as it touches because that's kind of classic video game mechanics. That is all, enjoy :)



*/


"use strict";

var canvas;
var gl;
var maxNumPositions = 2000;
var scale = 2.0 / 28;
var selectedTetrimino = null;


class Tetrimino {
	
	constructor() {
		
		this.original = true; // bool for whether this tetrimino is one of the original 7
		
		this.offsets = []; // offsets of all tetrimino points from this tetrimino's origin, assuming no rotating, scaling or shifting of the piece. This is like the blueprint for the tetrimino's shape. These points almost never change, except when a user clicks the tetrimino and the origin is set to where the user clicked, then these points are shifted TEMPORARILY so that the moving animation is smooth. They're shifted right back after the user lets go of the tetrimino
		
		this.origin = vec2(0, 0); // this is where the tetrimino is on the canvas
		
		this.colors = []; // triangle colors
		
		this.lineColors = []; // line colors
		
		this.rotation = 0; // this is how many radians the tetrimino is rotated counter-clockwise about its origin. The reason that this and origin are kept track of is because when render() is called, origin, rotation and scale are applied to all of offset points to create the tetrimino as it appears on the screen. "Why not just rotate the points without keeping track of rotation or the offsets "blueprint"? " Because that would make it harder to detect which mino the user clicks on. Translating the user's click position vector to the "blueprint" space which has nice whole numbers makes it easy to tell which mino the user has clicked.
		
		this.offsetChange = vec2(0, 0);
		
	}
	
	// translates point from mino "blueprint" space into the actual place on the canvas where it will be displayed
	transform(v){
		
		return add(this.origin, mult(scale, rotate2D(v, this.rotation)));
		
	}
	
	// this is useful because you can take the user's click position and translate it into the mino "blueprint space", where it's very easy to see which mino the cursor is over
	reverseTransform(v){
		
		return rotate2D(mult(1.0 / scale, subtract(v, this.origin)), -this.rotation);
		
	}
	
	// for making the duplicate tetriminos. Everything is the same except for original status boolean, which is obviously set to false
	copy(){
		
		var copy_Tetrimino = new Tetrimino();
		copy_Tetrimino.original = false;
		for (let i = 0; i < this.offsets.length; i++) copy_Tetrimino.offsets.push(this.offsets[i]);
		copy_Tetrimino.origin = this.origin;
		for (let i = 0; i < this.colors.length; i++) copy_Tetrimino.colors.push(this.colors[i]);
		for (let i = 0; i < this.lineColors.length; i++) copy_Tetrimino.lineColors.push(this.lineColors[i]);
		copy_Tetrimino.rotation = this.rotation;
		copy_Tetrimino.offsetChange = this.offsetChange;
		
		return copy_Tetrimino;
		
	}
  
}

init();


function init() {
	canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(.5, .5, .5, 1);


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


	var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumPositions, gl.STATIC_DRAW);
    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
	
	
	var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumPositions, gl.STATIC_DRAW );
    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);
	


	// setting the boundary
	var boundaryPoints = [
		vec2(-1, -1),
		vec2(-1, -1 + scale),
		vec2(1, -1),
		
		vec2(1, -1 + scale),
		vec2(1, -1),
		vec2(-1, -1 + scale),
	]
	var boundaryColors = [
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
	]


	
	var O_Tetrimino = new Tetrimino();
	O_Tetrimino.original = true;
	O_Tetrimino.origin = vec2(-1 + 1.5 * scale, 1 - 1.5 * scale);
	O_Tetrimino.offsets = [
		vec2(-1, -1),
		vec2(0, -1),
		vec2(-1, 0),
		vec2(0, 0),
		vec2(0, -1),
		vec2(-1, 0),
		
		vec2(0, -1),
		vec2(1, -1),
		vec2(0, 0),
		vec2(1, 0),
		vec2(1, -1),
		vec2(0, 0),
		
		vec2(-1, 0),
		vec2(0, 0),
		vec2(-1, 1),
		vec2(0, 1),
		vec2(0, 0),
		vec2(-1, 1),
		
		vec2(0, 0),
		vec2(0, 1),
		vec2(1, 0),
		vec2(1, 1),
		vec2(0, 1),
		vec2(1, 0),
	]
	O_Tetrimino.colors = [
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
		
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
		
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
		
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
		vec4(1, 1, 0, 1),
	]
	O_Tetrimino.lineColors = [
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
	]
	
	var I_Tetrimino = new Tetrimino();
	I_Tetrimino.original = true;
	I_Tetrimino.origin = vec2(-1 + 4.5 * scale, 1 - 1.5 * scale);
	I_Tetrimino.offsets = [
		vec2(-1, -1),
		vec2(0, -1),
		vec2(-1, 0),
		vec2(0, 0),
		vec2(0, -1),
		vec2(-1, 0),
		
		vec2(0, -1),
		vec2(1, -1),
		vec2(0, 0),
		vec2(1, 0),
		vec2(1, -1),
		vec2(0, 0),
		
		vec2(1, -1),
		vec2(2, -1),
		vec2(1, 0),
		vec2(2, 0),
		vec2(2, -1),
		vec2(1, 0),
		
		vec2(2, -1),
		vec2(3, -1),
		vec2(2, 0),
		vec2(3, 0),
		vec2(3, -1),
		vec2(2, 0),
	]
	I_Tetrimino.colors = [
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
		
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
		
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
		
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
		vec4(0, 1, 1, 1),
	]
	I_Tetrimino.lineColors = [
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
	]
	
	var T_Tetrimino = new Tetrimino();
	T_Tetrimino.original = true;
	T_Tetrimino.origin = vec2(-1 + 9.5 * scale, 1 - 1.5 * scale);
	T_Tetrimino.offsets = [
		vec2(-1, -1),
		vec2(0, -1),
		vec2(-1, 0),
		vec2(0, 0),
		vec2(0, -1),
		vec2(-1, 0),
		
		vec2(0, -1),
		vec2(1, -1),
		vec2(0, 0),
		vec2(1, 0),
		vec2(1, -1),
		vec2(0, 0),
		
		vec2(1, -1),
		vec2(2, -1),
		vec2(1, 0),
		vec2(2, 0),
		vec2(2, -1),
		vec2(1, 0),
		
		vec2(0, 0),
		vec2(1, 0),
		vec2(0, 1),
		vec2(1, 1),
		vec2(1, 0),
		vec2(0, 1),
	]
	T_Tetrimino.colors = [
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
		vec4(1, 0, 1, 1),
	]
	T_Tetrimino.lineColors = [
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
	]
	
	var L_Tetrimino = new Tetrimino();
	L_Tetrimino.original = true;
	L_Tetrimino.origin = vec2(-1 + 13.5 * scale, 1 - 1.5 * scale);
	L_Tetrimino.offsets = [
		vec2(-1, -1),
		vec2(0, -1),
		vec2(-1, 0),
		vec2(0, 0),
		vec2(0, -1),
		vec2(-1, 0),
		
		vec2(0, -1),
		vec2(1, -1),
		vec2(0, 0),
		vec2(1, 0),
		vec2(1, -1),
		vec2(0, 0),
		
		vec2(1, -1),
		vec2(2, -1),
		vec2(1, 0),
		vec2(2, 0),
		vec2(2, -1),
		vec2(1, 0),
		
		vec2(1, 0),
		vec2(2, 0),
		vec2(1, 1),
		vec2(2, 1),
		vec2(2, 0),
		vec2(1, 1),
	]
	L_Tetrimino.colors = [
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
		
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
		
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
		
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
		vec4(1, .5, 0, 1),
	]
	L_Tetrimino.lineColors = [
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
	]
	
	var J_Tetrimino = new Tetrimino();
	J_Tetrimino.original = true;
	J_Tetrimino.origin = vec2(-1 + 17.5 * scale, 1 - 1.5 * scale);
	J_Tetrimino.offsets = [
		vec2(-1, -1),
		vec2(0, -1),
		vec2(-1, 0),
		vec2(0, 0),
		vec2(0, -1),
		vec2(-1, 0),
		
		vec2(0, -1),
		vec2(1, -1),
		vec2(0, 0),
		vec2(1, 0),
		vec2(1, -1),
		vec2(0, 0),
		
		vec2(1, -1),
		vec2(2, -1),
		vec2(1, 0),
		vec2(2, 0),
		vec2(2, -1),
		vec2(1, 0),
		
		vec2(-1, 0),
		vec2(0, 0),
		vec2(-1, 1),
		vec2(0, 1),
		vec2(0, 0),
		vec2(-1, 1),
	]
	J_Tetrimino.colors = [
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
		
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
		
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
		
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
		vec4(0, 0, 1, 1),
	]
	J_Tetrimino.lineColors = [
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
	]
	
	var S_Tetrimino = new Tetrimino();
	S_Tetrimino.original = true;
	S_Tetrimino.origin = vec2(-1 + 21.5 * scale, 1 - 1.5 * scale);
	S_Tetrimino.offsets = [
		vec2(-1, -1),
		vec2(0, -1),
		vec2(-1, 0),
		vec2(0, 0),
		vec2(0, -1),
		vec2(-1, 0),
		
		vec2(0, -1),
		vec2(1, -1),
		vec2(0, 0),
		vec2(1, 0),
		vec2(1, -1),
		vec2(0, 0),
		
		vec2(0, 0),
		vec2(1, 0),
		vec2(0, 1),
		vec2(1, 1),
		vec2(1, 0),
		vec2(0, 1),
		
		vec2(1, 0),
		vec2(2, 0),
		vec2(1, 1),
		vec2(2, 1),
		vec2(2, 0),
		vec2(1, 1),
	]
	S_Tetrimino.colors = [
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
		
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
		
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
		
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
		vec4(0, 1, 0, 1),
	]
	S_Tetrimino.lineColors = [
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
	]
	
	var Z_Tetrimino = new Tetrimino();
	Z_Tetrimino.original = true;
	Z_Tetrimino.origin = vec2(-1 + 25.5 * scale, 1 - 1.5 * scale);
	Z_Tetrimino.offsets = [
		vec2(-1, 0),
		vec2(0, 0),
		vec2(-1, 1),
		vec2(0, 1),
		vec2(0, 0),
		vec2(-1, 1),
		
		vec2(0, -1),
		vec2(1, -1),
		vec2(0, 0),
		vec2(1, 0),
		vec2(1, -1),
		vec2(0, 0),
		
		vec2(1, -1),
		vec2(2, -1),
		vec2(1, 0),
		vec2(2, 0),
		vec2(2, -1),
		vec2(1, 0),
		
		vec2(0, 0),
		vec2(1, 0),
		vec2(0, 1),
		vec2(1, 1),
		vec2(1, 0),
		vec2(0, 1),
	]
	Z_Tetrimino.colors = [
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
		
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
		
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
		
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
		vec4(1, 0, 0, 1),
	]
	Z_Tetrimino.lineColors = [
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
		vec4(0, 0, 0, 1),
	]
	
	
	var Tetriminos = [O_Tetrimino, I_Tetrimino, T_Tetrimino, L_Tetrimino, J_Tetrimino, S_Tetrimino, Z_Tetrimino];

	function render(){
	
		gl.clear(gl.COLOR_BUFFER_BIT);
	
		var index

		index = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		for (let i = 0; i < Tetriminos.length; i++){
			
			var newPoints = [];
			for (let j = 0; j < Tetriminos[i].offsets.length; j++){
				newPoints.push(Tetriminos[i].transform(Tetriminos[i].offsets[j])); // rotation, scale and offset are applied to each point on the tetrimino
			}
			
			gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(newPoints));
			index += Tetriminos[i].offsets.length;
			
		}
		gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(boundaryPoints));
		index += boundaryPoints.length; // not a strictly necessary line
		
		index = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
		for (let i = 0; i < Tetriminos.length; i++){
			gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(Tetriminos[i].colors));
			index += Tetriminos[i].colors.length;
		}
		gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(boundaryColors));
		index += boundaryColors.length;
		
		gl.drawArrays(gl.TRIANGLES, 0, index);
		
		
		index = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		for (let i = 0; i < Tetriminos.length; i++){
			
			var newPoints = [];
			for (let j = 0; j < Tetriminos[i].offsets.length; j += 3){
				var newPoint1 = Tetriminos[i].transform(Tetriminos[i].offsets[j + 0]);
				var newPoint2 = Tetriminos[i].transform(Tetriminos[i].offsets[j + 1]);
				var newPoint3 = Tetriminos[i].transform(Tetriminos[i].offsets[j + 2]);
				
				// tetrimino points are listed in such an order that, for any block of 3 (that is, for any half mino), the second and third points jump across the mino diagonally, so that the first point connected with either of the second two forms a line segment that is on the mino. 2 triangles per mino with two thirds of each triangle given lines adds up to 4 lines, the 4 lines that for the mino's perimeter
				newPoints.push(newPoint1);
				newPoints.push(newPoint2);
				newPoints.push(newPoint1);
				newPoints.push(newPoint3);
			}
			
			gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(newPoints));
			index += Tetriminos[i].offsets.length * 4 / 3; // 4/3 is ratio of (points in lines around mino) to (points in triangles within mino) = 8 / 6 = 4 / 3
			
		}
		
		
		index = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
		for (let i = 0; i < Tetriminos.length; i++){
			gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(Tetriminos[i].lineColors));
			index += Tetriminos[i].lineColors.length;
		}
		
		gl.drawArrays(gl.LINES, 0, index);
		
		
		requestAnimationFrame();
	
	}

	canvas.addEventListener("mousedown", function(event){
		
		var clientPos = vec2(2 * event.clientX/canvas.width - 1, 2 * (canvas.height-event.clientY)/canvas.height - 1);
		
		
		// searching for which tetrimino user clicked from back to front of tetrimino array. This is because we want to check the originals last, in case the user drags a copy directly over an original.
		for (let i = Tetriminos.length - 1; i >= 0; i--){
			
			// checking each mino of the tetrimino to see which one to rotate about. two triangles per mino, so increment by batches of 6
			for(let j = 0; j < Tetriminos[i].offsets.length; j += 6){
				var bottomLeft = Tetriminos[i].offsets[j + 0]; // Tetrimino offset coordinates are structured so that each mino's first point is it's bottom left corner
				var topRight = Tetriminos[i].offsets[j + 3];   // Tetrimino offset coordinates are structured so that each mino's third point is it's top right corner
				var clientPositionMinoSpace = Tetriminos[i].reverseTransform(clientPos); // Where does client's cursor fall inside the "mino space"? Makes it easier to compute which mino client has clicked
					
				console.log(clientPositionMinoSpace);
					
				//aka if the client has clicked this particular mino
				if (clientPositionMinoSpace[0] > bottomLeft[0] && clientPositionMinoSpace[1] > bottomLeft[1] && clientPositionMinoSpace[0] < topRight[0] && clientPositionMinoSpace[1] < topRight[1]) {
					
					// if mino is part of original tetrimino, make a copy and push that copy to the list of all tetriminos on the board
					if (Tetriminos[i].original) {
						var new_Tetrimino = Tetriminos[i].copy();
						Tetriminos.push(new_Tetrimino);
						
						// When the user drags a tetrimino, the mino they've clicked is always the origin (to make rotation easier)
						// but moving the origin to the cursor moves the points on the tetrimino as well, so we need to move those points back to where they were before we clicked. After all, we don't want the tetrimino points to move, just the origin
						new_Tetrimino.offsetChange = clientPositionMinoSpace;
						for(let j = 0; j < new_Tetrimino.offsets.length; j++){
							new_Tetrimino.offsets[j] = subtract(new_Tetrimino.offsets[j], new_Tetrimino.offsetChange);
						}
						
						// The new copied tetrimino is now the one marked as selected by the user, so this is the one that will be dragged
						selectedTetrimino = new_Tetrimino;
						
					}
					else Tetriminos[i].offsetChange = clientPositionMinoSpace;
					break;
				}
					
			}
			
			// this conditional can only execute if copy tetrimino has been clicked on and not one of the originals
			if (!equal(Tetriminos[i].offsetChange, vec2(0, 0))){
				
				// When the user drags a tetrimino, the mino they've clicked is always the origin (to make rotation easier)
				// but moving the origin to the cursor moves the points on the tetrimino as well, so we need to move those points back to where they were before we clicked. After all, we don't want the tetrimino points to move, just the origin
				for(let j = 0; j < Tetriminos[i].offsets.length; j++){
					Tetriminos[i].offsets[j] = subtract(Tetriminos[i].offsets[j], Tetriminos[i].offsetChange);
				}
				selectedTetrimino = Tetriminos[i];
				break;
			}
		}
		
		// executes when a tetrimino of any kind has been clicked
		if (selectedTetrimino != null) {
			
			selectedTetrimino.origin = clientPos;
			
			// if the shift key was being pressed during click, rotate this tetrimino about the new origin determined by click location
			if (event.shiftKey){
					
				selectedTetrimino.rotation += .5 * Math.PI;
				
				// delete this Tetrimino if it overlaps the boundary
				for (let j = 0; j < selectedTetrimino.offsets.length; j++){
					var transformedPoint = selectedTetrimino.transform(selectedTetrimino.offsets[j]);
					if (transformedPoint[1] < -1 + scale){
						deleteFromTetriminos(selectedTetrimino);
					}
				}
				
				render(); // render only if the tetrimino has been rotated
				
			}
			
		}
		
	});
	
	canvas.addEventListener("mousemove", function(event){
		if (selectedTetrimino != null) {
			
			// since the positions of all points on any tetrimino are derived from its origin during rendering, move the origin and you move the whole tetrimino
			selectedTetrimino.origin = vec2(2 * event.clientX/canvas.width - 1, 2 * (canvas.height-event.clientY)/canvas.height - 1);
			
			// delete this Tetrimino if it overlaps the boundary
			for (let j = 0; j < selectedTetrimino.offsets.length; j++){
				var transformedPoint = selectedTetrimino.transform(selectedTetrimino.offsets[j]);
				if (transformedPoint[1] < -1 + scale){
					deleteFromTetriminos(selectedTetrimino);
				}
			}
			
		}
		render();
    } );
	
	canvas.addEventListener("mouseup", function(event){

		if (selectedTetrimino != null){
			console.log(selectedTetrimino.offsetChange);
			for(let j = 0; j < selectedTetrimino.offsets.length; j++){
				selectedTetrimino.offsets[j] = add(selectedTetrimino.offsets[j], selectedTetrimino.offsetChange);
			}
			
			selectedTetrimino.origin = selectedTetrimino.transform(mult(-1, selectedTetrimino.offsetChange));
			
			selectedTetrimino.offsetChange = vec2(0, 0);
		}
		
		selectedTetrimino = null;
		
		render();
		
    });
	
	function deleteFromTetriminos(selectedTetrimino){
		
		for(let i = 0; i < Tetriminos.length; i++){
			
			//swap to back and delete
			if (selectedTetrimino == Tetriminos[i]){
				
				var temp = Tetriminos[i];
				Tetriminos[i] = Tetriminos[Tetriminos.length - 1];
				Tetriminos[Tetriminos.length - 1] = temp;
				Tetriminos.pop();
				
			}
			
		}
		
	}

}


function rotate2D(v, theta){
	
	return vec2(Math.cos(theta) * v[0] - Math.sin(theta) * v[1], Math.sin(theta) * v[0] + Math.cos(theta) * v[1]);
	
}