import {useState} from 'react'
import "./ExportModal.css"

function ExportModal({isOpen,onClose,onExport,type}) {
    const [exportYear, setExportYear] = useState("");

    const handleExportYearChange = (e) => {
        setExportYear(e.target.value);
    };

  return (
   isOpen && (
    <div className='modal'>
        <div className="modal-content">
            <div className="cont1">
                <span onClick={onClose}>&times;</span>
            </div>
            <h2>choose an export option</h2>
            <div className="options">
                <div className="optioncont1">
                    <button onClick={() => onExport('currentMonth')}>Export Current Month {type}</button>
                </div>
                <div className="optioncont2">
                    <h3>Enter year</h3>
                    <input
                        type="text"
                        value={exportYear}
                        onChange={handleExportYearChange}
                    />
                    <button onClick={() => onExport('particularYear', exportYear)}>Export {exportYear} Expenses</button>
                </div>  
                <div className="optioncont1">
                    <button onClick={() => onExport('all')}>Export All {type}</button>
                </div>
            </div>
        </div>
    </div>
   )
  )
}

export default ExportModal
