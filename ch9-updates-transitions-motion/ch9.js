// Ch 9: Updates, Transitions, and Motion

var width = 600;
var height = 250;

var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
  11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

var maxValue = 50;

var xScale = d3.scaleBand() // ordinal scale (ordered categorical)
               .domain(d3.range(dataset.length)) 
               .range([0, width]) // scaleBand automatically divides this output range into 
                                  // even bands corresponding to the length of the domain
               .round(true) // enable rounding for sharp edges, due to anti-aliasing of half-pixels
               .paddingInner(0.05); // 5% of the width of each band will be used for spacing 
               //,rangeRound([0, width]) also enables rounding

var yScale = d3.scaleLinear()
               .domain([0, d3.max(dataset)])
               .range([0, height]);

var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

svg.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect")
   .attr("x", function(datum, idx){
     return xScale(idx);
   })
   .attr("y", function(datum){
     return height - yScale(datum);
   })
   .attr("width", xScale.bandwidth())
   .attr("height", function(datum){
     return yScale(datum);
   })
   .attr("fill", function(datum){
    return "rgb(0,0," + datum * 10 + ")";
   });
  
svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(datum){
      return datum;
    })
    .attr("x", function(datum, idx){
      return xScale(idx) + xScale.bandwidth() / 2;
    })
    .attr("y", function(datum){
      return height - yScale(datum) + 15;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "white")
    .attr("text-anchor", "middle");

d3.select("p")
  .on("click", function(){
    /*
    var numValues = dataset.length;               //Count original length of dataset
    dataset = [];                                       //Initialize empty array
    for (var i = 0; i < numValues; i++) {               //Loop numValues times
      var newNumber = Math.floor(Math.random() * maxValue); //New random integer (0-24)
      dataset.push(newNumber);                        //Add new number to array
    }
    */
    var newNumber = Math.floor(Math.random() * maxValue); //New random integer (0-24)
    dataset.push(newNumber);

    var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([0, height]);

    xScale.domain(d3.range(dataset.length))

    var bars = svg.selectAll("rect")
                  .data(dataset);
    
    bars.enter()
        .append("rect")
        .attr("x", width)
        .attr("y", function(datum){
          return height - yScale(datum);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(datum){
          return yScale(datum);
        })
        .attr("fill", function(datum){
          return "rgb(0, 0, " + Math.round(datum * 10) + ")";
        })
        .merge(bars)
    /*
    svg.selectAll("rect")
       .data(dataset)
    */
       .transition() // an initial value of the attr must be set in order to transition
       .duration(500)
       .delay(function (datum, idx){
        return idx / dataset.length * 1000;
       })
       .attr("x", function(datum, idx){
         return xScale(idx);
       })
       .attr("y", function(d){
         return height - yScale(d);
       })
       .attr("height", function(d){
        return yScale(d);
       })
       .attr("fill", function(datum){
        return "rgb(0,0," + datum * 10 + ")";
       });

    var text = svg.selectAll("text")
                  .data(dataset);

    text.enter()
       .append("text")
       .text(function(datum){
        return datum;
        })
        .attr("x", function(datum, idx){
          return width + xScale.bandwidth() / 2; 
        })
        .attr("y", function(datum){
          return height - yScale(datum) + 15;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white")
        .attr("text-anchor", "middle")
       .merge(text)
       .transition()
       .duration(500)
       .delay(function (datum, idx){
        return idx / dataset.length * 1000;
        })
       .text(function(datum){
         return datum;
       })
       .attr("x", function(datum, idx){
         return xScale(idx) + xScale.bandwidth() / 2;
       })
       .attr("y", function(datum){
         var pad = datum <= 3 ? -2: 15;
         return height - yScale(datum) + pad;
       })
       .attr("fill", function(datum){
         return datum <= 3 ? "black" : "white";
    });
  });
/*
// random scatter plot
var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var maxXValue = 1000 * Math.random();
var maxYValue = 500 * Math.random();
var numDataPoints = 20;
var radius = 3;
var padding = 35;

var scatterData = [];
for (var i = 0; i < numDataPoints; i++){
  xVal = Math.floor(Math.random() * maxXValue);
  yVal = Math.floor(Math.random() * maxYValue);
  scatterData.push([xVal, yVal]);
}

var xScale = d3.scaleLinear()
              .domain([0, maxXValue])
              .range([padding, width - padding * 2]);
var yScale = d3.scaleLinear()
              .domain([0, maxYValue])
              .range([height - padding, padding]);

xAxis = d3.axisBottom()
          .scale(xScale)
          .tickFormat(d3.format("~g")) // ~ means trim trailing zeros, g is either decimal or exp notation
          .ticks(5); //set rough # of ticks

yAxis = d3.axisLeft()
        .scale(yScale)
        .tickFormat(d3.format("~g")) // ~ means trim trailing zeros, g is either decimal or exp notation
        .ticks(5);

svg.append("clipPath")
    .attr("id", "chart-area")
    .append("rect")
    .attr("x", padding)
    .attr("y", padding)
    .attr("width", width - padding * 3)
    .attr("height", height - padding * 2);

svg.append("g")
   .attr("id", "circles")
   .attr("clip-path", "url(#chart-area)")
   .selectAll("circle")              
   .data(scatterData)
   .enter()
   .append("circle")
   .attr("cx", function(datum){
     return xScale(datum[0]);
   })
   .attr("cy", function(datum){
    return yScale(datum[1]);
   })
   .attr("r", radius);

// Axes
// generates our xAxis within the given group g
svg.append("g") // we append a new group element to the end of the SVG
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height - padding) + ")") // translation transform
    .call(xAxis); // takes incoming selection and hands it off to given function.

svg.append("g") 
  .attr("class", "y axis")
  .attr("transform", "translate(" + padding + ", 0)") 
  .call(yAxis); 

d3.select("p")
  .on("click", function(){
    maxXValue = 1000 * Math.random();
    maxYValue = 500 * Math.random();

    scatterData = [];
    for (var i = 0; i < numDataPoints; i++){
      xVal = Math.floor(Math.random() * maxXValue);
      yVal = Math.floor(Math.random() * maxYValue);
      scatterData.push([xVal, yVal]);
    }

    xScale.domain([0, d3.max(scatterData, function(d){ return d[0];})]);
    yScale.domain([0, d3.max(scatterData, function(d){ return d[1];})]);

  svg.selectAll("circle")              
   .data(scatterData)
   .transition()
   .duration(1000)
   .on("start", function(){
     // executes at the start of the transition
     d3.select(this)
       //.transition() this will overwrite the movement transition as only one transition can be active at a time
       .attr("fill", "magenta")
       .attr("r", 4);
   })
   .attr("cx", function(datum){
     return xScale(datum[0]);
   })
   .attr("cy", function(datum){
    return yScale(datum[1]);
   })
   //.on("end", function(){
   //  d3.select(this)
   .transition()
   .duration(1000)
   .attr("fill", "black")
   .attr("r", 2);
   

   svg.select(".x.axis")
      .transition()
      .duration(1000)
      .call(xAxis);
  
   svg.select(".y.axis")
      .transition()
      .duration(1000)
      .call(yAxis);
  });
*/