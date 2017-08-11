import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  componentDidMount() {
    this.updateCanvas()
  }

  componentWillReceiveProps() {
    this.updateCanvas()
  }

  render() {
    return (
      <div className="App">
        <canvas id="canvas"
          ref={canvas => this.canvas = canvas}
          height="600"
          width="800" />
      </div>
    );
  }

  updateCanvas() {
    let gl, shaderProgram, vertices;
    gl = this.initGL();
    shaderProgram = this.createShaders(gl, shaderProgram);
    this.createVertices(gl, shaderProgram, vertices);
    this.draw(gl);

  }

  initGL() {
    const gl = this.canvas.getContext("webgl") ||
      this.canvas.getContext("experimental-webgl")
    if (!gl) {
      return
    }

    gl.clearColor(1.0, 1.0, 1.0, 1.0)
    gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    return gl;
  }

  draw(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // just draw points
    //    gl.drawArrays(gl.POINTS, 0, 3)

    // just draw lines
    // gl.drawArrays(gl.LINE_STRIP, 0, 3)

    // draw an empty closed triangle
    //    gl.drawArrays(gl.LINE_LOOP, 0, 3)

    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  createShaders(gl, shaderProgram) {
    let vertexShader = this.getShader(gl, "shader-vs")
    let fragmentShader = this.getShader(gl, "shader-fs")

    shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
    gl.useProgram(shaderProgram)

    return shaderProgram
  }

  createVertices(gl, shaderProgram, vertices) {
    // UPDATE POINT POSITION HERE
    vertices = [
      -0.9, -0.9, 0.0,
      0.9, -0.9, 0.0,
      0.0, 0.9, 0.0
    ]

    let buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    // these attribLocation vars are defined as shaderAttributes above
    let coords = gl.getAttribLocation(shaderProgram, 'coords')
    //    gl.vertexAttrib3f(coords, 0.5, 0, 0)
    gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(coords)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    // UPDATE POINTSIZE HERE
    let pointSize = gl.getAttribLocation(shaderProgram, 'pointSize')
    gl.vertexAttrib1f(pointSize, 20)

    // UPDATE COLOR HERE
    let color = gl.getUniformLocation(shaderProgram, 'color')
    gl.uniform4f(color, 0, 0, 0, 1)
  }


  /*
   * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
   */
  getShader(gl, id) {
    var shaderScript, theSource, currentChild, shader;

    shaderScript = document.getElementById(id);

    if (!shaderScript) {
      return null;
    }

    theSource = "";
    currentChild = shaderScript.firstChild;

    while (currentChild) {
      if (currentChild.nodeType == currentChild.TEXT_NODE) {
        theSource += currentChild.textContent;
      }

      currentChild = currentChild.nextSibling;
    }
    if (shaderScript.type == "x-shader/x-fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      // Unknown shader type
      return null;
    }
    gl.shaderSource(shader, theSource);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }
}

export default App;
