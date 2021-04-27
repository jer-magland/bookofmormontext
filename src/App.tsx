import React, { useCallback, useEffect, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import FullTextView from './FullTextView';
import { CustomPunctuatedChaptersProviderContext, Preferences, PreferencesProviderContext, useCurrentBookChapter, useMode, CustomPunctuatedChapters } from './common/hooks';
import SideDrawer from './SideDrawer';
import { useLocation } from 'react-router';

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
  showChapterTitles: true,
  showCustomPunctuation: true
}

function usePersistent<Type>(key: string) {
  const [storedValue, setStoredValue] = useState<Type | null>(null)
  const [initialValue, setInitialValue] = useState<Type | null>(null)
  useEffect(() => {
    const x = localStorage.getItem(key)
    if (!x) return undefined
    try {
      setStoredValue(JSON.parse(x) as Type)
      if (!initialValue) setInitialValue(JSON.parse(x) as Type)
    }
    catch(err) {
      
    }
  }, [key, initialValue])
  const setValue = useCallback((val: Type) => {
    localStorage.setItem(key, JSON.stringify(val))
    setStoredValue(val)
  }, [key, setStoredValue])
  return {initialValue, value: storedValue, setValue}
}

function App() {
  const { width, height } = useWindowDimensions()

  const mode = useMode()

  const {book, chapter} = useCurrentBookChapter()

  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences)
  const {initialValue: initialPersistentPreferences, setValue: setPersistentPreferences} = usePersistent<Preferences>('preferences')
  const savePreferences = useCallback((val: Preferences) => {
    setPersistentPreferences(val)      
  }, [setPersistentPreferences])
  useEffect(() => {
    if (initialPersistentPreferences) {
      setPreferences({...defaultPreferences, ...initialPersistentPreferences})
    }
  }, [initialPersistentPreferences])

  const [customPunctuatedChapters, setCustomPunctuatedChapters] = useState<CustomPunctuatedChapters>({})
  const {initialValue: initialPersistentCustomPunctuatedChapters, setValue: setPersistentCustomPunctuatedChapters} = usePersistent<CustomPunctuatedChapters>('customPunctuatedChapters')
  const saveCustomPunctuatedChapters = useCallback((val: CustomPunctuatedChapters) => {
    setPersistentCustomPunctuatedChapters(val)      
  }, [setPersistentCustomPunctuatedChapters])
  useEffect(() => {
    if (initialPersistentCustomPunctuatedChapters) {
      setCustomPunctuatedChapters(initialPersistentCustomPunctuatedChapters)
    }
  }, [initialPersistentCustomPunctuatedChapters])

  const location = useLocation()

  if (!['default', 'experimental1'].includes(mode)) return <h3 style={{padding: 10}}>Invalid mode: {mode}</h3>

  const topHeight = 35
  const keyForResettingScrollPosition = `${book ? book.name : ''}-${chapter ? chapter.reference : ''}`
  return (
    <PreferencesProviderContext.Provider value={{preferences, setPreferences, savePreferences}}>
      <CustomPunctuatedChaptersProviderContext.Provider value={{customPunctuatedChapters, setCustomPunctuatedChapters, saveCustomPunctuatedChapters}}>
        <div className="App">
          <div style={{width, height: topHeight}}>
              <SideDrawer />
          </div>
          <div key={keyForResettingScrollPosition} style={{width, height: height - topHeight, overflowY: 'auto'}}>
            <FullTextView width={width} height={height - 20} mode={mode} />
          </div>
        </div>
      </CustomPunctuatedChaptersProviderContext.Provider>
    </PreferencesProviderContext.Provider>
  );
}

export default App;
