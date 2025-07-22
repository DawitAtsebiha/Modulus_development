const SVG_NS = "http://www.w3.org/2000/svg";

export class baseShape {
  constructor(points, {
    stroke = "black",
    width  = 0.02,
    fill   = "none",
    dashed = false,
    arrow  = "none",
    arrowWid = "3",
    arrowHei = "3",
    svgTransform = "matrix(200 0 0 -200 350 400)",
  } = {}) {
    this.points       = points;
    this.stroke       = stroke;
    this.width        = width;
    this.fill         = fill;
    this.dashed       = dashed;
    this.arrow        = arrow;
    this.arrowWid     = arrowWid;
    this.arrowHei     = arrowHei;
    this.svgTransform = svgTransform;
  }

  appendTo(svg) {
    const g = document.createElementNS(SVG_NS, "g");
    g.setAttribute("transform", this.svgTransform);

    this.el = this._createElement();
    this.el.setAttribute("points",        this.points.join(" "));
    this.el.setAttribute("fill",          this.fill);
    this.el.setAttribute("stroke",        this.stroke);
    this.el.setAttribute("stroke-width",  this.width);
    this.el.setAttribute("stroke-linejoin","miter");
    this.el.setAttribute("stroke-linecap","round");
    if (this.dashed) this.el.setAttribute("stroke-dasharray", this.dashed);

    if (this.arrow !== "none") {
      const markerURL = this.arrowMarker(svg, this.stroke);
      if (this.arrow === "marker-start" || this.arrow === "both")
        this.el.setAttribute("marker-start", markerURL);
      if (this.arrow === "marker-end"   || this.arrow === "both")
        this.el.setAttribute("marker-end",   markerURL);
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
      defs = document.createElementNS(SVG_NS, "defs");
      svg.insertBefore(defs, svg.firstChild);
    }

    marker = document.createElementNS(SVG_NS, "marker");
    marker.setAttribute("id", id);
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "0");
    marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth",  this.arrowWid);
    marker.setAttribute("markerHeight", this.arrowHei);
    marker.setAttribute("markerUnits", "strokeWidth");
    marker.setAttribute("orient", "auto-start-reverse");

    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", "M 0 0 L 10 5 L 0 10 Z");
    path.setAttribute("fill", colour);
    marker.appendChild(path);
    defs.appendChild(marker);
    return `url(#${id})`;
  }
}

export class polyLine extends baseShape {
  _createElement() { return document.createElementNS(SVG_NS, "polyline"); }
}
export class polyGon extends baseShape {
  _createElement() { return document.createElementNS(SVG_NS, "polygon");  }
}

const range = (from, to) =>
  Array.from({ length: to - from + 1 }, (_, i) => i + from);

export const quadraticFunct = (N = 500) => range(-N, N)
  .map(i => { const x = i / N, y = 2 * x * x;      return `${x},${y}`; });
export const cubicFunct     = (N = 500) => range(-450, 450)
  .map(i => { const x = i / N, y = 2 * x * x * x;  return `${x},${y}`; });
export const sineFunct      = (N = 500) => range(0, N)
  .map(i => { const x = 2 * (i / N), y = Math.sin(Math.PI * x); return `${x},${y}`; });
export const cosFunct       = (N = 500) => range(0, N)
  .map(i => { const x = 2 * (i / N), y = Math.cos(Math.PI * x); return `${x},${y}`; });
export const circleFunct    = (N = 500) => range(0, N)
  .map(i => { const θ = (i / N) * 2 * Math.PI; return `${Math.cos(θ)},${Math.sin(θ)}`;});
export const expFunct       = (N = 500) => range(-300, 300)
  .map(i => { const x = i / N, y = Math.exp(x);                  return `${x},${y}`; });
export const linearFunct    = (N = 300) => range(0, 200)
  .map(i => { const x = 2 * (i / N), y = x;                      return `${x},${y}`; });
export const absFunct       = (N = 300) => range(-250, 250)
  .map(i => { const x = 2 * (i / N), y = Math.abs(x);            return `${x},${y}`; });
export const sqrtFunct      = (N = 500) => range(0, 300)
  .map(i => { const x = 2 * (i / N), y = Math.sqrt(x);           return `${x},${y}`; });

export const vertAxis  = () => ["0,-1.5", "0,1.5"];
export const horizAxis = () => ["-1.5,0", "1.5,0"];

export function drawGraphBackground(
  svg,
  {
    xMin = -1.5, xMax = 1.5,
    yMin = -1.5, yMax = 1.5,
    majorStep = 0.5, minorStep = 0.1,
    majorColour = "#666", minorColour = "#ddd",
    majorWidth = 0.01,  minorWidth = 0.005,
    tickSize   = 0.06,
    svgTransform = "matrix(200 0 0 -200 350 400)",
  } = {}
) {
  const g = document.createElementNS(SVG_NS, "g");
  g.setAttribute("transform", svgTransform);
  svg.appendChild(g);

  const addLine = (x1, y1, x2, y2, stroke, width) => {
    const ln = document.createElementNS(SVG_NS, "line");
    ln.setAttribute("x1", x1); ln.setAttribute("y1", y1);
    ln.setAttribute("x2", x2); ln.setAttribute("y2", y2);
    ln.setAttribute("stroke", stroke);
    ln.setAttribute("stroke-width", width);
    g.appendChild(ln);
  };
  const isMajor = v => Math.abs(Math.round(v / majorStep) * majorStep - v) < 1e-9;

  for (let x = Math.ceil(xMin / minorStep) * minorStep; x <= xMax + 1e-9; x += minorStep)
    addLine(x, yMin, x, yMax, isMajor(x) ? majorColour : minorColour,
            isMajor(x) ? majorWidth : minorWidth);

  for (let y = Math.ceil(yMin / minorStep) * minorStep; y <= yMax + 1e-9; y += minorStep)
    addLine(xMin, y, xMax, y, isMajor(y) ? majorColour : minorColour,
            isMajor(y) ? majorWidth : minorWidth);

  const drawTicks = (end, vertical) => {
    for (let v = majorStep; v <= end + 1e-9; v += majorStep) {
      const lines = vertical
        ? [[-tickSize,  v, tickSize,  v], [-tickSize, -v, tickSize, -v]]
        : [[ v, -tickSize,  v, tickSize], [-v, -tickSize, -v, tickSize]];
      lines.forEach(([x1,y1,x2,y2]) => addLine(x1,y1,x2,y2,"#000",0.018));
    }
  };

  drawTicks(Math.max(Math.abs(yMin), Math.abs(yMax)), true);  // y ticks
  drawTicks(Math.max(Math.abs(xMin), Math.abs(xMax)), false); // x ticks
}
