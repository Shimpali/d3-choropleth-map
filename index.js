// Import stylesheets
import './style.css';

import * as d3 from 'd3';
import * as topojson from 'topojson';

const countyURL =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
const educationURL =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

let countyData;
let educationData;

const canvas = d3.select('#canvas');
const tooltip = d3.select('#tooltip');

const getCounty = (fips) => educationData.find((item) => item['fips'] === fips);

const drawMap = () => {
  canvas
    .selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('fill', (countyDataItem) => {
      const id = countyDataItem['id'];
      const county = getCounty(id);

      const percentage = county['bachelorsOrHigher'];
      if (percentage <= 15) {
        return 'tomato';
      } else if (percentage <= 30) {
        return 'orange';
      } else if (percentage <= 45) {
        return 'lightgreen';
      } else {
        return 'limegreen';
      }
    })
    .attr('data-fips', (countyDataItem) => {
      return countyDataItem['id'];
    })
    .attr('data-education', (countyDataItem) => {
      const id = countyDataItem['id'];
      const county = getCounty(id);
      
      const percentage = county['bachelorsOrHigher'];
      return percentage;
    })
    .on('mouseover', (countyDataItem) => {
      tooltip.transition().style('visibility', 'visible');

      const id = countyDataItem['id'];
      const county = getCounty(id);

      tooltip.text(
        county['fips'] +
          ' - ' +
          county['area_name'] +
          ', ' +
          county['state'] +
          ' : ' +
          county['bachelorsOrHigher'] +
          '%'
      );

      tooltip.attr('data-education', county['bachelorsOrHigher']);
    })
    .on('mouseout', (countyDataItem) => {
      tooltip.transition().style('visibility', 'hidden');
    });
};

d3.json(countyURL).then((data, error) => {
  if (error) {
    console.log(log);
  } else {
    countyData = topojson.feature(data, data.objects.counties).features;

    d3.json(educationURL).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        educationData = data;
        drawMap();
      }
    });
  }
});
