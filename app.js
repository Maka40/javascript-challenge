d3.json("./data/samples.json").then(function(incomingData) {
    
    //Dropdown
    d3.select("#selDataset")
        .selectAll("option")
        .data(incomingData.names)
        .enter()
        .append("option")
        .text(d=>d)
        .attr("value",d=>d);

    optionChanged(d3.select("#selDataset").property("value"));
});

// Bar chart
function CreateHBar(x,y,text) {
    var data = [{
        x: x,
        y: y,
        text: text,
        type: 'bar',
        orientation: 'h'
    }];

    var layout = {
        title: "Top 10 OTUs"
      };

    Plotly.newPlot('bar', data, layout);
}

// Bubble chart
function CreateBubble(x,y,text) {
    var data = [{
        x: x,
        y: y,
        text: text,
        mode: 'markers',
        marker: {
          size: y,
          color: x.map(value=>value)
        }
    }];
    var layout = {
        title: "OTU Values",
        xaxis: {
            title: {
              text: 'OTU ID',
            }
        }
    };
    Plotly.newPlot('bubble', data, layout);
}

// Gauge chart
function CreateGauge(num) {
    
    var data = [
    {
        domain: { x: [0, 1], y: [0, 1] },
        value: num,
        title: "Belly Button Washing Frequency (Weekly)",
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: { range: [null, 10]},
            bar: { color: "#000000" },
            steps: [
                { range: [0, 1], color: "#FF5733" },
                { range: [1, 2], color: "#FF5E3C" },
                { range: [2, 3], color: "#FF6C4D" },
                { range: [3, 4], color: "#FF7456" },
                { range: [4, 5], color: "#FF8166" },
                { range: [5, 6], color: "#FF8E75" },
                { range: [6, 7], color: "#FE9A83" },
                { range: [7, 8], color: "#FFAE9B" },
                { range: [8, 9], color: "#FFC4B7" },
                { range: [9, 10], color: "#FFEAE5" },
            ],
        }
    }];
    Plotly.newPlot('gauge', data);
}

// Refreshes the existing unordered list in the metadata.
function Meta(data) {
    var div = d3.select("#sample-metadata");
    div.html("")
    var list = div.append("ul");
    Object.entries(data).forEach(([key, value]) => {
        list.append("li").text(key + ": " + value);
     });
}

// loads the json data using this 'master function' and populates all the charts.
function optionChanged(value) {
    d3.json("./data/samples.json").then(function(incomingData) {
        var metadata = incomingData.metadata.filter(data => data.id ==value);
        console.log(metadata);

        var sample = incomingData.samples.filter(data => data.id ==value);
        console.log(sample);

        CreateHBar(sample[0].sample_values.slice(0,10).reverse(),sample[0].otu_ids.slice(0,10).reverse().map(a=>"OTU "+ a),sample[0].otu_labels.slice(0,10).reverse());
        CreateBubble(sample[0].otu_ids,sample[0].sample_values,sample[0].otu_labels);
        Meta(metadata[0]);
        CreateGauge(metadata[0].wfreq);
    });


}