import React from 'react';
import ReactDOM from 'react-dom';




class Case extends React.Component {
  render() {
    return <div>{this.props.height + ' ' + this.props.height}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.init = {
      caseWidth : 20,
      caseHeight : 20
    }
    this.state = {
      width : 0,
      height : 0,
      widthPerCase : 0,
      heightPerCase : 0
    };
  }


  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  updateWindowDimensions() {
    this.setState({
      width : window.innerWidth,
      height : window.innerHeight,
      widthPerCase : window.innerWidth / this.init.caseWidth,
      heightPerCase : window.innerHeight / this.init.caseHeight
    });
  }

  render() {
    return <Case width={this.state.widthPerCase} height={this.state.heightPerCase} />;
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)
