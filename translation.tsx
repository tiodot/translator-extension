import React, { useEffect, useState } from "react"
import Dictionary from "~components/dictionary"
import SendIcon from "data-base64:~assets/send.png"
import CopyIcon from "data-base64:~assets/copy.png"
import DoneIcon from "data-base64:~assets/done-all.png"
import '~/components/dictionary.css'
import '~/translation.css'

interface TranslationProps {}

const Translation: React.FC<TranslationProps> = () => {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'word' | 'sentence' | ''>("");
  const [translatedText, setTranslatedText] = useState("");
  const [dictionary, setDictionary] = useState<any>({})
  const [done, setDone] = useState(false)

  // 翻译函数（示例用简单转换，实际需调用 API）
  const handleTranslate = () => {
    console.log('handle translate')
    if (loading) {
      return
    }
    setLoading(true)
    setType('')
    chrome.runtime.sendMessage({
      type: 'FETCH_DATA',
      data: {
        word: inputText.trim(),
      }
    })
  };

  const handleReset = () => {
    setInputText('')
    setType('')
    setTranslatedText('')
  }

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey) {
      if (e.key === 'Enter') {
        handleTranslate()
      }
      if (e.key === 'Backspace') {
        handleReset()
      }
    }
    console.log('key:', e.key)
  };

  const copyText = () => {
    navigator.clipboard.writeText(translatedText).then(() => {
      setDone(true)
      setTimeout(() => {
        setDone(false)
      }, 2000)
    })
  }

  useEffect(() => {
    const handler = (message: any) => {
      console.log(message.data, "message.data")
      if (message.type === "SHOW_TRANSLATION_POPUP") {
        console.log(message.data, "message.data")
        setType('sentence')
        setTranslatedText(message.data.translation)
      }
      if (message.type === "SHOW_WORD_POPUP") {
        setDictionary(message.data)
        setType('word')
      }

      if (message.type === "FETCH_DATA_DONE") {
        setLoading(false)
      }
    }
    chrome.runtime.onMessage.addListener(handler)

    return () => {
      chrome.runtime.onMessage.removeListener(handler)
    }
  }, [])

  return (
    <div className="translation-container">
      {/* 输入区域 */}
      <div className="translation-input">
        <textarea
          placeholder="Enter the text to be translated..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            width: "100%",
            height: 150,
            padding: 10,
            marginBottom: 10,
            resize: "none",
          }}
          onKeyUp={handleEnter}
        />
        <button
          onClick={handleTranslate}
          className="translation-action"
          disabled={loading}
        >
          <img src={SendIcon} alt="translate" />
        </button>
      </div>

      {loading && <div className="loading">翻译中...</div>}

      {type === 'word' && <Dictionary word={dictionary.word} response={dictionary.response} />}
      {type === 'sentence' && <div className="translation-text" onDoubleClick={copyText}>
        {translatedText}
        <img src={done ? DoneIcon : CopyIcon} alt="copy" onClick={copyText}/>
      </div>}

    </div>
  );
};

export default Translation;