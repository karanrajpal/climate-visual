
/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
var scrollVis = function() {
  // constants to define the size
  // and margins of the vis area.
  var width = 600;
  var height = 520;
  var margin = {top:0, left:20, bottom:40, right:10};

  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.
  var lastIndex = -1;
  var activeIndex = 0;


  /* TODO Variables for each visualization */

  var xScale = d3.scale.linear()
    .domain([0, 20])
    .range([0, width]);

  var xAxisBar = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  var yScale = d3.scale.linear()
    .range([0, width]);

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
      var co2Data = [10,20,30]//;

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
      .attr("transform", "translate(0," + height + ")")
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
    activateFunctions[0] = showCountryEmissions;
    activateFunctions[1] = showCountryEmissions;
    activateFunctions[2] = showCountryEmissions;
    activateFunctions[3] = showCountryEmissions;
    activateFunctions[4] = showCountryEmissions;
    activateFunctions[5] = showCountryEmissions;
    activateFunctions[6] = showCountryEmissions;
    activateFunctions[7] = showCountryEmissions;
    activateFunctions[8] = showCountryEmissions;

    // updateFunctions are called while
    // in a particular section to update
    // the scroll progress in that section.
    // Most sections do not need to be updated
    // for all scrolling and so are set to
    // no-op functions.
    for(var i = 0; i < 9; i++) {
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
  var CURRENT_YEAR = 1990;
  var data = {
  "1990": [{
    "x": 1,
    "y": 18
  }, {
    "x": 3,
    "y": 18
  }, {
    "x": 5,
    "y": 18
  }],
  "1991": [{
    "x": 7,
    "y": 18
  }, {
    "x": 9,
    "y": 18
  }, {
    "x": 11,
    "y": 18
  }],
  "1992": [{
    "x": 13,
    "y": 18
  }, {
    "x": 17,
    "y": 18
  }, {
    "x": 19,
    "y": 18
  }],
  "1993": [{
    "x": 20,
    "y": 18
  }, {
    "x": 19,
    "y": 18
  }, {
    "x": 20,
    "y": 18
  }]
}
var years = [1990,1991,1992,1993,1994,1995,1996,1997];
  function showCountryEmissions() {
    if(!SECTION_1_SHOWING) {
      var countryIcon = g.selectAll("image")
        .data(data[CURRENT_YEAR])
        .enter()
        .append("svg:image");

      var iconAttributes = countryIcon
        .attr("xlink:href","img/country.svg")
        .attr('x',function(d) { return xScale(d.x)-10; })
        .attr('y',function(d) { return xScale(18); })
        .attr('width', 20)
        .attr('height', 20)
        .attr('class','graph-icon')
        .style("fill", "green");
        SECTION_1_SHOWING = true;
        console.log(CURRENT_YEAR);
        // alert('1st time');
    } else {
      console.log(CURRENT_YEAR);
      var smokes = g
      .append("image")
      .data(data[CURRENT_YEAR]);

      var smokeAttributes = smokes
      .attr("xlink:href","img/co2.svg")
      .attr('x',function(d) { return xScale(d.x)-10; })
      .attr('y',function(d) { return xScale(13); })
      .attr('width',30)
      .attr('height',30)
      .attr('class','smoke');
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
      CURRENT_YEAR = years[activeIndex+1];
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
d3.csv("data/sampledata.csv", display);
