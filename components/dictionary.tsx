import React, { useEffect, useMemo, useState, useRef } from 'react';

const Dictionary: React.FC<{word: string, response: any}> = (props) => {
  const [word, setWord] = useState('');
  const [basic, setBasic] = useState<any>({});
  const [sentence, setSentence] = useState([]);
  const [synonym, setSynonym] = useState([]);
  const [isEnglish, setIsEnglish] = useState(true);

  const displayEnglishStyle = useMemo(() => (isEnglish ? {} : {display: 'none'}), [isEnglish])

  useEffect(() => {
    // console.log('props:', props)
    setWord(props.word)
    if (!props.response?.result) {
      return;
    }
    const result = props.response.result[0]
    // console.log(result, 'result')
    if (result.ec) {
      setIsEnglish(true)
      setBasic(result.ec.basic)
      setSentence(result.ec.sentenceSample)
      setSynonym(result.ec.synonyms || [])
    } else {
      setIsEnglish(false)
      setBasic(result.ce.basic)
      setSentence(result.ce.sentenceSample)
    }
  }, [props])

  const playAudio = (type: 'uk' | 'us') => {
    const audio = new Audio();
    audio.src = basic[type === 'uk' ? 'ukSpeech' : 'usSpeech'];
    audio.play();
  };

  return (
    <div className='dictionary-container'>
      <div className='header'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className='word'>{word}</span>
          <span className='phonetic' style={displayEnglishStyle}>
            英 {basic.ukPhonetic || ''}
            <span className='playButton' onClick={() => playAudio('uk')}>▶</span>
          </span>
          <span className='phonetic' style={displayEnglishStyle}>
            美 {basic.usPhonetic || ''}
            <span className='playButton' onClick={() => playAudio('us')}>▶</span>
          </span>
        </div>
      </div>

      <div className="explain">
        {basic.explains?.map(explain => <div className="explain-item" key={explain.pos}>
          <span className="explain-item-pos" style={displayEnglishStyle}>{explain.pos}</span>
          <span className="explain-item-word" style={{ display: isEnglish ? 'none' : 'inline-block' }}>{explain.text}</span>
          <span className="explain-item-text">{explain.trans}</span>
        </div>)
        }
      </div>

      <div className='tags' style={displayEnglishStyle}>
        {basic.examType?.map(tab => (
          <div
            key={tab}
            className='tag'
          >
            {tab}
          </div>
        ))}
      </div>

      <div className='section' style={displayEnglishStyle}>
        <div className='section-title'>
          <span className='triangle'>▶</span> 变形词
        </div>
        <div className='transform'>
          {basic.wordFormats?.map(transform => <div className='transform-item' key={transform.pos} >
            <span className='transform-item-name'>{transform.name}</span>
            <span className='transform-item-value'>{transform.value}</span>
          </div>)}
        </div>
      </div>

      <div className='section'>
        <div className='section-title'>
          <span className='triangle'>▶</span> 双语例句
        </div>
        {sentence.slice(0, 5).map(sen => (
          <div className='example' key={sen.sentence}>
            <div className='english' dangerouslySetInnerHTML={{ __html: sen.sentenceBold }}>
            </div>
            <div className='chinese'>{sen.translation}</div>
          </div>)
        )}

      </div>

      <div className='section' style={displayEnglishStyle}>
        <div className='section-title'>
          <span className='triangle'>▶</span> 同近义词
        </div>
        <div className='synonym'>
          {synonym.map(syn => <div className='synonym-item' key={syn.pos}>
            <div className="synonym-item-pos">{syn.pos}</div>
            <div className="synonym-item-content">
              <div className="synonym-item-trans">{syn.trans}</div>
              <div className="synonym-item-words">
                {syn.words.map((word, idx) => <>{idx === 0 ? '' : '/ '}<div className="synonym-item-word" key={word}> {word}</div></>)}
              </div>
            </div>
          </div>)}
        </div>
      </div>
    </div>
  );
};

export default Dictionary
