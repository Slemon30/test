// Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, onSubmit, newIssue, handleNewIssueChange }) => {
    return (
        isOpen && (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={onClose}>&times;</span>
                    <h2>Add New Issue</h2>
                    <input
                        type="text"
                        placeholder="Enter Headline"
                        value={newIssue}
                        onChange={handleNewIssueChange}
                        className="issue-headline"
                    />

                    <div>Acting Authority</div>
                    <select>
                        <option>CBI</option>
                        <option>FBI</option>
                        <option>ABI</option>
                        <option>IGI</option>
                    </select>

                    <br></br>

                    <input
                        type="text"
                        placeholder="Enter Description"
                        value={newIssue}
                        onChange={handleNewIssueChange}
                        className="issue-dexcription"
                    />
                    <br></br>

                    <button onClick={onSubmit} className="issue-submit">Submit</button>
                </div>
            </div>
        )
    );
};

export default Modal;
