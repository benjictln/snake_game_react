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

    renderRow(i) {
        var row = [];
        for (let j = 0; j < this.props.nbCaseRow; j++) {
            row.push(<Case key={i*this.props.nbCaseColumn + j} type={this.props.board[i][j]} /> )
        }
        return row;
    }

    renderBoard() {
        var board = [];
        for (var i = 0; i < this.props.nbCaseColumn; i++) {
            board.push(
                <div className='row'>
                    {this.renderRow(i)}
                </div>);
        }
        return board;
    }

    render() {
        return(
            this.renderBoard()
        );
    }
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        var board = [];
        // can't use board : Array(this.props.caseWidth).fill(Array(this.props.caseHeight).fill(0))  BECAUSE board[0][0]=1 change all the column 0
        for (let i = 0; i < this.props.caseWidth; i++) {
            var newRow = new Array(this.props.caseHeight);
            newRow.fill(0);
            board.push(newRow);
        }
        this.state = {
            widthPerCase : 100,
            heightPerCase : 100,
            board : board,   // 0 is nothing, 1 is the snake, 2 an apple, 3 an obstacle
            snake : [],
            apple : [],
            obstacle : [],
        };
    }

    componentDidMount() {
        this.startGame(5,3);
        console.log('startGame');
    }

    startGame(i, j) {
        this.setState( (prevState) => {
            var board = prevState.board;
            board[i][j] = 1;
            return {board: board,
            snake:[[i,j]]};
        });
        setInterval(this.updateGame.bind(this),4000);
    }

    getNextCase(snake,direction) {
        //direction TODO
        console.log('snake 0 is' + snake);
        var nextCase = snake;
        console.log('next case is' + nextCase[0] + ' ' + nextCase[1]);
        return([nextCase[0],(nextCase[1])+1]);
    }

    updateGame() {
        // TODO: read direction wanted by user
        // TODO: control when hitting a wall
        // TODO: automatically add an apple
        // TODO: automatically add an obstacle
        this.setState( (prevState) => {
            console.log('snake is ' + prevState.snake);
            var nextCase = this.getNextCase(prevState.snake[0],'fakeDirection');
            //var nextCase = [3,3];
            if (isThereAnObstacle(nextCase[0], nextCase[1], prevState.obstacle)) console.log('YOU LOSE :(\n\nToo bad ..');
            if (isThereTheSnake(nextCase[0], nextCase[1], prevState.snake)) console.log('YOU BITE YOURSELF :( \n\nTry smarter');
            if (isThereAnApple(nextCase[0], nextCase[1], prevState.apple)) console.log('LEVEL UPPPP :) \n\nSmart');
            var board = prevState.board.slice();
            board[nextCase[0]][nextCase[1]] = 1;
            var snake = []; //while only one part, works TODO: update this
            console.log('next case is ');
            console.log(nextCase);
            snake.push(nextCase);
            return {
                board:board,
                snake:snake,
            }
        });
        console.log('updated game');
        //setInterval(this.updateGame.bind(this),1000);
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
    <Game caseWidth={10} caseHeight={10}/>,
    document.getElementById('root')
)

function isThereTheSnake(row,col, snake) {
    //return true if the snake is present at the case at column 'col' and row 'row'
    let length = snake.length;
    for (let i = 0; i < length; i++) {
        if (snake[i][0] === row && snake[i][1] === col) return true;
    }
    return false;
}

function isThereAnApple(row,col,apple) {
    //return true if an apple is present at the case at column 'col' and row 'row'
    let length = apple.length;
    for (let i = 0; i < length; i++) {
        if (apple[i][0] === row && apple[i][1] === col) return true;
    }
    return false;
}

function isThereAnObstacle(row,col,obstacle) {
    //return true if an obstacle is present at the case at column 'col' and row 'row'
    let length = obstacle.length;
    for (let i = 0; i < length; i++) {
        if (obstacle[i][0] === row && obstacle[i][1] === col) return true;
    }
    return false;
}
