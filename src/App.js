import './App.css';
import { useState, useEffect } from 'react';
import db from './firebase';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';




function App() {
  const [Arr, setArr] = useState([0]);
  const [Mode, setMode] = useState(0);
  const [Mean, setMean] = useState(0);
  const [Median, setMedian] = useState(0);
  const [Ter, setTer] = useState('');
  const [Sd, setSd] = useState(0);


  function mean(numbers) {
    var total = 0, i;
    for (i = 0; i < numbers.length; i += 1) {
      total += numbers[i];
    }
    return total / numbers.length;
  }


  function dev(arr) {
    let mean = arr.reduce((acc, curr) => {
      return acc + curr
    }, 0) / arr.length;
    arr = arr.map((k) => {
      return (k - mean) ** 2
    })
    let sum = arr.reduce((acc, curr) => acc + curr, 0);
    let variance = sum / arr.length
    return Math.sqrt(variance)
  }



  function median(numbers) {
    var median = 0, numsLen = numbers.length;
    numbers.sort();
    if (
      numsLen % 2 === 0
    ) {
      median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
    } else {
      median = numbers[(numsLen - 1) / 2];
    }
    return median;
  }



  function mode(arr) {
    var numMapping = {};
    for (var i = 0; i < arr.length; i++) {
      if (numMapping[arr[i]] === undefined) {
        numMapping[arr[i]] = 0;
      }
      numMapping[arr[i]] += 1;
    }
    var greatestFreq = 0;
    var mod;
    for (var prop in numMapping) {
      if (numMapping[prop] > greatestFreq) {
        greatestFreq = numMapping[prop];
        mod = prop;
      }
    }
    return parseInt(mod);
  }

  const getarr = async () => {
    const arrref = collection(db, 'dat');
    await getDocs(arrref).then(
      res => {
        const nums = res.docs.map(doc => ({ data: doc.data(), id: doc.id }))
        setArr(nums[0].data.num);
        setMean(mean(Arr));
        setMedian(median(Arr));
        setMode(mode(Arr));
        setSd(dev(Arr));
      }
    ).catch(
      error => { console.log(error.message) }
    )
  }

  useEffect(() => {
    getarr();
    // eslint-disable-next-line
  }, [Arr])



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Ter === 0) return;
    var re = Arr;
    re.push(parseInt(Ter));
    const docref = doc(db, 'dat', 'o3KpzHQBFwXn1qIWRAxy');
    await updateDoc(docref, { num: re}).then(
      res => {
        console.log("number added");
        getarr();
      }
    ).catch(
      error => {
        console.log(error.message);
      }
    )
  }


  return (
    <div className="App">
      <div className='inp'>
        <form onSubmit={handleSubmit}>
          <label htmlFor='number'>enter an integer :  </label>
          <input className='inpt' type="number" value={Ter} onChange={e => setTer(e.target.value)} />
          <button className='btn' type='submit'>ADD NUMBER</button>
        </form>
      </div>
      <div className="block"><h1>mean = {Mean}</h1></div>
      <div className="block"><h1>mode = {Mode}</h1></div>
      <div className="block"><h1>median = {Median}</h1></div>
      <div className="block"><h1>Standard deviaton = {Sd}</h1></div>
    </div>
  );
}

export default App;
