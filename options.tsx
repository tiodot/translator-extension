import React, { useEffect, useState } from 'react';
import { useStorage } from "@plasmohq/storage/hook"

const Options: React.FC = () => {
    const [openIn, setOpenIn] = useStorage('openIn', (v) => v || 'popup');

    const handleOpenInChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setOpenIn(event.target.value);
        // Save to chrome.storage if needed
        chrome.sidePanel.setPanelBehavior({
            openPanelOnActionClick: "sidepanel" === event.target.value
        })
        setOpenIn(event.target.value)
    };

    return (
        <div className="container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Extension Options</h1>

            <div style={{ marginBottom: '20px' }}>
                <label
                    htmlFor="openInSelect"
                    style={{ display: 'block', marginBottom: '10px', fontSize: '16px' }}
                >
                    Open in:
                </label>
                <select
                    id="openInSelect"
                    value={openIn}
                    onChange={handleOpenInChange}
                    style={{
                        width: '100%',
                        padding: '8px',
                        fontSize: '16px',
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                    }}
                >
                    <option value="popup">Popup window</option>
                    <option value="sidepanel">Side pane</option>
                </select>
            </div>
        </div>
    );
};

export default Options