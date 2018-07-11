/** Chapter 11: Paths **/

//Width and height
var w = 800;
var h = 300;
var padding = 40;
var dangerLevel = 350;

//For converting Dates to strings
var formatTime = d3.timeFormat("%Y");

d3.csv("mauna_loa_co2_monthly_averages.csv", function(data) {
  return {
    date: new Date(+data.year, (+data.month - 1)),
    average: parseFloat(data.average)
  };
}).then(function(dataset){ //convenience Fetch API method for csvs
  console.table(dataset, ["date", "average"]);

  xScale = d3.scaleTime()
             .domain([
               d3.min(dataset, function(d) { return d.date; }),
               d3.max(dataset, function(d) { return d.date; })
             ])
             .range([padding, w]);

  yScale = d3.scaleLinear()
             .domain([
                d3.min(dataset, function(d) {if (d.average >= 0) return d.average; }),
                d3.max(dataset, function (d) {return d.average; })])
             .range([h - padding, 0]);

  //defines a line generator
  var line_generator = d3.line()
                         .x(function(d) { return xScale(d.date); })
                         .y(function(d) { return yScale(d.average); })
                         .defined(function(d) {return d.average >= 0 && d.average < dangerLevel; });

  var danger_line_generator = d3.line()
                                .x(function(d) { return xScale(d.date); })
                                .y(function(d) { return yScale(d.average); })
                                .defined(function(d){return d.average >= dangerLevel;});

  var area_generator = d3.area()
           .defined(function (d) { return d.average >= 0;})
           .x(function (d) {return xScale(d.date); })
           .y0(function(d) {return yScale.range()[0]; })
           .y1(function(d) {return yScale(d.average); });

  var danger_area_generator = d3.area()
           .defined(function (d) { return d.average >=  dangerLevel; })
           .x(function (d) {return xScale(d.date); })
           .y0(function() {return yScale(dangerLevel); })
           .y1(function(d) {return yScale(d.average); });

  var xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(10)
                .tickFormat(formatTime);

  var yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(10);

  // Create SVG element
  var svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h);
  // line
  svg.append("path")
     .datum(dataset)
     .attr("class", "line")
     .attr("d", line_generator);
/*
  // danger line
  svg.append("path")
  .datum(dataset)
  .attr("class", "danger")
  .attr("d", danger_line_generator);
*/

  // area
  svg.append("path")
    .datum(dataset)
    .attr("class", "area")
    .attr("d", area_generator);
  
  svg.append("path")
  .datum(dataset)
  .attr("class", "danger")
  .attr("d", danger_area_generator);


  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0,"+ (h- padding) + ")")
     .call(xAxis);

  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate("+ padding + ", 0)")
     .call(yAxis);
  
  svg.append("line")
    .attr("class", "line safeLevel")
    .attr("x1", padding)
    .attr("x2", w)
    .attr("y1", yScale(dangerLevel))
    .attr("y2", yScale(dangerLevel))

  svg.append("text")
    .attr("class", "dangerLabel")

});