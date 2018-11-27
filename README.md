send highcharts data here and browse.  
example with request-promise.

```javascript
const rp = require('request-promise');

const options = {
  method: 'POST',
  uri: 'http://api.brently.bhindustries.ca/plots',
  body: {
    name: 'look at my sweet sweet data',
    config: {
      // any valid highcharts config
    },
  },
  json: true,
};

rp(options)
  .then(() => console.log('done!'))
  .catch(console.log);
```
