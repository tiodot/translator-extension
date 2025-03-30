const globalPanelInfo = { windowId: 0, tabId: 0 }
chrome.action.onClicked.addListener((tab) => {
    console.log("clicked", tab)
    chrome.sidePanel.getPanelBehavior((behavior) => {
        console.log("behavior", behavior, globalPanelInfo)
        if (!behavior.openPanelOnActionClick) {
            if (globalPanelInfo.windowId) {
                chrome.windows.update(globalPanelInfo.windowId, { focused: true })
            } else {
                chrome.windows.create({
                    url: 'tabs/dict.html',
                    top: 140,
                    left: 1e3,
                    width: 385,
                    height: 689,
                    type: "panel"
                }).then((window) => {
                    console.log("create window", window)
                    globalPanelInfo.windowId = window.id
                    globalPanelInfo.tabId = window.tabs[0].id
                })

                chrome.tabs.onRemoved.addListener((tabId) => {
                    if (tabId === globalPanelInfo.tabId) {
                        globalPanelInfo.windowId = 0
                        globalPanelInfo.tabId = 0
                    }
                })
            }
        }
    })
});

function detactLanguage(word: string) {
    return fetch("https://translate.volcengine.com/web/langdetect/v1/", {
        "headers": {
            "content-type": "application/json",
        },
        body: JSON.stringify({ text: word }),
        method: 'POST'
    }).then(res => res.json()).then(data => data.language);
}

// get the dictionary data
async function getDictionaryData(word: string): Promise<string> {
    // TODO: get the dictionary data
    const language = await detactLanguage(word)
    console.log(language, 'language')
    const targetLanguage = language === 'en' ? 'zh' : 'en'
    return fetch("https://translate.volcengine.com/crx/dict/detail/v1/", {
        "headers": {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            source: "youdao",
            source_language: language,
            target_language: targetLanguage,
            words: [word]
        }),
        "method": "POST",
    })
    .then(res => res.json())
    .then(data => data.details[0]?.detail);
}

async function translate(word: string) {
    const language = await detactLanguage(word)
    const targetLanguage = language === 'en' ? 'zh' : 'en'
    fetch("https://translate.volcengine.com/crx/translate/v1/", {
        "headers": {
          "content-type": "application/json",
        },
        "method": "POST",
        body: JSON.stringify({
            text: word,
            target_language: targetLanguage,
            source_language: language,
            enable_user_glossary: false,
            glossary_list: [],
            category: ''
        })
    }).then(res => res.json()).then(data => data.translation);
}
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log(message, 'message')
    if (message.type === 'SHOW_POPUP') {
        const data = await getDictionaryData(message.data.word)
        console.log(data, 'data')
        if (data) {
            chrome.tabs.sendMessage(sender.tab.id, {
                type: 'SHOW_WORD_POPUP',
                data: {
                    ...message.data,
                    response: JSON.parse(data)
                }
            })
        } else {
            const translation = await translate(message.data.word)
            chrome.tabs.sendMessage(sender.tab.id, {
                type: 'SHOW_TRANSLATION_POPUP',
                data: {
                    ...message.data,
                    translation
                }
            })
        }
    }
    if (message.type === 'CLOSE_POPUP') {
        chrome.tabs.sendMessage(sender.tab.id, {
            type: 'CLOSE_POPUP'
        })
    }
})