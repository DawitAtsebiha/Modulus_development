import {polyGon, circleFunct, sineFunct, vertAxis, horizAxis, polyLine, linearFunct, sqrtFunct, absFunct, cosFunct, cubicFunct, quadraticFunct, expFunct } from "./Demo.js";

const svg = document.querySelector("svg");
const select = document.querySelector("select");

function clearSvg() {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
}

function drawAxes() {
  new polyLine(horizAxis(), {
    
    width: 0.02, 
    arrow: "marker-end",
    arrowHei: "3",
    arrowWid: "2",
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
  drawAxes();

  switch(select.value) {
    case "linear":
      new polyLine(linearFunct(), {

        stroke: "blue",
        width: 0.04,
        fill: "none",
        svgTransform: "matrix(120 0 0 -120 350 400)"

      }).appendTo(svg).autoAnimateDot({colour: "gold", radius: 0.03});
      break;

    case "quad":
      new polyLine(quadraticFunct(), {

        stroke: "hotpink",
        width: 0.07,
        fill: "none",
        svgTransform: "matrix(80 0 0 -80 450 400)"

      }).appendTo(svg).autoAnimateDot({colour: "white", radius: 0.05});
        break;

    case "cubic":
      new polyLine(cubicFunct(), {

        stroke: "hotpink",
        width: 0.07,
        fill: "none",
        svgTransform: "matrix(70 0 0 -70 450 295)"

      }).appendTo(svg).autoAnimateDot({colour: "white", radius: 0.05});
      break;

    case "abs":
      new polyLine(absFunct(), {

        stroke: "hotpink",
        width: 0.1,
        fill: "none",
        svgTransform: "matrix(50 0 0 -50 450 400)"

      }).appendTo(svg).autoAnimateDot({colour: "white", radius: 0.07});
      break;

    case "sqrt":
      new polyLine(sqrtFunct(), {

        stroke: "hotpink",
        width: 0.03,
        fill: "none",
        svgTransform: "matrix(150 0 0 -150 350 400)"

      }).appendTo(svg).autoAnimateDot({colour: "white", radius: 0.025});
      break;

    case "exp":
    new polyLine(expFunct(), {

      stroke: "hotpink",
      width: 0.04,
      fill: "none",
      svgTransform: "matrix(130 0 0 -130 430 450)"

    }).appendTo(svg).autoAnimateDot({colour: "white", radius: 0.03});
      break;

    case "circle":
      new polyLine(circleFunct(), {

        stroke: "hotpink",
        width: 0.06,
        fill: "none",
        svgTransform: "matrix(80 0 0 -80 450 300)"

      }).appendTo(svg);
      break;

    case "sine":
      new polyLine(sineFunct(), {

        stroke: "hotpink",
        width: 0.05,
        fill: "none",
        svgTransform: "matrix(90 0 0 -80 350 300)"

      }).appendTo(svg).autoAnimateDot({colour: "white", radius: 0.045});
      break;

    case "cos":
      new polyLine(cosFunct(), {

        stroke: "hotpink",
        width: 0.05,
        fill: "none",
        svgTransform: "matrix(90 0 0 -80 350 300)"

      }).appendTo(svg).autoAnimateDot({colour: "white", radius: 0.045});
      break;
  }
}

select.addEventListener("change", runSelected);

runSelected();