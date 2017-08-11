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
    let gl, shaderProgram;
    gl = this.initGL();
    shaderProgram = this.createShaders(gl, shaderProgram);
    this.createVertices(gl, shaderProgram);
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
    gl.drawArrays(gl.POINTS, 0, 1)
  }

  createShaders(gl, shaderProgram) {
    let vs = ''
    vs += 'attribute vec4 coords;'
    vs += 'attribute float pointSize;'
    vs += 'void main(void) {'
    vs += '  gl_Position = coords;'
    vs += '  gl_PointSize = pointSize;'
    vs += '}'

    let vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, vs)
    gl.compileShader(vertexShader)

    var fs = ''
    fs += 'precision mediump float;'
    fs += 'uniform vec4 color;'
    fs += 'void main(void) {'
    fs += '  gl_FragColor = color;'
    fs += '}'

    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, fs)
    gl.compileShader(fragmentShader)

    shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
    gl.useProgram(shaderProgram)

    return shaderProgram
  }

  createVertices(gl, shaderProgram) {
    // these attribLocation vars are defined as shaderAttributes above
    let coords = gl.getAttribLocation(shaderProgram, 'coords')
    gl.vertexAttrib3f(coords, 0.5, 0, 0)

    let pointSize = gl.getAttribLocation(shaderProgram, 'pointSize')
    gl.vertexAttrib1f(pointSize, 50)

    let color = gl.getUniformLocation(shaderProgram, 'color')
    gl.uniform4f(color, 1, 0, 1, 1)
  }
}

export default App;
