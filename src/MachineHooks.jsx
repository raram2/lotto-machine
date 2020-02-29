import React, {useMemo, useState, useRef, useEffect, useCallback} from 'react';
import Ball from './Ball';

function getWinningNumbers(from, to) {
  console.log('당첨 번호를 생성하기 위해 함수 getWinningNumbers를 호출합니다.');
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
const Machine = () => {
  const winningNumbs = useMemo(() => getWinningNumbers(45, 6), [balls]);
  // useMemo는 '함수'를 기억하는 것이 아니라 함수 '리턴 값'을 balls의 값이 바뀔(재할당 될)때 까지 기억.
  // balls 상태의 값 변경시 memo 캐싱값은 지워짐.
  // 함수형 컴포넌트는 렌더링이 일어날때마다 내부 코드가 다 재실행이 되는 방식이기 때문에 적절한 캐싱이 필요함. (Class 컴포넌트는 render 메소드 부분만 재실행)
  // useMemo -> 복잡한 함수 '결과값'을 기억, useRef -> '일반값'을 기억
  const [numbs, setNumbs] = useState(winningNumbs);
  const [balls, setBalls] = useState([]);
  const [bonus, setBonus] = useState(null);
  const [reset, setReset] = useState(false);
  const timeouts = useRef([]);
  const onReset = useCallback(() => {
    // useCallback은 이 '함수'를 numbs의 값이 바뀔(재할당 될)때 까지 기억한다
    console.log('다시 뽑기 시작합니다.');
    setNumbs(getWinningNumbers(45, 6));
    setBonus(null);
    setBalls([]);
    setReset(false);
    timeouts.current = [];
  }, [numbs]); // numbs 상태의 값 변경시 캐싱값은 지워짐.
  const showBalls = () => {
    console.log('당첨 번호를 보여주기 시작합니다.');
    for (let i = 0; i < numbs.length - 1; i++) {
      timeouts.current[i] = setTimeout(() => {
        setBalls(prevBalls => [...prevBalls, numbs[i]]);
      }, (i + 1) * 1000);
    }
    timeouts.current[6] = setTimeout(() => {
      setBonus(numbs[6]);
      setReset(true);
    }, 7000);
  };
  useEffect(() => {
    console.log('당첨 번호가 생성되었습니다.');
    showBalls();
    return () => {
      timeouts.current.forEach(val => {
        clearTimeout(val);
      });
    };
  }, [timeouts.current]); // onReset 함수에서 timeouts가 변경됨 (빈 배열로 재할당이 이루어짐)
  // 빈 배열이면 componentDidMount와 동일
  // 그 배열에 요소가 있으면 componentDidMount와 componentDidUpdate 둘 다 수행 (단, 요소의 값이 변경(재할당)이 이루어진 경우)
  return (
    <>
      <div>당첨 번호</div>
      <div id='results'>
        {balls.map(v => (
          <Ball key={v} number={v} />
        ))}
      </div>
      <div>보너스 번호</div>
      {/* 표현식 결과가 null 또는 false 일 경우 렌더하지 않음 */}
      {bonus && <Ball number={bonus} />}
      {reset && <button onClick={onReset}>다시 뽑기</button>}
    </>
  );
};

export default Machine;
