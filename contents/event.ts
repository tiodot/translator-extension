import { Storage } from "@plasmohq/storage"

const storage = new Storage()
let previousSelection: string | null = null
let selectionData = {
  x: 0,
  y: 0,
  word: ""
}
let shortcutKey: string = ""
storage.get("translationShortcut").then((key) => (shortcutKey = key))

// 监听选中文本事件
document.body.addEventListener("keydown", async (e) => {
  if (!shortcutKey) {
    return
  }
  const shortcut = {
    key: e.key.length === 1 ? e.key.toUpperCase() : e.key,
    ctrl: e.ctrlKey,
    shift: e.shiftKey,
    alt: e.altKey
  }
  if (shortcut.key) {
    const parts = []
    if (shortcut.ctrl) parts.push("Ctrl")
    if (shortcut.shift) parts.push("Shift")
    if (shortcut.alt) parts.push("Alt")
    parts.push(shortcut.key)
    if (parts.join("+") === shortcutKey && selectionData.word) {
      chrome.runtime.sendMessage({
        type: "FETCH_DATA",
        data: selectionData
      })
    }
  }
})

document.body.addEventListener("mouseup", async (e) => {
  const selection = window.getSelection()
  selectionData = { x: 0, y: 0, word: "" }

  if (selection.rangeCount === 0) {
    // console.log("没有选中任何内容");
    return
  }

  const selectedText = selection?.toString().trim()

  // console.log(selectedText, 'selectedText')

  if (previousSelection === selectedText) {
    return
  }

  previousSelection = selectedText

  if (!selectedText) {
    // 如果点击在弹窗外部，关闭弹窗
    document.dispatchEvent(new CustomEvent("HIDE_ALL"))
    return
  }

  // 获取第一个选区范围
  const range = selection.getRangeAt(0)

  // 获取选区的所有矩形区域
  const rects = range.getClientRects()
  if (rects.length === 0) {
    console.log("无法获取选区坐标")
    return
  }

  // 第一个矩形（选区起点）的坐标
  const firstRect = rects[0]
  let startLeft = firstRect.right
  const startTop = firstRect.bottom

  // console.log('position:', e.pageX, e.pageY, startLeft, startTop)

  if (startLeft + 600 > window.innerWidth) {
    startLeft = window.innerWidth - 600
  }
  selectionData = {
    x: startLeft,
    y: startTop + window.scrollY,
    word: selectedText
  }

  if (shortcutKey) {
    return ""
  }

  document.dispatchEvent(
    new CustomEvent("SHOW_ICON", {
      detail: selectionData
    })
  )
})

export default {}
