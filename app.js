// Get the sample json endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

//test how to retrive samples data from the json
//d3.json(url).then(function(data) {
  //let samplesValues=data.samples;
  //console.log(samplesValues[0]);
//});

//function to display the initial hbar, bubblechar,Metadata
function init() {
  // Get a handle to the dropdown
  let dropdownMenu = d3.select('#selDataset');

  d3.json(url).then(data => {
      console.log('Here is the data');

      let sampleNames = data.names;
      
      // Populate the dropdown
      sampleNames.forEach(function(SelectedId) {
        dropdownMenu.append('option').text(SelectedId).property('value', SelectedId);
      });

      // Assign the value of the dropdown menu option to a letiable
      let initialId = dropdownMenu.property('value');
      //console.log(`initialId = ${initialId}`);

      // Draw the bargraph for the selected sample id
      hbargraph(initialId);

      // Draw the bubblechart for the selected sample id
      bubblechart(initialId);

      // Show the metadata for the selected sample id
      Metadata(initialId);

  });

}
init();

//Create a function to draw horizontal bar graph for the selected id 
function hbargraph(SelectedId) {
  //retrive the samples data 
  d3.json(url).then(function(data) {
      let idvalue = data.samples.filter(r => r.id == SelectedId);
      let result = idvalue[0];
      let otu_ids = result.otu_ids;
      let otu_labels = result.otu_labels;
      let sample_values = result.sample_values;
      //get details of the top 10 result 
      let xticks = sample_values.slice(0,10).reverse();
      let yticks = otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();
      let labels= otu_labels.slice(0,10).reverse()

      // Create a trace 
      let hbarData = {
          x: xticks,
          y: yticks,
          type: 'bar',
          text: labels,
          orientation: 'h'
      };

      // Create data array
      let barArray = [hbarData];

      // Create a layout object
      let barLayout = {
          title: "Top 10 Bacteria Data",
          margin: {t: 30, l: 150}
      };

      // Call the Plotly function
      Plotly.newPlot('bar', barArray, barLayout);
  })
}
//Create function to draw the bubblechart
function bubblechart(SelectedId) {

  //retrive the samples data
  d3.json(url).then(function(data) {
    let samplesdata=data.samples;
    //return the selected ID detail
    let idvalue = samplesdata.filter(result => result.id == SelectedId);
    let result = idvalue[0];
    let idselected = samplesdata[0]
    console.log(idselected)
    let otu_ids = idselected.otu_ids;
    let otu_labels = idselected.otu_labels;
    let sample_values = idselected.sample_values;
   
  //create trace
    let bubbleData = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
          size: sample_values,
          color: otu_ids   
      }
  }

  // Create data array
  let bubbleArray = [bubbleData];
  // Apply a title to the layout
        let bubbleLayout = {
            title: "Bacteria sample size",
            margin:{t:30},
            hovermode: 'closest',
            xaxis: {title: "OTU ID"},
            };

        // Call Plotly funtion
        Plotly.newPlot('bubble', bubbleArray, bubbleLayout);
    })
}

//create function to retrive the metadata
function Metadata(SelectedId) {
  d3.json(url).then(function(data) {
    let metadata=data.metadata;
    console.log(metadata);
    let response = metadata.filter(meta => meta.id == SelectedId)[0];
    console.log(response);
    let demographicInfo = d3.select('#sample-metadata');
    demographicInfo.html('');
    //add the demo info to the demo_info panel
    Object.entries(response).forEach(([key, value]) => {
      demographicInfo.append('h6').text(`${key}: ${value}`);
    });
  });
}
  
function optionChanged(SelectedId) {
  console.log(`optionChanged, new value: ${SelectedId}`);

  hbargraph(SelectedId);
  bubblechart(SelectedId);
  Metadata(SelectedId);
}


