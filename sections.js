
/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
var scrollVis = function() {
  // constants to define the size
  // and margins of the vis area.
  var width = 900;
  var height = 520;
  var margin = {top:50, left:40, bottom:100, right:40};

  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.
  var lastIndex = -1;
  var activeIndex = 0;


  /* TODO Variables for each visualization */

  var co2Data;

  var xScale = d3.scale.linear()
    .domain([0,10])
    .range([0, width]);

    var co2Scale = d3.scale.sqrt()
    .domain([0,5000])
    .range([0, 100]);

  // var xScaleOrdinal = d3.scale.ordinal()
  //   .domain(["Japan", "India", "China", "USA"])
  //   .rangePoints([0, width]);

  var xAxisBar = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat("")
    .ticks(0);

  var yScaleCo2 = d3.scale.linear()
    .domain([0,50])
    .range([height-margin.bottom, margin.top]);

  var yScaleCo2Log = d3.scale.sqrt()
  .domain([0,100])
  .range([height-margin.bottom, margin.top]);

  // main svg used for visualization
  var svg = null;
  var svg2 = null;

  // d3 selection that will be used
  // for displaying visualizations
  var g = null;

  // When scrolling to a new section
  // the activation function for that
  // section is called.
  var activateFunctions = [];
  // If a section has an update function
  // then it is called while scrolling
  // through the section with the current
  // progress through the section.
  var updateFunctions = [];

  /**
   * chart
   *
   * @param selection - the current d3 selection(s)
   *  to draw the visualization in. For this
   *  example, we will be drawing it in #vis
   */
  var chart = function(selection) {
    selection.each(function(rawData) {
      // create svg and give it a width and height

      // TODO Edit this svg declaration as required
      svg = d3.select(this).selectAll("svg").data([co2Data]);
      svg.enter().append("svg").append("g");

      svg.attr("width", width + margin.left + margin.right);
      svg.attr("height", height + margin.top + margin.bottom);

      // this group element will be used to contain all
      // other elements.
      g = svg.select("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // TODO perform some preprocessing on raw data
      co2Data = d3.nest().key(function(d) { return d.year; })
      .sortKeys(d3.ascending)
      .entries(rawData);
      // console.log(co2Data);

      setupVis(co2Data);

      setupSections();

    });
  };


  /**
   * setupVis - creates initial elements for all
   * sections of the visualization.
   *
   * @param wordData - data object for each word.
   * @param fillerCounts - nested data that includes
   *  element for each filler word type.
   * @param histData - binned histogram data
   */
  setupVis = function(co2Data, otherData, otherData2) {
    // axis
    g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height-60) + ")")
      .call(xAxisBar);

    g.select(".x.axis")
    .style("opacity", 1);
  };

  /**
   * setupSections - each section is activated
   * by a separate function. Here we associate
   * these functions to the sections based on
   * the section's index.
   *
   */
  setupSections = function() {
    // activateFunctions are called each
    // time the active section changes
    activateFunctions[0] = showOverview;
    for(var i = 1; i < 13; i++) {
      activateFunctions[i] = function() {
        line();
        showCountryEmissions();
        handleThermometer(2);
      }
    }
    for(var i = 13; i < 28; i++) {
      activateFunctions[i] = function() {
        showCarbonBudget();
        handleThermometer(1);
        handleThermometer(2);
      }
    }

    // updateFunctions are called while
    // in a particular section to update
    // the scroll progress in that section.
    // Most sections do not need to be updated
    // for all scrolling and so are set to
    // no-op functions.
    for(var i = 0; i < 22; i++) {
      updateFunctions[i] = function() {};
    }
    updateFunctions[7] = function() {};
  };

  /**
   * ACTIVATE FUNCTIONS
   *
   * These will be called their
   * section is scrolled to.
   *
   * General pattern is to ensure
   * all content for the current section
   * is transitioned in, while hiding
   * the content for the previous section
   * as well as the next section (as the
   * user may be scrolling up or down).
   *
   */

  /**
   * showCountryEmissions - initial title
   *
   * hides: count title
   * (no previous step to hide)
   * shows: intro title
   *
   */
  var SECTION_1_SHOWING = false;
  var SECTION_LINE_SHOWING = false;
  var IS_SMOKE_SHOWING = false;
  var CURRENT_YEAR = 1990;

  function showCountryEmissions() {
    var year = (activeIndex-1)*2+1990;
    if(year>2012) {
      return;
    }
    var counter = -1;
    var newData = co2Data[(activeIndex-1)*2].values.sort( function(a,b) { return parseInt(b.co2) - parseInt(a.co2); } ).slice(1,11);
    var newRank = [];
    var newCo2 = [];
    newData.forEach(function(d) {
      newRank.push(d.country);
    });
    newData.forEach(function(d) {
      newCo2.push(d.year);
    });
    document.getElementById('SAMPLE').innerHTML = newRank.join(' ')+'<br>'+newCo2.join(' ');
    if(SECTION_2_SHOWING) {
      document.getElementById('vis2').style.display = 'none';
      document.getElementById('vis').style.display = 'inline-block';
      document.getElementById('vis1').style.display = 'block';
    }
    if(!SECTION_1_SHOWING) {
      newData.forEach(function(d) {
        g.append("svg:image")
        .attr("xlink:href","img/city-"+d.continent+".png")
        .attr('x',function(d) { counter++; return xScale(counter)+10; })
        .attr('y',function(d) { return yScaleCo2(-6.5); })
        .attr('width', 20)
        .attr('height', 20)
        .attr('rank',counter)
        .attr("color","#0000ff")
        .attr("fill","#0000ff")
        .attr("stroke","#0000ff")
        .attr('class','graph-icon');
      });

        var counter2 = -1;
        newData.forEach(function(d) {
          g.append("text")
          .text( d.country )
          .attr('x',function(d) { counter2++; return xScale(counter2)+19; })
          .attr('y',function(d) { return yScaleCo2(-10.0); })
          .attr('class','country-text '+d.continent)
          .attr('rank',counter2)
          .on('click',function(d) {  });
        });


        counter2 = -1;
        newData.forEach(function(d) {
          IS_SMOKE_SHOWING = true;
          counter2++;
          // insertRuleForHeight(d.co2,counter2);
          // for (var i = 0; i < co2Scale(d.co2)/10; i++) {
          for (var i = 0; i < 1; i++) {
            g.append("image")
            .attr("xlink:href","img/smoke-"+d.continent+".png")
            .attr('x',function() { return xScale(counter2); })
            .attr('y',-co2Scale(d.co2)*0.5+420 )
            .attr('width',co2Scale(d.co2))
            .attr('height',co2Scale(d.co2))
            .attr('rank',counter2)
            .attr('class','smoke smoke'+counter2)
            .attr('co2',co2Scale(d.co2))
            // .style('animation-delay',0.2*i+'s')
            // .style('animation-duration',30/co2Scale(d.co2)+'s');
            // .style('animation-delay',0.2*i+'s')
          };
        });

          // Creating a duplicate on the side for use later
          // g.append("image")
          // .attr("xlink:href","img/smoke-"+d.continent+".png")
          // .attr('x',xScale(400)+10)
          // .attr('y',-co2Scale(d.co2)*0.5+420 )
          // .attr('width',co2Scale(100))
          // .attr('height',co2Scale(100))
          // .attr('rank',15)
          // .attr('class','smokeduplicate')
          // .attr('co2',co2Scale(100));

        SECTION_1_SHOWING = true;
    } else {
      if(!IS_SMOKE_SHOWING) {
        
      } else {
        var existingElements = g.selectAll('.country-text');
        var existingIcons = g.selectAll('.graph-icon');
        var existingSmoke = g.selectAll('.smoke');
        // var duplicateSmoke = g.selectAll('.smokeduplicate');
        var oldRank = [];
        for (var i = 0; i < existingElements[0].length; i++) {
          oldRank.push(existingElements[0][i].textContent);
        }

        for (var i = 0; i < existingElements[0].length; i++) {
          var nR = newRank.indexOf(existingElements[0][i].textContent);
          if(nR>=0) {
            existingElements[0][i].setAttribute('rank',nR);
            existingIcons[0][i].setAttribute('rank',nR);
            existingSmoke[0][i].setAttribute('rank',nR);
          } else {
            existingElements[0][i].setAttribute('rank',15);
            existingIcons[0][i].setAttribute('rank',15);
            existingSmoke[0][i].setAttribute('rank',15);
          }
        }

        for (var i = 0; i < newRank.length; i++) {
          if(oldRank.indexOf(newRank[i])<0) {
            // Element doesn't exist so create it and assign it's rank
            g.append("text")
            .text( newRank[i] )
            .attr('x',function(d) { return xScale(400)+19; })
            .attr('y',function(d) { return yScaleCo2(-10.0); })
            .attr('class','country-text '+newData[i].continent)
            .attr('rank',i)
            .on('click',function(d) {  });

            g.append("svg:image")
            .attr("xlink:href","img/city-"+newData[i].continent+".png")
            .attr('x',function(d) { return xScale(400)+10; })
            .attr('y',function(d) { return yScaleCo2(-6.5); })
            .attr('width', 20)
            .attr('height', 20)
            .attr('rank',i)
            .attr('class','graph-icon');


            // Pick the first available duplicate smoke and repurpose it
            // duplicateSmoke[0][0].setAttribute('width',co2Scale(newData[i].co2));
            // duplicateSmoke[0][0].setAttribute('height',co2Scale(newData[i].co2))
            // duplicateSmoke[0][0].setAttribute('y',-co2Scale(newData[i].co2)*0.5+420);
            // duplicateSmoke[0][0].setAttribute("href","img/smoke-"+newData[i].continent+".png");
            // duplicateSmoke[0][0].setAttribute('class','smoke smoke'+i);
            // duplicateSmoke[0][0].setAttribute('rank',i)

            // g.append("image")
            // .attr("xlink:href","img/smoke-"+newData[i].continent+".png")
            // .attr('x',function() { return xScale(400)+10; })
            // .attr('y',-co2Scale(newData[i].co2)*0.5+420 )
            // .attr('width',co2Scale(newData[i].co2))
            // .attr('height',co2Scale(newData[i].co2))
            // .attr('rank',i)
            // .attr('class','smoke smoke'+i)
            // .attr('co2',co2Scale(newData[i].co2))
            // .style('animation-delay',0.2*i+'s')
          } else {
              // Repurpose existing smoke
              existingSmoke[0][i].setAttribute('width',co2Scale(newData[i].co2));
              existingSmoke[0][i].setAttribute('height',co2Scale(newData[i].co2))
              existingSmoke[0][i].setAttribute('y',-co2Scale(newData[i].co2)*0.5+420);
          }
        }

        setTimeout(function() {
          var transition = svg.transition().duration(750),
          delay = function(d, i) { return i * 30; };
          transition.selectAll('.country-text')
          .delay(delay)
          .attr('x', function(d,i) { var elt = d3.select(this); return xScale(elt.attr('rank'))+19; })

          transition.selectAll('.graph-icon')
          .delay(delay)
          .attr('x', function(d,i) { var elt = d3.select(this); return xScale(elt.attr('rank'))+10; })

          transition.selectAll('.smoke')
          .delay(delay)
          .attr('x', function(d,i) { var elt = d3.select(this); return xScale(elt.attr('rank'))+10; })
        },1);

        setTimeout(function() {
            existingElements.each(function(d,i) {
              var elt = d3.select(this);
              if(elt.attr('rank')>14) {
                elt.remove();
              }
            });
            existingIcons.each(function(d,i) {
              var elt = d3.select(this);
              if(elt.attr('rank')>14) {
                elt.remove();
              }
            });
            existingSmoke.each(function(d,i) {
              var elt = d3.select(this);
              if(elt.attr('rank')>14) {
                // elt.attr('class','smokeduplicate');
                elt.remove();
              }
            });
            console.log("All repurposing done");
            console.log(document.getElementsByClassName('smoke').length);
            // console.log(document.getElementsByClassName('smokeduplicate').length);
        },500);
      }
    }
  }

  // Insert line global varaible here
  var lineSvg;
  // Insert line here
  function setupLine(year) {
    var gy;
    var margins = {top: 30, right: 100, bottom: 100, left: 80},
      width = 1000 - margins.left - margins.right,
      height = 300 - margins.top - margins.bottom;

    var sector = ["Electricity", "Manufacturing","Transportation", "Other Fuel Combustion","Fugitive Emissions", "Industrial Processes", "Agriculture", "Waste", "Land-Use and Forestry", "Bunker Fuels"]
    var id = [1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012]

    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);
     
    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
      .orient("bottom").ticks(10).tickFormat(function(d,i){
              return sector[i];
          });
     
    var yAxis = d3.svg.axis().scale(y)
      .orient("left").ticks(6)
      .tickSize(width)
      .outerTickSize(0)
        .orient("right");
     
    // Define the line
    var valueline = d3.svg.line()
      .x(function(d) { return x(d.sector); })
      .y(function(d) { return y(d.amount); });

    lineSvg = d3.select("#vis1")
    .append("svg")
      .attr("width", width + margins.left + margins.right)
      .attr("height", height + margins.top + margins.bottom)
    .append("g")
      .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

      // Get the data
    d3.csv("line_data.csv", function(error, data) {
        if(error){
        console.log( error ) ;
      }

      data.forEach(function(d) {
        d.year = +d.year;
        d.sector = +d.sector;
        d.amount = +d.amount;
        
      });
     
      // Scale the range of the data
      x.domain([d3.min(data, function(d) { return d.sector; }), d3.max(data, function(d) { return d.sector; })]);
      y.domain([0, d3.max(data, function(d) { return d.amount; })]);

      var dataNest = d3.nest()
          .key(function(d) {return d.year;})
          .entries(data);

          console.log(dataNest);
     
      var count = -1;
      dataNest.forEach(function(d) {
        count++;
            lineSvg.append("path")
              .attr("class","line2")
                .attr("id", id[count])
                .attr("d", valueline(d.values))
                .attr("opacity", 0)
                .attr("stroke", "grey");
      });

      for(var i=1990;i<year;i=i+2){
        document.getElementById(i).setAttribute("opacity","0.3");
        document.getElementById(i).setAttribute("stroke-width",1);
        document.getElementById(i).addEventListener('mouseover', on, false);
        document.getElementById(i).addEventListener('mouseout', out, false);
      }

      document.getElementById(year).setAttribute("stroke","#336B87");
      document.getElementById(year).setAttribute("opacity","1");
      document.getElementById(year).setAttribute("stroke-width",2);
     
      // Add the X Axis
      lineSvg.append("g")   
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
          .attr("y", 9)
          .attr("x", 9)
          .attr("dy", ".35em")
          .attr("transform", "rotate(30)")
          .style("text-anchor", "start"); 
     
      // Add the Y Axis
      gy = lineSvg.append("g")    
        .attr("class", "y axis")
        .call(yAxis);

      gy.selectAll("g").filter(function(d) { return d; })
          .classed("minor", true);

      gy.selectAll("text")
          .attr("x", -48)
          .attr("dy", 5);
        FILE_LOADED = true;
    });
  }

var FILE_LOADED = false;

var on = function (event) {
        d3.select(this)
        .attr("stroke","#66A5AD")
        .attr("stroke-width",2)
        .attr("opacity",1);

        var year = d3.select(this).attr("id");

        console.log(year);

        lineSvg.append("text")
        .attr("id", year*2)
        .attr("x", 80)
        .attr("dy", 150)
        .attr("fill","#66A5AD")
        .text(year);
        };

var out = function (event) {
        d3.select(this)
        .attr("stroke","grey")
        .attr("stroke-width",1)
        .attr("opacity",0.3);

        var year = d3.select(this).attr("id") *2;
        console.log(year);

        document.getElementById(year).remove();


        };

function line(){
  var year = (activeIndex-1)*2 + 1990;
  if(year>2012) { return; }
  // Adds the svg canvas
  if(SECTION_LINE_SHOWING == false) {
    setupLine(year);
    console.log("FIRST FUNCTION");
    SECTION_LINE_SHOWING = true;
  }
  else if(FILE_LOADED==true){
    console.log("SECOND FUNCTION");
    //Here I wwant to remove old attribute.
    for(var m= 1990;m<2013;m++){
      document.getElementById(m).removeEventListener('mouseover',on,false);
      document.getElementById(m).removeEventListener('mouseout',out,false);
    }
    lineSvg.selectAll(".line2")
    .attr("opacity","0");
    

    for(var i=1990;i<year;i=i+2){
      var elm = document.getElementById(i);
        elm.setAttribute("opacity","0.3");
        elm.setAttribute("stroke","grey");
        elm.setAttribute("stroke-width",1);
        elm.addEventListener('mouseover', on, false);
        elm.addEventListener('mouseout', out, false);

      }

      elm2 = document.getElementById(year);
      elm2.setAttribute("stroke","#336B87");
      elm2.setAttribute("opacity","1");
      elm2.setAttribute("stroke-width",2 );
  }
}


  var insertRuleForHeight = function(co2,index) {
    var dynamicStyleSheet = document.getElementById('dynamic');
    if(typeof dynamicStyleTag=='undefined') {
      var dynamicStyleTag = document.createElement('style');
      dynamicStyleTag.type = 'text/css';
      dynamicStyleTag.id = 'dynamic'; 
      dynamicStyleTag.appendChild(document.createTextNode(""));
      document.head.appendChild(dynamicStyleTag);
      dynamicStyleSheet = dynamicStyleTag.sheet;
    } else {
      dynamicStyleSheet = document.styleSheets[document.styleSheets.length - 1];
    }

    dynamicStyleSheet.insertRule('@-webkit-keyframes smoking'+index+' {\
      0% {\
        opacity: 1;\
        transform: translate(none);\
      }\
      100% {\
        opacity: 0.0;\
        transform: translate(0, -'+yScaleCo2(-co2Scale(co2))/2+'px);\
      }\
    }');
    dynamicStyleSheet.insertRule('.smoke'+index+' {\
      -webkit-animation: smoking'+index+' linear 2s infinite;\
    }');
  }

  /**
   * showComparison - initial title
   *
   * hides: count title
   * (no previous step to hide)
   * shows: intro title
   *
   */

   var SECTION_2_SHOWING = false;


  function showCarbonBudget() {
    /* Hide previous svg */
    /* Create double graph */
    document.getElementById('vis').style.display = 'none';
    document.getElementById('vis1').style.display = 'none';
    document.getElementById('vis2').style.display = 'inline-block';
    if(!SECTION_2_SHOWING) {
        SECTION_2_SHOWING = true;
        // Read in .csv data and make graph
    }
  }



  function showOverview() {
    // Call setupThermometer
    // Call updateThermometer
    // Call setupWorldIcon
    // Call setupWorldSmoke
  }

  var recSvg;
  function setupThermometer(parentNum) {
    // Create the svg and append it to the parent id with the width set to 100%;
    recSvg = d3.select("#thermometer"+parentNum)
      .append("svg")
      .attr({
        "width": '100%',
        "height": '100%'
        })
      .append("g");
      // .attr("transform","");


      recSvg.append("rect")
        .attr("id","outerRECT"+parentNum)
        .attr("x", 0)
        .attr("y", 0)
        .attr("height",'100%')
        .attr("width",'100%')
        .attr("fill","red")
        .attr("stroke-width",2)
        .attr("stroke","black");

      recSvg.append("rect")
        .attr("id","innerRECT"+parentNum)
        .attr("x", 0)
        .attr("y", 0)
        .attr("height",'100%')
        .attr("width",'100%')
        .attr("fill","white")
    .attr("stroke-width",2)
        .attr("stroke","black");

      RECT_LOADED = true;

  }

  var SECTION_RECT_SHOWING = false;
  var RECT_LOADED = false;
  function handleThermometer(parentNum) {
    // If thermometer exists, call updateThermometer to set the height.
    // If thermometer does not exist, create it by calling setupThermometer and then call updateThermometer to set the height
    // Call updateThermometerWidth to set the width to the small size

    if(SECTION_RECT_SHOWING == false) {
      setupThermometer(parentNum);
      SECTION_RECT_SHOWING = true;
    }
    else {
      updateThermometerWidth(parentNum);
      updateThermometerHeight(parentNum);
    }
  }
  //define the size of divs!!!!!!!!!!!!!!!
  function updateThermometerHeight(parentNum) {
    // Find the thermometer element with that id. Set the height of the inner bar and animate it.

    //var height = document.getElementById('thermometer1').clientHeight,
    var padding = 20;


    var year = (activeIndex-1)*2+1990;
    if(year<=2012) {
      height=200;
    } else {
      height = 300;
    }
    // console.log(height);
    var yScale = d3.scale.linear()
        .domain([0,630])
        .range([height - padding, padding]);

    d3.csv("data/carbon_budget.csv", function(error, data) {
      if(error){
      console.log( error ) ;
      }

      var rect_height = data[year-1990].situation1;
      console.log("Setting height as "+yScale(rect_height)/height);
      document.getElementById('innerRECT'+parentNum).setAttribute("height", yScale(rect_height));
    });

  }

  function updateThermometerWidth(parentNum) {
    // Find the thermometer element with that id. Set the width of the inner bar and animate it.
    // var year = (activeIndex-1)*2+1990;
    var year = (activeIndex-1)*2+1990;
    console.log(year);
    if(year<=2012) {
      document.getElementById('thermometer1').className = '';
    } else {
      document.getElementById('thermometer1').className = 'tleft';
      document.getElementById('thermometer2').className = 'tright';
    }
  }

  /**
   * UPDATE FUNCTIONS


   *
   * These will be called within a section
   * as the user scrolls through it.
   *
   * We use an immediate transition to
   * update visual elements based on
   * how far the user has scrolled
   *
   */

  /**
   * DATA FUNCTIONS
   *
   * Used to coerce the data into the
   * formats we need to visualize
   * TODO Insert data functions here
   */

  /**
   * activate -
   *
   * @param index - index of the activated section
   */
  chart.activate = function(index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function(i) {
      activateFunctions[i]();
      console.log("ActiveIndex "+activeIndex);
      // CURRENT_YEAR = years[activeIndex+1];
    });
    lastIndex = activeIndex;
  };

  /**
   * update
   *
   * @param index
   * @param progress
   */
  chart.update = function(index, progress) {
    updateFunctions[index](progress);
  };

  // return chart function
  return chart;
};


/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */
function display(data) {
  // create a new plot and
  // display it
  var plot = scrollVis();
  d3.select("#vis")
    .datum(data)
    .call(plot);

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  // setup event handling
  scroll.on('active', function(index) {
    // highlight current step text
    // console.log("ok" + index);
    d3.selectAll('.step')
      .style('opacity',  function(d,i) { return i == index ? 1 : 0.1; });

    // activate current section
    plot.activate(index);
  });

  scroll.on('progress', function(index, progress){
    plot.update(index, progress);
  });
}

// load data and display
d3.csv("data/co2_data.csv", display);