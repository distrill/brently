send highcharts data here and browse.  
example with request-promise.

```javascript
const rp = require('request-promise');

const highchartsConfigObject = {
  chart: {
    type: 'areaspline',
  },
  title: {
    text: 'Average fruit consumption during one week',
  },
  legend: {
    layout: 'vertical',
    align: 'left',
    verticalAlign: 'top',
    x: 150,
    y: 100,
    floating: true,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  xAxis: {
    categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    plotBands: [
      {
        // visualize the weekend
        from: 4.5,
        to: 6.5,
        color: 'rgba(68, 170, 213, .2)',
      },
    ],
  },
  yAxis: {
    title: {
      text: 'Fruit units',
    },
  },
  tooltip: {
    shared: true,
    valueSuffix: ' units',
  },
  credits: {
    enabled: false,
  },
  plotOptions: {
    areaspline: {
      fillOpacity: 0.5,
    },
  },
  series: [
    {
      name: 'John',
      data: [3, 4, 3, 5, 4, 10, 12],
    },
    {
      name: 'Jane',
      data: [1, 3, 4, 3, 3, 5, 4],
    },
  ],
};

const options = {
  method: 'POST',
  uri: 'http://api.brently.bhindustries.ca/plots',
  body: {
    name: 'look at my sweet sweet data',
    config: highchartsConfigObject,
  },
  json: true,
};

rp(options)
  .then(() => console.log('done!'))
  .catch(console.log);
```
