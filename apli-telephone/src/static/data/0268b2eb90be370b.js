// URL: https://beta.observablehq.com/d/0268b2eb90be370b
// Title: Namibia Map (NdI 2018 - Echo Byte Reborn)
// Author: Stev (@tarte0)
// Version: 503
// Runtime version: 1

const m0 = {
    id: "0268b2eb90be370b@503",
    variables: [
        {
            inputs: ["md"],
            value: (function(md){return(
                md`# Namibia Map (NdI 2018 - Echo Byte Reborn)`
            )})
        },
        {
            name: "canvas",
            inputs: ["DOM","w","h","inputs","namibiaGeoFeatures","scale","margin","fillPolygon","transformWithScale","drawPolygon","pointInPolygon","mutable currentFeature","healthsites","transformPointWithScale","closestPoint","distance","d3Delaunay","waterSites"],
            value: (function*(DOM,w,h,inputs,namibiaGeoFeatures,scale,margin,fillPolygon,transformWithScale,drawPolygon,pointInPolygon,$0,healthsites,transformPointWithScale,closestPoint,distance,d3Delaunay,waterSites)
                {
                    //Nuit de l'info 2018
                    //Defi 'Canvas à tout va!'
                    //par Steeve Ciminera et Romain Sanchez

                    //Merci à Zack Ciminera pour le support mental
                    const canvas = DOM.canvas(w, h);
                    const ctx = canvas.getContext('2d');

                    canvas.addEventListener(
                        "mousemove",
                        function(e) {
                            inputs.mousePos = [e.offsetX, e.offsetY];
                        },
                        false
                    );

                    const renderNumber = 4

                    canvas.addEventListener(
                        "click",
                        function(e) {
                            inputs.clicks = (inputs.clicks+1)%renderNumber
                        },
                        false
                    );

                    const allPoints = []
                    namibiaGeoFeatures.forEach(feature => {
                        let d = feature.geometry;
                        allPoints.push(...d);
                    })

                    const scaleInfo = scale(allPoints, w-margin, h-margin);



                    while(true){
                        ctx.font = `${w/20}px Arial`;
                        ctx.fillStyle = "white";
                        ctx.fillRect(0,0,w,h);

                        ctx.strokeStyle = "rbga(0,0,0,0.75)";

                        namibiaGeoFeatures.forEach((feature,i) => {
                            let d = feature.geometry;

                            ctx.fillStyle = '#f0f0f0';
                            fillPolygon(transformWithScale(d, w, h, margin, scaleInfo), ctx);
                            drawPolygon(transformWithScale(d, w, h, margin, scaleInfo), ctx);

                        })

                        const selectedFeature = namibiaGeoFeatures.find(feature => {
                            let d = feature.geometry;
                            return pointInPolygon(transformWithScale(d, w, h, margin, scaleInfo), inputs.mousePos)
                        })

                        if(selectedFeature) {

                            $0.value = selectedFeature

                            ctx.fillStyle = "white";
                            fillPolygon(transformWithScale(selectedFeature.geometry, w, h, margin, scaleInfo), ctx);

                            ctx.lineWidth = 3;
                            drawPolygon(transformWithScale(selectedFeature.geometry, w, h, margin, scaleInfo), ctx);

                            ctx.fillStyle = "black";
                            ctx.fillText(selectedFeature.properties.name.replace(/Region/, ''), inputs.mousePos[0]+10, inputs.mousePos[1]);
                        }

                        let closestSite = [0,0];
                        ctx.lineWidth = 1;
                        let transformedSites = [];
                        let delaunay;
                        let voronoi;
                        let closestSiteDistance;

                        switch(inputs.clicks){
                            case 0:

                                transformedSites = [];

                                ctx.fillStyle = "grey";
                                ctx.fillText('Health sites', 20, h-15);

                                healthsites.forEach((p,i) => {
                                    ctx.fillStyle = 'rgba(255,0,0,0.5)';

                                    const transformedPoint = transformPointWithScale(p, w, h, margin, scaleInfo);

                                    transformedSites.push(transformedPoint);


                                    ctx.beginPath();
                                    ctx.arc(transformedPoint[0], transformedPoint[1], 5, 0, Math.PI*2);
                                    ctx.fill();
                                })

                                closestSite = closestPoint(inputs.mousePos, transformedSites);
                                closestSiteDistance = distance(inputs.mousePos, closestSite);

                                ctx.strokeStyle='red'

                                ctx.beginPath();
                                ctx.moveTo(inputs.mousePos[0], inputs.mousePos[1]);
                                ctx.lineTo(closestSite[0], closestSite[1]);
                                ctx.stroke();
                                ctx.closePath();

                                ctx.font = "10px Arial";
                                ctx.fillStyle = "red";
                                ctx.fillText(Number(closestSiteDistance).toFixed(2), closestSite[0]+(inputs.mousePos[0]-closestSite[0])/2, closestSite[1]+(inputs.mousePos[1]-closestSite[1])/2);

                                ctx.strokeStyle = "black";

                                break;
                            case 1:

                                ctx.fillStyle = "grey";
                                ctx.fillText('Health sites', 20, h-15);

                                transformedSites = [];

                                healthsites.forEach((p,i) => {
                                    ctx.fillStyle = 'rgba(255,0,0,0.5)';

                                    const transformedPoint = transformPointWithScale(p, w, h, margin, scaleInfo);

                                    transformedSites.push(transformedPoint);

                                    ctx.beginPath();
                                    ctx.arc(transformedPoint[0], transformedPoint[1], 5, 0, Math.PI*2);
                                    ctx.fill();
                                })

                                delaunay = new d3Delaunay.Delaunay.from(transformedSites);
                                voronoi = delaunay.voronoi([0, 0, w, h]);

                                ctx.lineWidth = 0.3;

                                ctx.save();
                                ctx.beginPath();
                                voronoi.render(ctx);
                                ctx.stroke();

                                ctx.lineWidth = 1;

                                closestSite = closestPoint(inputs.mousePos, transformedSites);
                                closestSiteDistance = distance(inputs.mousePos, closestSite);

                                ctx.strokeStyle='red'

                                ctx.beginPath();
                                ctx.moveTo(inputs.mousePos[0], inputs.mousePos[1]);
                                ctx.lineTo(closestSite[0], closestSite[1]);
                                ctx.stroke();
                                ctx.closePath();

                                ctx.font = "10px Arial";
                                ctx.fillStyle = "red";
                                ctx.fillText(Number(closestSiteDistance).toFixed(2),
                                    closestSite[0]+(inputs.mousePos[0]-closestSite[0])/2,
                                    closestSite[1]+(inputs.mousePos[1]-closestSite[1])/2);

                                ctx.strokeStyle = "black";

                                break;
                            case 2:

                                transformedSites = [];


                                ctx.fillStyle = "grey";
                                ctx.fillText('Water sites', 20, h-15);

                                waterSites.forEach((p,i) => {
                                    ctx.fillStyle = 'rgba(0,75,255,0.5)';

                                    const transformedPoint = transformPointWithScale(p, w, h, margin, scaleInfo);
                                    transformedSites.push(transformedPoint);


                                    ctx.beginPath();
                                    ctx.arc(transformedPoint[0], transformedPoint[1], 5, 0, Math.PI*2);
                                    ctx.fill();
                                })

                                closestSite = closestPoint(inputs.mousePos, transformedSites);
                                closestSiteDistance = distance(inputs.mousePos, closestSite);

                                ctx.strokeStyle='blue'

                                ctx.beginPath();
                                ctx.moveTo(inputs.mousePos[0], inputs.mousePos[1]);
                                ctx.lineTo(closestSite[0], closestSite[1]);
                                ctx.stroke();
                                ctx.closePath();

                                ctx.font = "10px Arial";
                                ctx.fillStyle = "blue";
                                ctx.fillText(Number(closestSiteDistance).toFixed(2), closestSite[0]+(inputs.mousePos[0]-closestSite[0])/2, closestSite[1]+(inputs.mousePos[1]-closestSite[1])/2);

                                ctx.strokeStyle = "black";
                                break;
                            case 3:


                                ctx.fillStyle = "grey";
                                ctx.fillText('Water sites', 20, h-15);

                                transformedSites = [];

                                waterSites.forEach((p,i) => {
                                    ctx.fillStyle = 'rgba(0,75,255,0.5)';

                                    const transformedPoint = transformPointWithScale(p, w, h, margin, scaleInfo);

                                    transformedSites.push(transformedPoint);

                                    ctx.beginPath();
                                    ctx.arc(transformedPoint[0], transformedPoint[1], 5, 0, Math.PI*2);
                                    ctx.fill();
                                })

                                delaunay = new d3Delaunay.Delaunay.from(transformedSites);
                                voronoi = delaunay.voronoi([0, 0, w, h]);

                                ctx.lineWidth = 0.3;

                                ctx.save();
                                ctx.beginPath();
                                voronoi.render(ctx);
                                ctx.stroke();

                                ctx.lineWidth = 1;

                                closestSite = closestPoint(inputs.mousePos, transformedSites);
                                closestSiteDistance = distance(inputs.mousePos, closestSite);

                                ctx.strokeStyle='blue'

                                ctx.beginPath();
                                ctx.moveTo(inputs.mousePos[0], inputs.mousePos[1]);
                                ctx.lineTo(closestSite[0], closestSite[1]);
                                ctx.stroke();
                                ctx.closePath();

                                ctx.font = "10px Arial";
                                ctx.fillStyle = "blue";
                                ctx.fillText(Number(closestSiteDistance).toFixed(2), closestSite[0]+(inputs.mousePos[0]-closestSite[0])/2, closestSite[1]+(inputs.mousePos[1]-closestSite[1])/2);

                                ctx.strokeStyle = "black";
                                break;
                        }



                        yield canvas;
                    }
                }
            )
        },
        {

        },
        {

        },
        {
            name: "viewof displayType",
            inputs: ["radio"],
            value: (function(radio){return(
                radio({
                    title: `Type d'affichage`,
                    options: [
                        { label: 'Health sites', value: '0' },
                        { label: 'Health sites (Voronoi)', value: '1' },
                        { label: 'Water sites', value: '2' },
                        { label: 'Water sites (Voronoi)', value: '3' }

                    ],
                    value: '0'
                })
            )})
        },
        {
            name: "displayType",
            inputs: ["Generators","viewof displayType"],
            value: (G, _) => G.input(_)
        },
        {

        },
        {
            name: "initial currentFeature",
            value: (function(){return(
                null
            )})
        },
        {
            name: "mutable currentFeature",
            inputs: ["Mutable","initial currentFeature"],
            value: (M, _) => new M(_)
        },
        {
            name: "currentFeature",
            inputs: ["mutable currentFeature"],
            value: _ => _.generator
        },
        {
            name: "margin",
            value: (function(){return(
                20
            )})
        },
        {

        },
        {
            name: "color",
            inputs: ["d3"],
            value: (function(d3){return(
                d3.interpolateOranges
            )})
        },
        {

        },
        {
            name: "getCoordsFromFeature",
            value: (function(){return(
                function getCoordsFromFeature(feature) {
                    return {...feature, coords: feature.geometry.coordinates[0][0]};
                }
            )})
        },
        {
            name: "namibiaGeoFeatures",
            inputs: ["namibiaGeoJson"],
            value: (function(namibiaGeoJson){return(
                namibiaGeoJson.features.map(f => ({...f, geometry:f.geometry.coordinates[0][0].map(p=>[Math.abs(p[0]), Math.abs(p[1])])}))
            )})
        },
        {

        },
        {
            name: "scale",
            inputs: ["getBoundingBox"],
            value: (function(getBoundingBox){return(
                function scale(coords, width, height) {
                    const bounds = getBoundingBox(coords);
                    const xScale = width / Math.abs(bounds.xMax - bounds.xMin);
                    const yScale = height / Math.abs(bounds.yMax - bounds.yMin);
                    const scale = xScale < yScale ? xScale : yScale;
                    return {...bounds, scale};
                }
            )})
        },
        {
            name: "transform",
            inputs: ["scale"],
            value: (function(scale){return(
                function transform(coords, width, height, margin) {
                    const scalingInfo = scale(coords, width-margin, height-margin);

                    const xScale = (width - margin)/2 - ((scalingInfo.xMax - scalingInfo.xMin)/2 * scalingInfo.scale) + margin/2

                    return coords.map(p =>
                        [(p[0] - scalingInfo.xMin) * scalingInfo.scale + xScale, (p[1] - scalingInfo.yMin) * scalingInfo.scale + margin/2]
                    )
                }
            )})
        },
        {
            name: "transformWithScale",
            value: (function(){return(
                function transformWithScale(coords, width, height, margin, scalingInfo) {

                    const xScale = (width - margin)/2 - ((scalingInfo.xMax - scalingInfo.xMin)/2 * scalingInfo.scale) + margin/2

                    return coords.map(p =>
                        [(p[0] - scalingInfo.xMin) * scalingInfo.scale + xScale, (p[1] - scalingInfo.yMin) * scalingInfo.scale + margin/2]
                    )
                }
            )})
        },
        {
            name: "transformPointWithScale",
            value: (function(){return(
                function transformPointWithScale(point, width, height, margin, scalingInfo) {

                    const xScale = (width - margin)/2 - ((scalingInfo.xMax - scalingInfo.xMin)/2 * scalingInfo.scale) + margin/2

                    return [(point[0] - scalingInfo.xMin) * scalingInfo.scale + xScale, (point[1] - scalingInfo.yMin) * scalingInfo.scale + margin/2]
                }
            )})
        },
        {
            name: "getBoundingBox",
            value: (function(){return(
                function getBoundingBox(coords) {
                    let xMin = coords[0][0];
                    let xMax = -1;
                    let yMin = coords[0][1];
                    let yMax = -1;

                    coords.forEach(p => {
                        xMin = xMin > p[0] ? p[0] : xMin
                        xMax = xMax < p[0] ? p[0] : xMax
                        yMin = yMin > p[1] ? p[1] : yMin
                        yMax = yMax < p[1] ? p[1] : yMax
                    });

                    return {xMin, xMax, yMin, yMax}
                }
            )})
        },
        {

        },
        {
            name: "drawPolygon",
            value: (function(){return(
                (polygon, ctx) => {
                    ctx.beginPath();
                    ctx.moveTo(polygon[0][0], polygon[0][1]);
                    for(let i=0; i<polygon.length; i++) {
                        ctx.lineTo(polygon[i][0], polygon[i][1]);
                    }
                    ctx.lineTo(polygon[0][0], polygon[0][1]);
                    ctx.closePath();
                    ctx.stroke();
                }
            )})
        },
        {
            name: "fillPolygon",
            value: (function(){return(
                (polygon, ctx) => {
                    ctx.beginPath();
                    ctx.moveTo(polygon[0][0], polygon[0][1]);
                    for(let i=0; i<polygon.length; i++) {
                        ctx.lineTo(polygon[i][0], polygon[i][1]);
                    }
                    ctx.lineTo(polygon[0][0], polygon[0][1]);
                    ctx.closePath();
                    ctx.fill();
                }
            )})
        },
        {
            name: "pointInPolygon",
            value: (function(){return(
                (polygon, point) => {

                    let inside = false; //no intersection for the moment (0 is even)
                    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                        let xi = polygon[i][0], yi = polygon[i][1];
                        let xj = polygon[j][0], yj = polygon[j][1];

                        let intersect = ((yi > point[1]) != (yj > point[1]))
                            && (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
                        if (intersect) inside = !inside; //odd number of intersections => inside
                    }

                    return inside;
                }
            )})
        },
        {
            name: "closestPoint",
            inputs: ["distance"],
            value: (function(distance){return(
                function closestPoint(point, points) {
                    let minDist = Infinity;
                    let minPoint = [0,0];
                    let dist = Infinity;

                    points.forEach((p,i) =>{
                        dist = distance(point, p);
                        if(dist < minDist){
                            minDist = dist;
                            minPoint = p;
                        }
                    })

                    return minPoint;
                }
            )})
        },
        {
            name: "distance",
            value: (function(){return(
                (a, b) => {
                    let x = b[0] - a[0];
                    let y = b[1] - a[1];
                    return Math.hypot(x, y);
                }
            )})
        },
        {

        },
        {
            name: "w",
            inputs: ["width"],
            value: (function(width){return(
                width
            )})
        },
        {
            name: "h",
            inputs: ["w"],
            value: (function(w){return(
                w/2
            )})
        },
        {

        },
        {

        },
        {

        },
        {
            name: "namibiaGeoJson",
            inputs: ["d3","namibiaGeoJsonURL"],
            value: (function(d3,namibiaGeoJsonURL){return(
                d3.json(namibiaGeoJsonURL)
            )})
        },
        {
            name: "healthsites",
            inputs: ["d3"],
            value: (async function(d3)
                {
                    let h = await d3.csv(
                        "https://gist.githubusercontent.com/Zechasault/6f0220cdc647be560a930791799f5194/raw/b71686c7593c98948a6f0aec29ff581096f727b3/namibia-healthsites"
                    );
                    return h.map(d => [Math.abs(d.X), Math.abs(d.Y)]);
                }
            )
        },
        {
            name: "waterSites",
            value: (function(){return(
                [
                    ["-17.51834419", "14.67567444"],
                    ["-18.14846174", "15.78666687"],
                    ["-18.15498648", "15.67869186"],
                    ["-26.215629", "15.64237"],
                    ["-25.684675", "18.414155"],
                    ["-26.120705", "18.710491"],
                    ["-26.224445", "18.861265"],
                    ["-26.233614", "18.783488"],
                    ["-26.320851", "18.872384"],
                    ["-26.306150", "19.011457"],
                    ["-26.349748", "19.114592"],
                    ["-26.310803", "19.236235"],
                    ["-26.379990", "19.311104"],
                    ["-26.519264", "19.295392"],
                    ["-26.4599504", "19.2232131"],
                    ["-26.4719545", "19.3291903"],
                    ["-26.4467215", "17.9668545"],
                    ["-26.3883082", "18.4524494"],
                    ["-26.3883082", "18.4524494"],
                    ["-26.3883082", "18.4524494"],
                    ["-26.9517597", "17.9863382"],
                    ["-26.9517597", "17.9863382"],
                    ["-26.9876566", "17.749285"],
                    ["-26.0462773", "16.8805339"],
                    ["-26.0462773", "16.8805339"],
                    ["-26.0462773", "16.8805339"],
                    ["-27.8725883", "17.6206803"],
                    ["-28.1561708", "17.8307099"],
                    ["-28.1561708", "17.8307099"],
                    ["-28.1561708", "17.8307099"],
                    ["-28.1561708", "17.8307099"],
                    ["-28.1561708", "17.8307099"],
                    ["-28.1561708", "17.8307099"],
                    ["-28.0586212", "17.6254399"],
                    ["-28.1010813", "17.5231434"],
                    ["-27.9401811", "16.5708473"],
                    ["-27.9401811", "16.5708473"],
                    ["-26.2820301", "16.6672701"],
                    ["-26.2820301", "16.6672701"],
                    ["-27.0666575", "17.1717013"],
                    ["-27.1866188", "17.6838846"],
                    ["-27.2597242", "17.703858"],
                    ["-26.0977073", "17.8304371"],
                    ["-26.0723253", "17.8662904"],
                    ["-26.0723253", "17.8662904"]
                ].map(p => [Math.abs(p[1]), Math.abs(p[0])])
            )})
        },
        {

        },
        {
            name: "inputs",
            inputs: ["displayType"],
            value: (function(displayType)
                {
                    displayType;
                    return ({
                        mousePos : {},
                        clicks : Number(displayType)
                    })
                }
            )
        },
        {

        },
        {
            name: "d3",
            inputs: ["require"],
            value: (function(require){return(
                require('d3')
            )})
        },
        {

        },
        {
            name: "namibiaGeoJsonURL",
            value: (function(){return(
                `https://gist.githubusercontent.com/mostertg/68ddfb178b2aafafdcceb6afb73281db/raw/980b6f8ad402da2883b5fc793694dcc36fa1ef14/namibia-regions.json`
            )})
        },
        {
            name: "topojson",
            inputs: ["require"],
            value: (function(require){return(
                require("topojson-client@3")
            )})
        },
        {
            name: "d3Delaunay",
            inputs: ["require"],
            value: (function(require){return(
                require("d3-delaunay@4")
            )})
        },
        {
            from: "@jashkenas/inputs",
            name: "radio",
            remote: "radio"
        },
        {

        },
        {
            inputs: ["md"],
            value: (function(md){return(
                md`
Nuit de l'info 2018


Defi 'Canvas à tout va!'

Par Steeve Ciminera et Romain Sanchez
  
Merci à Zack Ciminera pour le support mental
`
            )})
        }
    ]
};

const m1 = {
    id: "@jashkenas/inputs",
    variables: [
        {
            name: "radio",
            inputs: ["input","html"],
            value: (function(input,html){return(
                function radio(config = {}) {
                    let { value: formValue, title, description, submit, options } = config;
                    if (Array.isArray(config)) options = config;
                    options = options.map(
                        o => (typeof o === "string" ? { value: o, label: o } : o)
                    );
                    const form = input({
                        type: "radio",
                        title,
                        description,
                        submit,
                        getValue: input => {
                            const checked = Array.prototype.find.call(input, radio => radio.checked);
                            return checked ? checked.value : undefined;
                        },
                        form: html`
      <form>
        ${options.map(({ value, label }) => {
                            const input = html`<input type=radio name=input ${
                                value === formValue ? "checked" : ""
                                } style="vertical-align: baseline;" />`;
                            input.setAttribute("value", value);
                            const tag = html`
          <label style="display: inline-block; margin: 5px 10px 3px 0; font-size: 0.85em;">
           ${input}
           ${label}
          </label>`;
                            return tag;
                        })}
      </form>
    `
                    });
                    form.output.remove();
                    return form;
                }
            )})
        },
        {
            name: "input",
            inputs: ["html","d3format"],
            value: (function(html,d3format){return(
                function input(config) {
                    let {
                        form,
                        type = "text",
                        attributes = {},
                        action,
                        getValue,
                        title,
                        description,
                        format,
                        display,
                        submit,
                        options
                    } = config;
                    if (!form)
                        form = html`<form>
	<input name=input type=${type} />
  </form>`;
                    const input = form.input;
                    Object.keys(attributes).forEach(key => {
                        const val = attributes[key];
                        if (val != null) input.setAttribute(key, val);
                    });
                    if (submit)
                        form.append(
                            html`<input name=submit type=submit style="margin: 0 0.75em" value="${
                                typeof submit == "string" ? submit : "Submit"
                                }" />`
                        );
                    form.append(
                        html`<output name=output style="font: 14px Menlo, Consolas, monospace; margin-left: 0.5em;"></output>`
                    );
                    if (title)
                        form.prepend(
                            html`<div style="font: 700 0.9rem sans-serif;">${title}</div>`
                        );
                    if (description)
                        form.append(
                            html`<div style="font-size: 0.85rem; font-style: italic;">${description}</div>`
                        );
                    if (format) format = d3format.format(format);
                    if (action) {
                        action(form);
                    } else {
                        const verb = submit
                            ? "onsubmit"
                            : type == "button"
                                ? "onclick"
                                : type == "checkbox" || type == "radio"
                                    ? "onchange"
                                    : "oninput";
                        form[verb] = e => {
                            e && e.preventDefault();
                            const value = getValue ? getValue(input) : input.value;
                            if (form.output)
                                form.output.value = display
                                    ? display(value)
                                    : format
                                        ? format(value)
                                        : value;
                            form.value = value;
                            if (verb !== "oninput")
                                form.dispatchEvent(new CustomEvent("input", { bubbles: true }));
                        };
                        if (verb !== "oninput")
                            input.oninput = e => e && e.stopPropagation() && e.preventDefault();
                        if (verb !== "onsubmit") form.onsubmit = e => e && e.preventDefault();
                        form[verb]();
                    }
                    return form;
                }
            )})
        },
        {
            name: "d3format",
            inputs: ["require"],
            value: (function(require){return(
                require("d3-format")
            )})
        }
    ]
};

const notebook = {
    id: "0268b2eb90be370b@503",
    modules: [m0,m1]
};

export default notebook;