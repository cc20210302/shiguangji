
// 🌟 假设你有一张类似灯泡的插图，如果没有，请替换成你 assets 里的图片路径
// import updateArt from '../assets/update-art.png' 

interface UpdateModalProps {
  isOpen: boolean
  version: string
  updateLog: string
  onUpdate: () => void
  onCancel: () => void
}

export function UpdateModal({ isOpen, version, updateLog, onUpdate, onCancel }: UpdateModalProps) {
  if (!isOpen) return null

  return (
    <div className="update-modal-overlay">
      <div className="update-modal">
        {/* 顶部标题和插图 */}
        <div className="update-modal__header">
          <div className="update-modal__title-wrap">
            <h2 className="update-modal__title">发现新版本</h2>
            <p className="update-modal__version">{version}</p>
          </div>
          {/* 🌟 如果你有对应的插图，把下面这个 div 换成 <img src={updateArt} ... /> */}
          <div className="update-modal__art">
            {/* 这里先用一个占位符，你可以换成你的手绘插图 */}
            <img src="/src/assets/update.png" alt="update" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
          </div>
        </div>

        {/* 更新内容 */}
        <div className="update-modal__body">
          <p className="update-modal__label">更新内容：</p>
          <div className="update-modal__log">
            {updateLog.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="update-modal__actions">
          <button type="button" className="btn btn--primary update-modal__btn-update" onClick={onUpdate}>
            立即更新
          </button>
          <button type="button" className="update-modal__btn-cancel" onClick={onCancel}>
            暂不更新
          </button>
        </div>
      </div>
    </div>
  )
}