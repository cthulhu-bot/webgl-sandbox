import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  getInitialState() {
    return {
      millis: Date.now(),
      request: 0
    }
  }

  componentDidMount() {
    this.updateCanvas()
    this.setState({
      request: requestAnimationFrame(this.tick)
    })
  }

  componentWillReceiveProps() {
    this.updateCanvas()
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.state.request)
  }

  tick() {
    this.setState({
      millis: Date.now(),
      request: requestAnimationFrame(this.tick)
    })
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
    let gl, shaderProgram, vertices, vertexCount = 5000, angle = 0;
    gl = this.initGL();
    shaderProgram = this.createShaders(gl, shaderProgram);
    this.createVertices(gl, shaderProgram, vertices, vertexCount);
    this.draw(gl, vertexCount, angle, shaderProgram);
  }

  draw(gl, vertexCount, angle, shaderProgram) {
    this.rotateZ(angle += 0.01, shaderProgram, gl)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // just draw points
    //    gl.drawArrays(gl.POINTS, 0, 3)

    // just draw lines
    // gl.drawArrays(gl.LINE_STRIP, 0, 3)

    // draw an empty closed triangle
    //    gl.drawArrays(gl.LINE_LOOP, 0, 3)

    // draw filled closed triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3)

    // gl.drawArrays(gl.POINTS, 0, vertexCount)

    // won't animate without call to animationFrame
    // requestAnimationFrame(this.draw)
  }

  createVertices(gl, shaderProgram, vertices, vertexCount) {
    // UPDATE VERTICES POSITION HERE
    vertices = [
      -0.9, -0.9, 0.0,
      0.9, -0.9, 0.0,
      0.0, 0.9, 0.0
    ]

    // Randomize vertex points here
    // vertices = []
    // for (var i = 0; i < vertexCount; i++) {
    //   vertices.push(Math.random() * 2 - 1)
    //   vertices.push(Math.random() * 2 - 1)
    // }
    let buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    // these attribLocation vars are defined as shaderAttributes above
    let coords = gl.getAttribLocation(shaderProgram, 'coords')
    //    gl.vertexAttrib3f(coords, 0.5, 0, 0)

    // the 2 param indicates a 2d coord system    
    // gl.vertexAttribPointer(coords, 2, gl.FLOAT, false, 0, 0)
    gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(coords)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    // UPDATE POINTSIZE HERE
    let pointSize = gl.getAttribLocation(shaderProgram, 'pointSize')
    gl.vertexAttrib1f(pointSize, 2)

    // UPDATE COLOR HERE
    let color = gl.getUniformLocation(shaderProgram, 'color')
    gl.uniform4f(color, 0, 0, 0, 1)
  }

  rotateZ(angle, shaderProgram, gl) {
    let cos = Math.cos(angle),
        sin = Math.sin(angle),
        matrix = new Float32Array(
                                  [cos,  sin, 0, 0,
                                   -sin, cos, 0, 0,
                                   0,      0, 1, 0,
                                   0,      0, 0, 1])
    let transformMatrix = gl.getUniformLocation(shaderProgram, 'transformMatrix')
    gl.uniformMatrix4fv(transformMatrix, false, matrix)
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
}

export default App;
