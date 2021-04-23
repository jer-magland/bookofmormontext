import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import FullTextView from './FullTextView';
import {load as loadBookOfMormon} from './bookofmormon'
import {useHistory, useLocation} from 'react-router-dom'
import QueryString from 'querystring'
import MenuBar from './MenuBar';

const useBookOfMormon = () => {
    return useMemo(() => {
        return loadBookOfMormon()
    }, [])
}

//////////////////////////////////////////////////////////////

// Thanks: https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
      width,
      height
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
      function handleResize() {
          setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
//////////////////////////////////////////////////////////////////////////////////////////////////

function App() {
  const bom = useBookOfMormon()

  const { width, height } = useWindowDimensions()

  const location = useLocation()
  const history = useHistory()
  const query = QueryString.parse(location.search.slice(1));

  const mode = (query.mode || 'default') as 'default' | 'experimental1'

  const handleSetMode = useCallback((mode: 'default' | 'experimental1') => {
    const location2 = {...location}
    location2.search = mode === 'default' ? '' : `?mode=${mode}`
    history.push(location2)
  }, [])

  if (!['default', 'experimental1'].includes(mode)) return <h3 style={{padding: 10}}>Invalid mode: {mode}</h3>

  return (
    <div className="App">
      <MenuBar mode={mode} setMode={handleSetMode} />
      <FullTextView width={width} height={height - 20} bookOfMormon={bom} mode={mode} />
    </div>
  );
}

export default App;
