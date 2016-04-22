
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
  var margin = {top:0, left:40, bottom:100, right:40};

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
    .domain([0,15])
    .range([0, width]);

    var co2Scale = d3.scale.sqrt()
    .domain([0,200000])
    .range([0, width]);

  // var xScaleOrdinal = d3.scale.ordinal()
  //   .domain(["Japan", "India", "China", "USA"])
  //   .rangePoints([0, width]);

  var xAxisBar = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat("")
    .ticks(0);

  var yScale = d3.scale.linear()
    .domain([0,20])
    .range([height, 0]);

  // main svg used for visualization
  var svg = null;

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
    for(var i = 0; i < 22; i++) {
      activateFunctions[i] = showCountryEmissions
    }
    // activateFunctions[22] = showCarbonBudget;
    // activateFunctions[23] = showCarbonBudget;

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
  var IS_SMOKE_SHOWING = false;
  var CURRENT_YEAR = 1990;

  function showCountryEmissions() {
    var counter = -1;
    var newData = co2Data[activeIndex].values.sort( function(a,b) { return parseInt(b.co2) - parseInt(a.co2); } ).slice(1,16);
    // console.log(newData);
    console.log("took data of "+activeIndex);
    if(!SECTION_1_SHOWING) {
      var countryIcon = g.selectAll("image")
        .data(newData)
        .enter()
        .append("svg:image")
        .attr("xlink:href","img/country.svg")
        .attr('x',function(d) { counter++; return xScale(counter); })
        .attr('y',function(d) { return yScale(2); })
        .attr('width', 20)
        .attr('height', 20)
        .attr('class','graph-icon')
        .style("fill", "green");


        var counter2 = -1;
        newData.forEach(function(d) {
          g.append("text")
          .text( d.country )
          .attr('x',function(d) { counter2++; return xScale(counter2); })
          .attr('y',function(d) { return yScale(1); })
          .attr('class','country-text');
        });


        SECTION_1_SHOWING = true;
        // console.log(CURRENT_YEAR);
        console.log("Created "+countryIcon[0].length+" images");
    } else {
      if(!IS_SMOKE_SHOWING) {
        var counter2 = -1;
        newData.forEach(function(d) {
        IS_SMOKE_SHOWING = true;
        g.append("image")
        .attr("xlink:href","img/co2.svg")
        .attr('x',function(d) { counter2++; return xScale(counter2); })
        .attr('y',function(d) { return yScale(5.5); })
        .attr('width',co2Scale(d.co2))
        .attr('height',co2Scale(d.co2))
        .attr('class','smoke');
        });
      } else {
        g.selectAll('.smoke').each(function(d,i) {
          var elt = d3.select(this);
          elt.attr('width',co2Scale(newData[i].co2))
          .attr('height',co2Scale(newData[i].co2))
        });

        g.selectAll('.country-text').each(function(d,i) {
          var elt = d3.select(this);
          elt.text( newData[i].country )
        });
      }
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