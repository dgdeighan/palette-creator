/*
  Simple Color Palette Creator
  Author: David Deighan
  Date: 08/17/2021
  Technologies Used: JavaScript, CSS, React (Create-React-App)
  Description:
    A simple color palette tool, which allows you to choose colors by adjusting
      RGB sliders, apply colors to sections on the palette, and export the
      palette as a lossless PNG image for personal use.
    Special thanks:
      Maksim Ivanov. Without his 'LETS BUILD A DRAWING APPLICATION
      USING REACT AND CANVAS API' video, I would have had no idea how to use
      useRef to set up the canvas in React. It's a well-made, concise, and
      informative video, too!
      James Grimshaw. He made a great 5-minute video about how to get a
      React application working on GitHub pages, and that information was
      another godsend in getting this working properly.
*/

import React, { useState, useEffect, useRef } from 'react';
// import ReactDOM from 'react-dom';
//  commented out to prevent warnings, still felt it was necessary to include
import './App.css';

// Main app component
function App() {
  // color states
  let [rVal, setRVal] = useState(0);
  let [gVal, setGVal] = useState(0);
  let [bVal, setBVal] = useState(0);
  let [color, setColor] = useState(`rgb(${rVal},${gVal},${bVal})`);
  let hexVal = `#${Number(rVal).toString(16).padStart(2, '0')}${Number(gVal).toString(16).padStart(2, '0')}${Number(bVal).toString(16).padStart(2, '0')}`;
  function colorChanger(e){
    switch(e.target.id){
      case('R'):
        setRVal(rVal = e.target.value);
        break;
      case('G'):
        setGVal(gVal = e.target.value);
        break;
      case('B'):
        setBVal(bVal = e.target.value);
        break;
      default:
        break;
    }
    setColor(color = `rgb(${rVal},${gVal},${bVal})`);
  }

  useEffect(() => {
    document.title = "Simple Palette Creator";
  });

  return (
    <div className='credits'>
      <p className='descobox'>Simple Color Palette Creator. Made in React by David Deighan.</p>
      <div className='app'>
        <ColorPicker color={color} rVal={rVal} gVal={gVal} bVal={bVal} hexVal={hexVal} change={colorChanger}/>
        <PaletteCreator color={color} hexVal={hexVal} />
      </div>
    </div>
  );
}

// --Application components--
/*=======================================*/
/* COLOR PICKER */
/*=======================================*/
function ColorPicker(props) {
  let divStyle = {
    backgroundColor: props.color
  }

  return(
    <div className='color-picker'>
      <div className='color-display' style={divStyle}>
      </div>
      <div className='everything-else'>
        <p className='descriptor' hidden><strong>Color Picker</strong></p>
        <p className='descriptor'><strong>R:</strong> {props.rVal}</p>
        <ColorRange
          type='R'
          color={props.color}
          change={props.change}
        />
        <p className='descriptor'><strong>G:</strong> {props.gVal}</p>
        <ColorRange
          type='G'
          color={props.color}
          change={props.change}
        />
        <p className='descriptor'><strong>B:</strong> {props.bVal}</p>
        <ColorRange
          type='B'
          color={props.color}
          change={props.change}
        />

        <p className='hex'><strong>HEX</strong>: {props.hexVal}</p>
      </div>
    </div>
  )
}

function ColorRange(props){

  return(
    <div className='rgbUI'>
      <input type='range' onChange={props.change} id={props.type} min='0' max='255' defaultValue='0'></input>
    </div>
  );
}

/*=======================================*/
/* PALETTE CREATOR */
/*=======================================*/

function PaletteCreator(props) {
  // useRef canvas/context references
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  // useEffect to have the canvas/context be defined upon startup; empty array
  //  in second parameter means that it runs once and only once.
  useEffect(() => {
    // Creates usable canvas reference from canvasRef hook
    const canvas = canvasRef.current;
    canvas.width = 950;
    canvas.height = 600;

    // Creates usable canvas context from the canvas ref + the contextRef hook.
    const ctx = canvas.getContext('2d');
    contextRef.current = ctx;
  }, []);

  // 5 panels = 190px x 600px, width of 1 panel is 190px
  let panel = {
    h: 600,
    w: 190
  };

  function drawPanel(xPos){
    contextRef.current.beginPath();
    contextRef.current.rect(xPos, 0, panel.w, panel.h);
    contextRef.current.fillStyle = props.color;
    contextRef.current.fill();
    contextRef.current.closePath();

  }

  function drawHex(xPos){
    // Rectangle over which text will be rendered
    contextRef.current.beginPath();
    contextRef.current.rect(xPos, 550, panel.w, panel.h);
    contextRef.current.fillStyle = 'rgba(0,0,0,0.5)';
    contextRef.current.fill();
    contextRef.current.closePath();

    // Text containing the hex value of the chosen color
    contextRef.current.font = '24px consolas';
    contextRef.current.fillStyle = 'white';
    contextRef.current.fillText(props.hexVal, xPos + 10, 580);
  }

  function applyColor(e){
    switch(e.target.id){
      case('1'):
        drawPanel(0);
        drawHex(0);
        break;
      case('2'):
        drawPanel(190);
        drawHex(190);
        break;
      case('3'):
        drawPanel(380);
        drawHex(380);
        break;
      case('4'):
        drawPanel(570);
        drawHex(570);
        break;
      case('5'):
        drawPanel(760);
        drawHex(760);
        break;
      default:
        break;
    }
  }

  function resetCanvas(){
    contextRef.current.beginPath();
    contextRef.current.rect(0, 0, 950, 600);
    contextRef.current.fillStyle = 'white';
    contextRef.current.fill();
    contextRef.current.closePath();
  }

  function exportCanvas(){
    /*
      Creates a temporary anchor element and a URL containing PNG image data
        for the canvas. It then uses that anchor to store the URL and specifies
        that it should be downloaded. It auto-clicks, prompting the download,
        then removes the element immediately afterward for the sake of keeping
        the DOM clean.
    */
    const downloading = document.createElement('a');
    let whatever = canvasRef.current;
    const palette = whatever.toDataURL('image/png');
    downloading.href = palette;
    downloading.download = 'mypalette.png';
    downloading.click();
    downloading.remove();

  }

  return(
    <div className='palette-creator'>
      <div className='palette-window'>
        <canvas className='palette-canvas' ref={canvasRef}></canvas>
      </div>
      <div className='palette-ui'>
        <ApplyButton panelNum='1' applyColor={applyColor} />
        <ApplyButton panelNum='2' applyColor={applyColor} />
        <ApplyButton panelNum='3' applyColor={applyColor} />
        <ApplyButton panelNum='4' applyColor={applyColor} />
        <ApplyButton panelNum='5' applyColor={applyColor} />
        <button className='export-button' onClick={exportCanvas}>EXPORT</button>
        <button className='reset-button' onClick={resetCanvas}>RESET</button>
      </div>
    </div>
  );
}

function ApplyButton(props){
  return(
    <button className='apply-button' id={props.panelNum} onClick={props.applyColor}>APPLY COLOR</button>
  );
}

export default App;
