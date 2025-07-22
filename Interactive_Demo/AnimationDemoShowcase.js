import {circleFunct, sineFunct, vertAxis, horizAxis, polyLine, linearFunct, sqrtFunct, absFunct, cosFunct, cubicFunct, quadraticFunct, expFunct, drawGraphBackground } from "./AnimationDemo.js";

const svg = document.querySelector("svg");
const select = document.querySelector("select");
console.log(document.getElementsByTagName('*').length);


function clearSvg() {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
}

function drawAxes() {
  new polyLine(horizAxis(), {
    
    width: 0.02, 
    arrow: "marker-end",
    arrowHei: "0",
    arrowWid: "0",
    stroke: "black"
  
  }).appendTo(svg);

  new polyLine(vertAxis(), {
    
    width: 0.02, 
    arrow: "marker-end",
    arrowHei: "3",
    arrowWid: "2",
    stroke: "black"
  
  }).appendTo(svg);
}

function runSelected() {
  clearSvg();
  drawGraphBackground(svg);
  drawAxes();

  switch(select.value) {
    case "linear":
      new polyLine(linearFunct(), {

        stroke: "blue",
        width: 0.04,
        fill: "none",
        svgTransform: "matrix(120 0 0 -120 350 400)"

      }).appendTo(svg);
      break;
    }
}

select.addEventListener("change", runSelected);

runSelected();