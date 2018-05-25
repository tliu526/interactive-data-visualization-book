// Chapter 8: Axes

var width = 1000;
var height = 500;
var padding = 30;

var parseTime = d3.timeParse("%m/%d/%y");
var formatTime = d3.timeFormat("%b %e");

var timeData, xScale, yScale, xAxis, yAxis;
  
// d3 v5 now uses promises for data loading
// chrome waits 1.3 minutes to load the csv??
d3.csv("../data/time_scale_data.csv", function(row){
  return {
    Date: parseTime(row.Date),
    Amount: parseInt(row.Amount)
  };
}).then(function(data){
  timeData = data;
  console.log(timeData);

  xScale = d3.scaleTime()
  .domain([d3.min(timeData, function(d){return d.Date;}),
        d3.max(timeData, function(d){return d.Date;})])
  .range([padding, width - padding]);
  
  yScale = d3.scaleTime()
  .domain([d3.min(timeData, function(d){return d.Amount;}),
        d3.max(timeData, function(d){return d.Amount;})])
  .range([height - padding, padding]); // reverses y-scale so sizing SVGs work normally

  xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(5); //set rough # of ticks
  
  yAxis = d3.axisLeft()
          .scale(yScale)
          .tickFormat(d3.format("~g")) // ~ means trim trailing zeros, g is either decimal or exp notation
          .ticks(5);
  
  aScale = d3.scaleSqrt()
          .domain([0, d3.max(timeData, function(d){ return d.Amount;})])
          .range([0, 10]);

  var svg = d3.select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.selectAll("line")
     .data(timeData)
     .enter()
     .append("line")
     .attr("x1", function(datum){
       return xScale(datum.Date);
     })
     .attr("x2", function(datum){
      return xScale(datum.Date);
     })
     .attr("y1", height - padding)
     .attr("y2", function(datum){
      return yScale(datum.Amount)
     });

  svg.selectAll("circle")
    .data(timeData)
    .enter()
    .append("circle")
    .attr("cx", function(datum) {
      return xScale(datum.Date);
    })
    .attr("cy", function(datum){
      return yScale(datum.Amount);
    })
    .attr("r", function(datum){
      return 2;
    });

  // Axes
  // generates our xAxis within the given group g
  svg.append("g") // we append a new group element to the end of the SVG
     .attr("class", "axis")
     .attr("transform", "translate(0," + (height - padding) + ")") // translation transform
     .call(xAxis); // takes incoming selection and hands it off to given function.

  svg.append("g") 
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ", 0)") 
    .call(yAxis); 
});
