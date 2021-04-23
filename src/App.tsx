import React, { useMemo } from 'react';
import logo from './logo.svg';
import './App.css';
import FullTextView from './FullTextView';
import {load as loadBookOfMormon} from './bookofmormon'

const useBookOfMormon = () => {
    return useMemo(() => {
        return loadBookOfMormon()
    }, [loadBookOfMormon])
}

function App() {
  const bom = useBookOfMormon()
  return (
    <div className="App">
      <FullTextView bookOfMormon={bom} mode='default' />
      <hr />
      <span style={{fontStyle: "italic"}}>
        <p>Book of Mormon text data obtained from: <a href="https://github.com/bcbooks/scriptures-json">https://github.com/bcbooks/scriptures-json</a></p>
        <p>This is an open source project: <a href="https://github.com/jer-magland/bookofmormontext">https://github.com/jer-magland/bookofmormontext</a></p>
        <p>This is not an official website of The Church of Jesus Christ of Latter-day Saints</p>
      </span>
    </div>
  );
}

export default App;
