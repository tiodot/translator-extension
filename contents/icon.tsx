import transIcon from "data-base64:~assets/trans.jpg"
import cssText from "data-text:~/contents/icon.css"
import React, { useEffect, useMemo, useRef, useState } from "react"
import event from "~contents/event"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const TransIcon: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)
  const dataRef = useRef({})

  const className = useMemo(() => {
    return `icon-container ${loading ? "loading" : ""} ${visible ? "show" : ""}`
  }, [loading, visible])

  const handleTranslate = () => {
    setLoading(true)
    chrome.runtime.sendMessage({
      type: 'FETCH_DATA',
      data: dataRef.current
    })
  }

  useEffect(() => {
    const listener = (event: CustomEvent) => {
      console.log('event:', event.detail)
      setLoading(false)
      setVisible(true)
      dataRef.current = event.detail
      ref.current.parentElement.style.left = `${event.detail.x}px`
      ref.current.parentElement.style.top = `${event.detail.y + 10}px`
    }

    const hideListener = () => {
      setVisible(false)
    }

    document.addEventListener("SHOW_ICON", listener)
    document.addEventListener("HIDE_ALL", hideListener)

    chrome.runtime.onMessage.addListener( (message) => {
      if (message.type === "FETCH_DATA_DONE") {
        setVisible(false)
      }
    })

    return () => {
      document.removeEventListener("SHOW_ICON", listener)
      document.removeEventListener("HIDE_ALL", hideListener)
    }
  }, [])

  return (
    <div className={className} ref={ref} onClick={handleTranslate}>
      <img src={transIcon} alt="trans" />
    </div>
  )
}

export default TransIcon
