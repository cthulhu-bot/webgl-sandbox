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
    this.createShaders(gl, shaderProgram);
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
    vs += 'void main(void) {'
    vs += '  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);'
    vs += '  gl_PointSize = 10.0;'
    vs += '}'

    let vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, vs)
    gl.compileShader(vertexShader)

    var fs = ''
    fs += 'void main(void) {'
    fs += '  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);'
    fs += '}'

    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, fs)
    gl.compileShader(fragmentShader)

    shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
    gl.useProgram(shaderProgram)
  }
}

export default App;
