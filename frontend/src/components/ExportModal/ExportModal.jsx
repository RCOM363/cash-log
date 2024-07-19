import React from 'react'
import "./ExportModal.css"

function ExportModal({isOpen,onClose,onExport,type}) {
  return (
   isOpen && (
    <div className='modal'>
        <div className="modal-content">
            <div className="cont1">
                <span onClick={onClose}>&times;</span>
            </div>
            <h2>choose an option</h2>
            <div className="options">
                <button onClick={() => onExport('all')}>Export All {type}</button>
                <button onClick={() => onExport('currentMonth')}>Export Current Month {type}</button>
            </div>
        </div>
    </div>
   )
  )
}

export default ExportModal
