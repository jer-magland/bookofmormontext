import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import FullTextView from './FullTextView';
import { Preferences, PreferencesProviderContext, useCurrentBookChapter, useMode } from './common/hooks';
import SideDrawer from './SideDrawer';

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

const defaultPreferences: Preferences = {
  showPunctuation: true,
  separateVerses: true,
  showChapterTitles: true
}

function App() {
  const { width, height } = useWindowDimensions()

  const mode = useMode()

  const {book, chapter} = useCurrentBookChapter()

  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences)

  if (!['default', 'experimental1'].includes(mode)) return <h3 style={{padding: 10}}>Invalid mode: {mode}</h3>

  const topHeight = 35
  const keyForResettingScrollPosition = `${book ? book.name : ''}-${chapter ? chapter.reference : ''}`
  return (
    <PreferencesProviderContext.Provider value={{preferences, setPreferences}}>
      <div className="App">
        <div style={{width, height: topHeight}}>
            <SideDrawer />
        </div>
        <div key={keyForResettingScrollPosition} style={{width, height: height - topHeight, overflowY: 'auto'}}>
          <FullTextView width={width} height={height - 20} mode={mode} />
        </div>
      </div>
    </PreferencesProviderContext.Provider>
  );
}

export default App;
