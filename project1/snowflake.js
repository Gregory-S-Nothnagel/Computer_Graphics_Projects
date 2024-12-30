/*
Gregory Nothnagel
CS 535
Project #1

description: Creates a koch snowflake recursively using WebGL.

*/


//
// required global variables
//

// specify number of iterations here
var iterations = 5;
var maxIterations = iterations;

// I know it's called "finalTriangles", but at the start it's technically the initial triangle, so this is what you edit to change the initial position.
// this initial triangle must be equilateral for correct output
var finalTriangles = [
        0.0 / 2, 1.0 / 2,    				   0, 1, 0,
        -Math.sin(Math.PI / 3) / 2, -0.5 / 2,  0, 1, 0,
        Math.sin(Math.PI / 3) / 2, -0.5 / 2,   0, 1, 0
    ];






// this is a neat trick I learned from a YT video. No Common directory needed!

// very basic vertex shader, just takes in a vertex position and color, sets the color to be passed to the fragment shader, and determines the position of the vertex in clip space.
var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'',
'void main()',
'{',
'  fragColor = vertColor;',
'  gl_Position = vec4(vertPosition, 0.0, 1.0);',
'}'
].join('\n');

// also very basic fragment shader, just takes the color from the vertex shader and outputs it as the final color of the pixel (gl_FragColor). The fragColor has RGB components, as well as an alpha component set to 1.0
var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

function drawShape(gl, program, vertices) {
    var triangleVertices = new Float32Array(vertices);

    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute (X, Y)
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute (R, G, B)
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length * 2 / 5); // vertices.length * 2 / 5 is the number of triangles to be drawn
}


// vertices array contains 3 positions.
// First two are positions of the points of the line segment that will be trisected.
// Third position is reflected over line segment of first two points to get the third point of the triangle that this iteration of the kochrecurse function yields
function kochRecurse(iterNumber, gl, program, vertices){
	
	if (iterNumber > 0){
		
		var newVertices = [
			vertices[0] * 2/3 + vertices[2] * 1/3,
			vertices[1] * 2/3 + vertices[3] * 1/3,    0, 1, 1 - iterNumber / maxIterations,
			vertices[0] * 1/3 + vertices[2] * 2/3,
			vertices[1] * 1/3 + vertices[3] * 2/3,    0, 1, 1 - iterNumber / maxIterations,
			vertices[0] + vertices[2] - vertices[4],
			vertices[1] + vertices[3] - vertices[5],  0, 1, 1 - iterNumber / maxIterations
		];
		
		finalTriangles = finalTriangles.concat(newVertices);
		
		var nextCallVertices1 = [
			newVertices[0], newVertices[1],
			newVertices[10], newVertices[11],
			(newVertices[0] + newVertices[5] + newVertices[10]) / 3, (newVertices[1] + newVertices[6] + newVertices[11]) / 3
		];
		
		kochRecurse(iterNumber - 1, gl, program, nextCallVertices1);
		
		var nextCallVertices2 = [
			newVertices[5], newVertices[6],
			newVertices[10], newVertices[11],
			(newVertices[0] + newVertices[5] + newVertices[10]) / 3, (newVertices[1] + newVertices[6] + newVertices[11]) / 3
		];
		
		kochRecurse(iterNumber - 1, gl, program, nextCallVertices2);
		
		var nextCallVertices3 = [
			vertices[0],
			vertices[1],
			vertices[0] * 2/3 + vertices[2] * 1/3,
			vertices[1] * 2/3 + vertices[3] * 1/3,
			vertices[0] * 2/3 + vertices[4] * 1/3,
			vertices[1] * 2/3 + vertices[5] * 1/3
		];
		
		kochRecurse(iterNumber - 1, gl, program, nextCallVertices3);
		
		var nextCallVertices4 = [
			vertices[2],
			vertices[3],
			vertices[2] * 2/3 + vertices[0] * 1/3,
			vertices[3] * 2/3 + vertices[1] * 1/3,
			vertices[2] * 2/3 + vertices[4] * 1/3,
			vertices[3] * 2/3 + vertices[5] * 1/3
		];
		
		kochRecurse(iterNumber - 1, gl, program, nextCallVertices4);
		
	}
	
}

var InitDemo = function () {
	console.log('This is working');

	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//
	// Create shaders
	// 
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}



	gl.useProgram(program);
	
	
	// recurse function is called 3 times on each side of the initial triangle
	var vertices2 = [
        finalTriangles[0], finalTriangles[1],
        finalTriangles[5], finalTriangles[6],
        0.0, 0.0
    ];
	
	kochRecurse(iterations, gl, program, vertices2);
	
	var vertices3 = [
        finalTriangles[0], finalTriangles[1],
        finalTriangles[10], finalTriangles[11],
        0.0, 0.0
    ];
	
	kochRecurse(iterations, gl, program, vertices3);
	
	var vertices4 = [
        finalTriangles[5], finalTriangles[6],
        finalTriangles[10], finalTriangles[11],
        0.0, 0.0
    ];
	
	kochRecurse(iterations, gl, program, vertices4);
	
	drawShape(gl, program, finalTriangles);
	
};