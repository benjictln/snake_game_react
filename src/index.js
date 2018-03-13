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
                <div key={i} className='row'>
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
            direction : 1, // 0 up 1 rigth 2 down 3 left
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
        setInterval(this.updateGame.bind(this),1000);
    }

    getNextCase(snakeHead,direction) {
        switch (direction) {
            case 3:
                return ([snakeHead[0]-1,snakeHead[1]]);
                break;
            case 0:
                return ([snakeHead[0],snakeHead[1]-1]);
                break;
            case 2:
                return ([snakeHead[0],snakeHead[1]+1]);
                break;
            default:
                return ([snakeHead[0]+1,snakeHead[1]]);


        }
    }



    updateGame() {
        // TODO: read direction wanted by user
        // TODO: control when hitting a wall
        // TODO: automatically add an apple
        // TODO: automatically add an obstacle
        this.setState( (prevState) => {
            console.log('snake is ' + prevState.snake);
            var nextCase = this.getNextCase(prevState.snake[0],prevState.direction);
            //var nextCase = [3,3];
            // we check what there is at the next case.
            if (isThereAnObstacle(nextCase[0], nextCase[1], prevState.obstacle)) console.log('YOU LOSE :(\n\nToo bad ..');
            if (isThereTheSnake(nextCase[0], nextCase[1], prevState.snake)) console.log('YOU BITE YOURSELF :( \n\nTry smarter');
            if (isThereAnApple(nextCase[0], nextCase[1], prevState.apple)) console.log('LEVEL UPPPP :) \n\nSmart');
            if (nextCase[0] < 0 || nextCase[0] >= this.props.caseHeight || nextCase[1] < 0 || nextCase[1] >=this.props.caseWidth) {
                console.log('ERROR ABORD');
                nextCase = [0,0];
            }
            var board = prevState.board.slice();
            board[nextCase[0]][nextCase[1]] = 1;
            // we construct the 'new' snake
            let snake = prevState.snake.slice();
            let lengthSnake = snake.length;
            let lastBlockSnake = snake.pop();
            snake.unshift([nextCase[0],nextCase[1]]);
            // we update the board
            board[lastBlockSnake[0]][lastBlockSnake[1]] = 0;
            board[nextCase[0]][nextCase[1]] = 1;
            console.log('next case is ');
            console.log(nextCase);
            snake.push(nextCase);
            return {
                board:board,
                snake:snake,
            }
        });
        console.log('updated game');
    }

    componentWillMount() {
    }

    render() {
        return (
            <div className='game' style={{width:'100%'}}>
                <div className='game-result'>
                    <p>The current input is: {this.state.direction}</p>
                    <Result></Result>
                </div>
                <div className='game-board'>
                    <Board sizePerCase={800/this.props.caseWidth} nbCaseRow={this.props.caseHeight} nbCaseColumn={this.props.caseWidth} board={this.state.board}/>
                </div>
            </div>);
    }
}

ReactDOM.render(
    <Game caseWidth={10} caseHeight={10} onKeyDown={(e) => handleKeyPress(e) }/>,
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

function handleKeyPress (event) {


    switch (event.key) {
      case "ArrowDown":
        this.state = { direction : 2};
        break;
      case "ArrowUp":
        this.state = { direction : 0};
        break;
      case "ArrowLeft":
        this.state = { direction : 3};
        break;
      case "ArrowRight":
        this.state = { direction : 1};
        break;
      case "Enter":
        // Do something for "enter" or "return" key press.
        break;
      case "Escape":
        // Do something for "esc" key press.
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }

    // Consume the event for suppressing "double action".
    event.preventDefault();
}
