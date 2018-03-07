import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';




class Case extends React.Component {

  componentDidMount() {
    this.updateCanvas();
  }
  updateCanvas(props) {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.fillStyle = '#aaaaaa';
    ctx.clearRect(0,0, 300, 300);
    if (props) {
      ctx.fillRect(0,0,props.width,props.height);
      console.log(props.width);
    }
    else ctx.fillRect(0,0,this.props.width,this.props.height);
    console.log(this.props.width);
  }

  componentWillReceiveProps(nextProps) {
    this.updateCanvas(nextProps);
  }

  render() {
    //return <div className='case'>{this.props.row + ' ' + this.props.column}</div>;
    return <canvas ref="canvas" width={this.props.width} height={this.props.height} />;
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.board = [];
  }

  componentDidMount(){
    for (let i = 0; i < this.props.nbCaseColumn; i++) {
      var row = [];
      var boxStyle = {
        width: Math.floor(100/this.props.nbCaseColumn) + '%',
        height: Math.floor(100/this.props.nbCaseRow) + '%',
        display:'inline-block'
      };

      var height = this.props.heightPerCase;
      var width = this.props.widthPerCase;
      console.log(width + ' ' + height);
      for (let j = 0; j < this.props.nbCaseRow; j++) {
        row.push(
          <div style={boxStyle}>
            <Case row = {i} column = {j} height= {this.height} width={this.width}/>
          </div>)
      }
      this.board.push(<div className='row'>
                        {row}
                      </div>);
    }
  }
  componentWillReceiveProps(nextProps) {
    this.board = [];
    console.log('Board updated');
    console.log(this.props.widthPerCase + ' ' + this.props.heightPerCase);
    for (let i = 0; i < this.props.nbCaseColumn; i++) {
      let row = [];
      var boxStyle = {
        width:100/this.props.nbCaseColumn + '%',
        height:100/this.props.nbCaseRow + '%',
        display:'inline-block'
      };
      for (let j = 0; j < this.props.nbCaseRow; j++) {
        row.push(
          <div style={boxStyle}>
            <Case row = {i} column = {j} height= {this.props.heightPerCase} width={this.props.widthPerCase}/>
          </div>)
      }
      this.board.push(<div className='row'>
                        {row}
                      </div>);
    }
  }

  render() {
    return(this.board);
  }
}


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width : '100%',
      height : '100%',
      widthPerCase : 100,
      heightPerCase : 100
    };
  }
  /*
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
      widthPerCase : window.innerWidth / this.props.caseWidth,
      heightPerCase : window.innerHeight / this.props.caseHeight
    });
  }
*/
  render() {
    return (<div className='game' style={{width:'100%'}}>
              <div className='game-board'>
                <Board sizePerCase={800/this.props.caseWidth} nbCaseRow={this.props.caseHeight} nbCaseColumn={this.props.caseWidth}/>
              </div>
            </div>);
  }
}

ReactDOM.render(
  <Game caseWidth='10' caseHeight='10'/>,
  document.getElementById('root')
)
