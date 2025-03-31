import cssText from "data-text:~/contents/sentence.css"
import React, { useEffect, useMemo, useRef, useState } from "react"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const Sentence: React.FC = () => {
  const [word, setWord] = useState("")
  const [translation, setTranslation] = useState("")
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (message) => {
      // console.log(message, 'message listener')
      if (message.type === "SHOW_TRANSLATION_POPUP") {
        setVisible(true)
        // setWord(message.data.word)
        console.log(message.data, "message.data")
        setWord(message.data.word)
        setTranslation(message.data.translation)
        containerRef.current.parentElement.style.left = `${message.data.x}px`
        containerRef.current.parentElement.style.top = `${message.data.y}px`
      }
    }
    chrome.runtime.onMessage.addListener(handler)
    const hideListener = () => {
      setVisible(false)
    }
    document.addEventListener("HIDE_ALL", hideListener)
    return () => {
      document.removeEventListener("HIDE_ALL", hideListener)
      chrome.runtime.onMessage.removeListener(handler)
    }
  }, [])

  return (
    <div
      className="container"
      ref={containerRef}
      style={{ display: visible ? "block" : "none" }}>
      <div className="header">{word}</div>
      <div className="section">{translation}</div>
    </div>
  )
}

export default Sentence
