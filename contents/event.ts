

// 监听选中文本事件
document.addEventListener('mouseup', (e) => {
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();

  console.log(selectedText, 'selectedText')

  if (!selectedText) {
    // 如果点击在弹窗外部，关闭弹窗
    chrome.runtime.sendMessage({
      type: 'CLOSE_POPUP'
    })
    return;
  }

  // 如果有选中文本，显示弹窗
  //   showPopup(e.pageX, e.pageY, selectedText);
  chrome.runtime.sendMessage({
    type: 'SHOW_POPUP',
    data: {
        x: e.pageX,
        y: e.pageY,
        word: selectedText
    }
  })
});

export default {}