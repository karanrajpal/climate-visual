var plotBudget = function(data) {
      var height = 500;
      var width = 800;
      var padding = 60;

    var a = d3.rgb(0,0,255);
    var b = d3.rgb(255,0,0);


    var xScale = d3.scale.linear()
    .domain(d3.extent(emissions, function (d) {
      return d.x;}))
    .range([padding, width - padding]);
  
  var yScale = d3.scale.linear()
    .domain([0,1000])
    .range([height - padding, padding]);

    var xAxis = d3.svg.axis().scale(xScale)
    .orient("bottom").ticks(10);

  var yAxis = d3.svg.axis().scale(yScale)
      .orient("left");
    var svg = d3.select("#vis2")
      .append("svg")
      .attr("height", height)
      .attr("width", width);

    var defs = svg.append("defs");

  var linearGradient = defs.append("linearGradient")
            .attr("id","linearColor")
            .attr("x1","0%")
            .attr("y1","0%")
            .attr("x2","100%")
            .attr("y2","0%");

  var stop1 = linearGradient.append("stop")
        .attr("offset","0%")
        .style("stop-color",a.toString());

  var stop2 = linearGradient.append("stop")
        .attr("offset","100%")
        .style("stop-color",b.toString());

   
    // draw the line
    var line = d3.svg.line()
    .x(function(d) { return xScale(d.Year); } )
    .y(function(d) { return yScale(d.CUMULATIVE_EMISSIONS); } );

  //draw area
  var area = d3.svg.area()
    .x(function (d) { return xScale(d.Year); })
    .y0(function (d) { return yScale(0); })
    .y1(function (d) { return yScale(d.CUMULATIVE_EMISSIONS); });

    //Mouseover tip
    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([120, 40])
    .html(function(d) {
        return "<strong>" + " Year:&nbsp</strong>" +
                d.Year +"</br>"+" Cumulative emission:&nbsp" 
      +   d.CUMULATIVE_EMISSIONS + "<br>";
  });

    svg.call(tip);

    // add the x axis and x-label
    svg.append("g")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .attr("class", "axis")
    .call(xAxis)
    .selectAll("text")
      .attr("y", 9)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(30)")
      .style("text-anchor", "start");;
   
    svg.append("text")
    .attr("class", "xlabel")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height)
    .text("YEAR");

    // add the y axis and y-label
    svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

    svg.append("text")
    .attr("class", "ylabel")
    .attr("y", 0) 
    .attr("x", -230)
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("CUMULATIVE EMISSIONS (PtC)");

    svg.append("text")
    .attr("class", "graphtitle")
    .attr("y", 10)
    .attr("x", width/2)
    .style("text-anchor", "middle")
    .attr("transform", "translate(0,10)")
    .text("Carbon Budget");

    // draw the line
    svg.append("path")
    .attr("d", line(data))
    .style("stroke","url(#" + linearGradient.attr("id") + ")");

    svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr('class', 'datapoint')
    .attr('cx', function(d) { return xScale(d.Year); })
    .attr('cy', function(d) { return yScale(d.CUMULATIVE_EMISSIONS); })
    .attr('r', 6)
    .style("fill","black")
    .style("stroke","black")
    .attr('stroke-width', '3')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

    //draw area
   svg.append("path").attr("d", area(data))
    .style("fill","url(#" + linearGradient.attr("id") + ")")
    .style("opacity", 0.5)
    .style("stroke","url(#" + linearGradient.attr("id") + ")");
  }





    function showCarbonBudget() {
    /* Hide previous svg */
    /* Create line graph */
    document.getElementById('vis').style.display = 'none';
    document.getElementById('vis1').style.display = 'none';
    document.getElementById('vis2').style.display = 'inline-block';
  if(!SECTION_2_SHOWING) {
      SECTION_2_SHOWING = true;
    
      // Read in .csv data and make graph
      d3.csv("carbon_budget.csv",function(error, data) {
      if (error) {console.log(error);}
      data= data.filter(function(row) {
                    return row['Year'] == '2011' || row['Year'] == '2015'|| row['Year'] == '2020'|| row['Year'] == '2025'|| row['Year'] == '2030'|| row['Year'] == '2035'|| row['Year'] == '2040'|| row['Year'] == '2045';
        })
      years = data;
      emissions = years.map(function (year) {
        // Create shorter variable names
        return {
          x: Number(year["Year"]),
          y: Number(year["CUMULATIVE_EMISSIONS"]),
        };
      })
        .filter(function (emission) {
          return ! isNaN(emission.x) && ! isNaN(emission.y);
        });
      plotBudget(data);
    });
  } else {
    // // Read in .csv data and make graph
    //   d3.csv("carbon_budget.csv",function(error, data) {
    //   if (error) {console.log(error);}
    //   data= data.filter(function(row) {
    //         return row['Year'] == '2011' || row['Year'] == '2015'|| row['Year'] == '2020'|| row['Year'] == '2025'|| row['Year'] == '2030'|| row['Year'] == '2035'|| row['Year'] == '2040'|| row['Year'] == '2045';
    //     })
    //   years = data;
    //   emissions = years.map(function (year) {
    //     // Create shorter variable names
    //     return {
    //       x: Number(year["Year"]),
    //       y: Number(year["CUMULATIVE_EMISSIONS"]),
    //     };
    //   })
    //     .filter(function (emission) {
    //       return ! isNaN(emission.x) && ! isNaN(emission.y);
    //     });
    //   plotBudget(data);
    // });
  }
}