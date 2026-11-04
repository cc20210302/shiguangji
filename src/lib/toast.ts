// src/lib/toast.ts

export function showToast(message: string) {
  // 如果已有 Toast，先移除
  const existingToast = document.getElementById('custom-toast')
  if (existingToast) {
    existingToast.remove()
  }

  // 创建 Toast DOM
  const toast = document.createElement('div')
  toast.id = 'custom-toast'
  toast.innerText = message
  
  // 设置样式 (确保它居中悬浮在最上层)
  Object.assign(toast.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    zIndex: '9999',
    pointerEvents: 'none', // 不阻挡用户点击
    transition: 'opacity 0.3s ease',
    opacity: '0',
  })

  document.body.appendChild(toast)

  // 触发动画 (等待一帧后变成不透明)
  requestAnimationFrame(() => {
    toast.style.opacity = '1'
  })

  // 2 秒后淡出并移除
  setTimeout(() => {
    toast.style.opacity = '0'
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 300) // 等待淡出动画结束
  }, 2000)
}