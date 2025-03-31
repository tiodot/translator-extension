
let previousSelection: string | null = null;
// 监听选中文本事件
document.addEventListener('mouseup', (e) => {
  const selection = window.getSelection();

  if (selection.rangeCount === 0) {
    console.log("没有选中任何内容");
    return;
  }

  const selectedText = selection?.toString().trim();


  console.log(selectedText, 'selectedText')

  if (previousSelection === selectedText) {
    return
  }

  previousSelection = selectedText;

  if (!selectedText) {
    // 如果点击在弹窗外部，关闭弹窗
    document.dispatchEvent(new CustomEvent('HIDE_ALL'))
    return;
  }

  // 获取第一个选区范围
  const range = selection.getRangeAt(0);

// 获取选区的所有矩形区域
  const rects = range.getClientRects();
  if (rects.length === 0) {
    console.log("无法获取选区坐标");
    return;
  }

// 第一个矩形（选区起点）的坐标
  const firstRect = rects[0];
  let startLeft = firstRect.right;
  const startTop = firstRect.bottom;

  console.log('position:', e.pageX, e.pageY, startLeft, startTop)

  if (startLeft + 600 > window.innerWidth) {
    startLeft = window.innerWidth - 600
  }

  document.dispatchEvent(new CustomEvent('SHOW_ICON', {
    detail: {
      x: startLeft,
      y: startTop + window.scrollY,
      word: selectedText
    }
  }))

  // 如果有选中文本，显示弹窗
  //   showPopup(e.pageX, e.pageY, selectedText);
  // chrome.runtime.sendMessage({
  //   type: 'SHOW_POPUP',
  //   data: {
  //       x: e.pageX,
  //       y: e.pageY,
  //       word: selectedText
  //   }
  // })
});

export default {}