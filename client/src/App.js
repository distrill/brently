import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plots: [],
    };
  }

  async componentDidMount() {
    const {
      data: { data: plots },
    } = await axios({
      method: 'get',
      url: 'http://localhost:3000/plots',
    });
    this.setState({ plots });
  }

  render() {
    const { plots } = this.state;
    return (
      <div>
        {plots.map(({ name, id }) => (
          <div key={id}>
            <Link to={`/${id}`}>{name}</Link>
          </div>
        ))}
      </div>
    );
  }
}

class Plot extends Component {
  constructor(props) {
    super(props);

    const { id } = this.props.match.params;
    this.state = {
      id,
      name: '',
      config: {},
    };
  }

  async componentDidMount() {
    const { id } = this.state;
    const {
      data: {
        data: { name, config },
      },
    } = await axios({
      method: 'get',
      url: `http://localhost:3000/plots/${id}`,
    });
    this.setState({ name, config: JSON.parse(config) });
  }

  render() {
    const { config } = this.state;
    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={config} />
      </div>
    );
  }
}

function App() {
  return (
    <Router>
      <div>
        <Route path="/" exact component={Home} />
        <Route path="/:id" component={Plot} />
      </div>
    </Router>
  );
}

export default App;
