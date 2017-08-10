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
	        ref={canvas => this.canvas = canvas} />
      </div>
    );
  }

    updateCanvas() {
	    // const context = this.canvas.getContext('2d')
	    // context.fillStyle = 'red'
	    // context.fillRect(10, 10, 55, 50)
        const gl = this.canvas.getContext("webgl") ||
                   this.canvas.getContext("experimental-webgl")
        if (!gl) {
            return
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.enable(gl.DEPTH_TEST)
        gl.depthFunc(gl.LEQUAL)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    }
}

export default App;
