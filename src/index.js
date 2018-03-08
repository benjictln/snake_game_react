import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



function Result() {
    return(<div>it's won.</div>)
}


class Case extends React.Component {

    componentDidMount() {
        this.draw(this.props);
    }

    updateCanvas() {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.fillStyle = '#aaaaaa';
        ctx.clearRect(0,0, 20, 20);
        ctx.fillRect(0,0,20,20);
    }

    drawNothing() {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.fillStyle = '#eeeeee';
        ctx.beginPath();
        ctx.clearRect(0,0, 20, 20);
        ctx.arc(10,10,10,0,2*Math.PI);
        ctx.fill();
    }

    drawApple() {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.fillStyle = '#008000';
        ctx.beginPath();
        ctx.clearRect(0,0, 20, 20);
        ctx.arc(10,10,10,0,2*Math.PI);
        ctx.fill();
    }

    drawSnake() {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.clearRect(0,0, 20, 20);
        ctx.arc(10,10,10,0,1.5*Math.PI);
        ctx.fill();
    }

    drawObstacle() {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.fillStyle = '#222222';
        ctx.beginPath();
        ctx.clearRect(0,0, 20, 20);
        ctx.arc(10,10,10,0,2*Math.PI);
        ctx.fill();
    }

    draw(nextProps){
        if (nextProps.type === 0) this.drawNothing();
        if (nextProps.type === 1) this.drawSnake();
        if (nextProps.type === 2) this.drawApple();
        if (nextProps.type === 3) this.drawObstacle();
    }

    componentWillReceiveProps(nextProps) {
        this.draw(nextProps);
    }


    render() {
    //return <div className='case'>{this.props.row + ' ' + this.props.column}</div>;
        return <canvas ref="canvas" width={20} height={20} />;
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board : this.props.board
        };

    }

    componentDidMount(){
        var board = [];
        for (let i = 0; i < this.props.nbCaseColumn; i++) {
            var row = [];
            var boxStyle = {
                width: 21,
                height: 21,
                display:'inline-block'
            };
            for (let j = 0; j < this.props.nbCaseRow; j++) {
                row.push(
                    <div style={boxStyle}>
                        <Case type={(this.state.board[i][j])} />
                    </div>)
            }
            board.push(
                <div className='row'>
                    {row}
                </div>);
        }
        this.setState({
            board:board
        });
    }

    render() {
        return(this.state.board);
    }
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            widthPerCase : 100,
            heightPerCase : 100,
            board : Array(this.props.caseWidth).fill(Array(this.props.caseHeight).fill(0)),   // 0 is nothing, 1 is the snake, 2 an apple, 3 an obstacle
            snake : [[0,0]],
            apple : [],
            obstacle : [],
        };
    }

    render() {
        return (
            <div className='game' style={{width:'100%'}}>
                <div className='game-result'>
                    <Result></Result>
                </div>
                <div className='game-board'>
                    <Board sizePerCase={800/this.props.caseWidth} nbCaseRow={this.props.caseHeight} nbCaseColumn={this.props.caseWidth} board={this.state.board}/>
                </div>
            </div>);
    }
}

ReactDOM.render(
    <Game caseWidth='10' caseHeight='10'/>,
    document.getElementById('root')
)

function isThereTheSnake(row,col, snake) {
    let length = snake.length;
    for (let i = 0; i < length; i++) {
        if (snake[i][0] === row && snake[i][1] === col) return true;
    }
    return false;
}

function isThereAnApple(row,col,apple) {
    let length = apple.length;
    for (let i = 0; i < length; i++) {
        if (apple[i][0] === row && apple[i][1] === col) return true;
    }
    return false;
}

function isThereAnObstacle(row,col,obstacle) {
    let length = obstacle.length;
    for (let i = 0; i < length; i++) {
        if (obstacle[i][0] === row && obstacle[i][1] === col) return true;
    }
    return false;
}
