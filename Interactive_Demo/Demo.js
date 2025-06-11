class baseShape {
  constructor(points, {
    stroke = "black",   // colour of lines
    width = 0.02,   // width of lines
    fill = "none",  // fills the lines with a colour (value is a colour like red, blue, etc.)
    dashed = false,   // introduces dashed lines (format is: "E D" --> with E representing pixels on and D representing pixels off, to create dashed effect)
    arrow = "none",   // adds an arrow to the end of a chart/animation, marker-end places it at the end and marker-start places it at the start
    arrowWid = "3",   // adjsts arrow width
    arrowHei = "3",   // adjusts arrow height

    svgTransform = "matrix(200 0 0 -200 350 400)"   // matrix transform to move and adjust the functions/graphs (units = 1 px)
                                                    // format is matrix(a b c d e f) with:
                                                    // a = scale of x; multiplies all x values by this value
                                                    // b = y-skew into x; every unit moved right (e) pushes the function b units up (down if negative)
                                                    // c = x-skew into y; every unit moved up (f) pushes the function c units to the right (left if negative)
                                                    // d = scale of y; multiplies all y values by this value (SVG transform treats down as positive by default this value should also be negative to flip it the right way)
                                                    // e = horizontal translate; moves all values to the right by e units (left if negative)
                                                    // f = vertical translate; moves all values down by f units (up if negative)
  } = {}) {
    this.points = points; // has all the points for each function, not neccesary to change
    this.stroke = stroke;
    this.width = width;
    this.fill = fill;
    this.arrow = arrow;
    this.arrowHei = arrowHei;
    this.arrowWid = arrowWid;
    this.dashed = dashed;
    this.svgTransform = svgTransform;
  }

  appendTo(svg) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", this.svgTransform);

    this.el = this._createElement();
    this.el.setAttribute("points", this.points.join(" "));
    this.el.setAttribute("fill", this.fill);
    this.el.setAttribute("stroke", this.stroke);
    this.el.setAttribute("stroke-width", this.width);
    this.el.setAttribute("stroke-linejoin", "miter"); // tells the browser how to draw corners, miter draws a sharp corner; bevel, round, and arcs can also be used
    this.el.setAttribute("stroke-linecap", "round") // how the ends of a stroked line or path look like, same as linejoin; adjusts the end points of path

    if (this.arrow !== "none") {
      const markerURL = this.arrowMarker(svg, this.stroke);

      if (this.arrow === "marker-start" || this.arrow === "both") {
        this.el.setAttribute("marker-start", markerURL);
    }

      if (this.arrow === "marker-end"   || this.arrow === "both") {
        this.el.setAttribute("marker-end",   markerURL);
    }
  }

    g.appendChild(this.el); 
    svg.appendChild(g);
    return this;
  }

  autoAnimateDot({ colour = "gold", durationMs = 5000, bounce = true, radius = 0.03 } = {}) {
    this.colour = colour;
    this.durationMs = durationMs; // the speed at which the dot moves
    const poly = this.el;
    const total = poly.getTotalLength();

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("r", radius); // makes the animated dot a circle with radius of 0.03 --> 8.4 after being transformed (multiplied by 280)
    dot.setAttribute("fill", colour); // fills the animated dot with the attribute colour
    poly.parentNode.appendChild(dot);

    let t0;   // first timestamp

    const tick = now => {
      if (t0 === undefined) t0 = now;

      const elapsed = now - t0;
      const cycle = Math.floor(elapsed / durationMs);
      let u = ((elapsed % durationMs) / durationMs);

      if (bounce && (cycle & 1)) u = 1 - u;

      const easedU = 0.5 * (1 - Math.cos(u * Math.PI))

      const pos = poly.getPointAtLength(easedU * total);
      dot.setAttribute("cx", pos.x);
      dot.setAttribute("cy", pos.y);
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    return this;
  }

  manualDragDot({ colour = "gold"} = {}) {
    this.colour = colour;
    const poly = this.el;
    const svg = poly.ownerSVGElement;
    const total = poly.getTotalLength();

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("r", "0.03"); // makes the animated dot a circle with radius of 0.03 --> 8.4 after being transformed (multiplied by 280)
    dot.setAttribute("fill", colour); // fills the animated dot with the attribute colour
    poly.parentNode.appendChild(dot);

    const startPos = poly.getPointAtLength(0);
    dot.setAttribute("cx", startPos.x);
    dot.setAttribute("cy", startPos.y);

    const toSvgPoint = (clientX, clientY) => {
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      return pt.matrixTransform(poly.getScreenCTM().inverse());
    };

    const closestLength = (point) => { // TODO: The demo is fine other than the closestLength configuration, as it stands now
                                       // the "closest point" is based upon the location of the mouse cursor, causing eradic movement if 
                                       // the user is not tracing the function. Could probably be fixed by using a vertex/vertices mapper.
                                       // Probably best way to go about it though is using a slider on the bottom to control the dot's movement though
      let minDist = Infinity;
      let closestLen = 0; 
      
      // Sample points along the path to find closest
      const samples = 500;
      for (let i = 0; i <= samples; i++) {
          const len = (i / samples) * total;
          const pathPoint = poly.getPointAtLength(len);
          const dist = Math.sqrt(
              Math.pow(point.x - pathPoint.x, 2) + 
              Math.pow(point.y - pathPoint.y, 2)
          );
          if (dist < minDist) {
              minDist = dist;
              closestLen = len;
          }
      }
      return closestLen;
    };

    let dragging = false;

    const moveDot = (e) => {
      if (!dragging) return;

      const svgPt = toSvgPoint(e.clientX, e.clientY);
      const len   = closestLength(svgPt);
      const pos   = poly.getPointAtLength(len);

      dot.setAttribute("cx", pos.x);
      dot.setAttribute("cy", pos.y);
    };

    dot.addEventListener("pointerdown", (e) => {
      e.preventDefault();               // stop text-selection, etc.
      dragging = true;
      dot.setPointerCapture(e.pointerId);
    });

    dot.addEventListener("pointerup",   () => dragging = false);
    dot.addEventListener("pointercancel", () => dragging = false);
    svg.addEventListener("pointermove", moveDot);

    return this;      
  }

  arrowMarker(svg, colour = "black") {
    const id = `arrow-${colour.replace("#", "")}`;

    let marker = svg.querySelector(`#${id}`);
    if (marker) return `url(#${id})`;

    let defs = svg.querySelector("defs");
    if (!defs) {
      defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      svg.insertBefore(defs, svg.firstChild);
    }

    marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", id);
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "0");
    marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", this.arrowWid);
    marker.setAttribute("markerHeight", this.arrowHei);
    marker.setAttribute("markerUnits", "strokeWidth");
    marker.setAttribute("orient", "auto-start-reverse");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M 0 0 L 10 5 L 0 10 Z");
    path.setAttribute("fill", colour);
    marker.appendChild(path);

    defs.appendChild(marker);
    return `url(#${id})`;
  }
}

export class polyLine extends baseShape {
  _createElement() {
    return document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  }
}


export class polyGon extends baseShape {
  _createElement() {
    return document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  }
}

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => i + from);

export const quadraticFunct   = (N = 500) => range(-N, N)
  .map(i => { const x = i / N, y = 2 * x * x; return `${x},${y}`; });

export const cubicFunct   = (N = 500) => range(-450, 450)
  .map(i => { const x = i / N, y = 2 * x * x * x; return `${x},${y}`; });

export const sineFunct       = (N = 500) => range(0, (N))
  .map(i => { const x = 2 * (i / N), y = Math.sin(Math.PI * x); return `${x},${y}`; });

export const cosFunct       = (N = 500) => range(0, (N))
  .map(i => { const x = 2 * (i / N), y = Math.cos(Math.PI * x); return `${x},${y}`; });

export const circleFunct     = (N = 500) => range(0, N)
  .map(i => {const θ = (i / N) * 2 * Math.PI; return `${Math.cos(θ)},${Math.sin(θ)}`;});

export const expFunct     = (N = 500) => range(-300, 300)
  .map(i => {const x = i / N, y = Math.exp(x); return `${x},${y}`;});

export const linearFunct       = (N = 300) => range(0, 200)
  .map(i => { const x = 2 * (i / N), y = x; return `${x},${y}`; });

export const absFunct       = (N = 300) => range(-250, 250)
  .map(i => { const x = 2 * (i / N), y = Math.abs(x); return `${x},${y}`; });

export const sqrtFunct       = (N = 500) => range(0, 300)
  .map(i => { const x = 2 * (i / N), y = Math.sqrt(x); return `${x},${y}`; });

export const vertAxis   = (N = 500) => range(0, 1.5).map(y => `0,${y}`);
export const horizAxis  = (N = 500) => range(0, 1.5).map(x => `${x},0`);
