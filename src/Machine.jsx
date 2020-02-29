import React, {PureComponent} from 'react';
import Ball from './Ball';

function getWinningNumbers(from, to) {
  console.log('Got Winning Numbers');
  const allNumbs = new Array(from).fill(0).map((val, idx) => idx + 1);
  const shuffle = [];
  while (allNumbs.length > 0) {
    shuffle.push(allNumbs.splice(Math.floor(Math.random() * allNumbs.length), 1)[0]);
  }
  const bonusNumb = shuffle[shuffle.length - 1];
  const winNumbs = shuffle.slice(0, to).sort((prev, curr) => prev - curr);
  console.log(winNumbs);
  return [...winNumbs, bonusNumb];
}

export default class Machine extends PureComponent {
  state = {
    numbs: getWinningNumbers(45, 6),
    bonus: null,
    balls: [],
    reset: false,
  };
  timeouts = [];
  onReset = () => {
    this.setState({
      numbs: getWinningNumbers(45, 6),
      bonus: null,
      balls: [],
      reset: false,
    });
    this.timeouts = [];
  };
  showBalls = () => {
    for (let i = 0; i < this.state.numbs.length - 1; i++) {
      this.timeouts[i] = setTimeout(() => {
        this.setState(prevState => {
          return {
            balls: [...prevState.balls, this.state.numbs[i]],
          };
        });
      }, (i + 1) * 1000);
    }
    this.timeouts[6] = setTimeout(() => {
      this.setState({
        bonus: this.state.numbs[6],
        reset: true,
      });
    }, 7000);
  };
  componentDidMount() {
    this.showBalls();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.balls.length === 0) {
      this.showBalls();
    }
  }
  componentWillUnmount() {
    // setInterval, setTimeout 함수는 브라우저 API라서 지금 컴포넌트가 사라져도 메모리상에서 계속 실행된다.
    // 그러므로 여기서 clear 해주어야한다.
    this.timeouts.forEach(val => clearTimeout(val));
  }
  render() {
    return (
      <>
        <div>당첨 번호</div>
        <div id='results'>
          {this.state.balls.map(v => (
            <Ball key={v} number={v} />
          ))}
        </div>
        <div>보너스 번호</div>
        {/* 표현식 결과가 null 또는 false 일 경우 렌더하지 않음 */}
        {this.state.bonus && <Ball number={this.state.bonus} />}
        {this.state.reset && <button onClick={this.onReset}>다시 뽑기</button>}
      </>
    );
  }
}
