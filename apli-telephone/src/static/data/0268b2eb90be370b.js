// URL: https://beta.observablehq.com/d/0268b2eb90be370b
// Title: Zambezi
// Author: Stev (@tarte0)
// Version: 377
// Runtime version: 1

const m0 = {
  id: "0268b2eb90be370b@377",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Zambezi`
)})
    },
    {
      name: "canvas",
      inputs: ["DOM","w","h","inputs","namibiaGeoFeatures","scale","margin","fillPolygon","transformWithScale","drawPolygon","pointInPolygon","mutable currentFeature","healthsites","transformPointWithScale","waterSites"],
      value: (function*(DOM,w,h,inputs,namibiaGeoFeatures,scale,margin,fillPolygon,transformWithScale,drawPolygon,pointInPolygon,$0,healthsites,transformPointWithScale,waterSites)
{
  const canvas = DOM.canvas(w, h);
  const ctx = canvas.getContext('2d');
  
  canvas.addEventListener(
    "mousemove",
    function(e) {
      inputs.mousePos = [e.offsetX, e.offsetY];
    },
    false
  );
  
  const renderNumber = 2
  
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
  
  ctx.font = "30px Arial";
  
  while(true){
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
      ctx.fillText(selectedFeature.properties.name.replace(/Region/, ''), inputs.mousePos[0], inputs.mousePos[1]);
    }
    
     let closestSite = [0,0];
    ctx.lineWidth = 1;
    switch(inputs.clicks){
      case 0:
       
        
        ctx.fillStyle = "grey";
        ctx.fillText('Health sites', 20, h-50);
         ctx.fillText(`Closest site : ${closestSite}`, 20, h-10);
        
         healthsites.forEach((p,i) => {
          ctx.fillStyle = 'rgba(255,0,0,0.5)';

          const transformedPoint = transformPointWithScale(p, w, h, margin, scaleInfo);

          ctx.beginPath();
          ctx.arc(transformedPoint[0], transformedPoint[1], 5, 0, Math.PI*2);
          ctx.fill();
           })
        break;
      case 1:
        
        ctx.fillStyle = "grey";
        ctx.fillText('Water sites', 20, h-50);
         ctx.fillText(`Closest site : ${closestSite}`, 20, h-10);
        
         waterSites.forEach((p,i) => {
          ctx.fillStyle = 'rgba(0,75,255,0.7)';

          const transformedPoint = transformPointWithScale(p, w, h, margin, scaleInfo);

          ctx.beginPath();
          ctx.arc(transformedPoint[0], transformedPoint[1], 5, 0, Math.PI*2);
          ctx.fill();
           })
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
      value: (function(){return(
{
  mousePos : {},
  clicks : 0
}
)})
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
    }
  ]
};

const notebook = {
  id: "0268b2eb90be370b@377",
  modules: [m0]
};

export default notebook;
