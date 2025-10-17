import React, { useEffect, useMemo, useState, useRef } from 'react';
import Dictionary from "~components/dictionary"
import cssText from "data-text:~/components/dictionary.css"
import wordText from "data-text:~/contents/word.css"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText + '\n' + wordText
  return style
}

const Word: React.FC = () => {
  const [word, setWord] = useState('');
  const response = useRef({})
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (message) => {
      // console.log(message, 'message listener')
      if (message.type === 'SHOW_WORD_POPUP') {
        setVisible(true)
        // console.log(message.data, 'message.data')
        if (containerRef.current) {
          containerRef.current.parentElement.style.left = `${message.data.x}px`
          containerRef.current.parentElement.style.top = `${message.data.y}px`
        }
        setWord(message.data.word)
        response.current = message.data.response
      }
    }
    chrome.runtime.onMessage.addListener(handler)
    const hideListener = () => {
      setVisible(false)
    }
    document.addEventListener('HIDE_ALL', hideListener)
    return () => {
      document.removeEventListener('HIDE_ALL', hideListener)
      chrome.runtime.onMessage.removeListener(handler)
    }
  }, [])

  return (
    <div className="word-container" ref={containerRef} style={{ display: visible ? 'block' : 'none' }}>
      <Dictionary word={word} response={response.current}></Dictionary>
    </div>
  );
};

export default Word
