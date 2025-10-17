import React, { useEffect, useState } from 'react';
import { useStorage } from "@plasmohq/storage/hook"

const Options: React.FC = () => {
    const [openIn, setOpenIn] = useStorage('openIn', (v) => v || 'popup');
    const [shortcut, setShortcut] = useState({ key: '', ctrl: false, shift: false, alt: false });
    const [isRecording, setIsRecording] = useState(false);
    const [recordedShortcut, setRecordedShortcut] = useStorage('translationShortcut', (v) => v || '');

    useEffect(() => {
        // Parse the stored shortcut
        const parseShortcut = (shortcutString: string) => {
            const parts = shortcutString.split('+');
            const modifiers = {
                ctrl: parts.includes('Ctrl'),
                shift: parts.includes('Shift'),
                alt: parts.includes('Alt')
            };
            const key = parts.find(part => !['Ctrl', 'Shift', 'Alt'].includes(part)) || '';
            return { ...modifiers, key };
        };
        
        setShortcut(parseShortcut(recordedShortcut));
    }, [recordedShortcut]);

    const handleOpenInChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setOpenIn(event.target.value);
        chrome.sidePanel.setPanelBehavior({
            openPanelOnActionClick: "sidepanel" === event.target.value
        })
    };

    const startRecording = () => {
        setIsRecording(true);
        // setShortcut({ key: '', ctrl: false, shift: false, alt: false });
    };

    const stopRecording = () => {
        setIsRecording(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isRecording) return;

        if (e.key === 'Delete' || e.key === 'Backspace') {
            setShortcut({key: '', ctrl: false, alt: false, shift: false});
            setRecordedShortcut('');
            stopRecording();
            return
        }
        
        e.preventDefault();
        
        const newShortcut = {
            key: e.key.length === 1 ? e.key.toUpperCase() : e.key,
            ctrl: e.ctrlKey,
            shift: e.shiftKey,
            alt: e.altKey
        };
        
        // Don't allow just modifier keys alone
        if (['Control', 'Shift', 'Alt'].includes(newShortcut.key)) {
            return;
        }
        
        setShortcut(newShortcut);
        if (newShortcut.key) {
            const parts = [];
            if (newShortcut.ctrl) parts.push('Ctrl');
            if (newShortcut.shift) parts.push('Shift');
            if (newShortcut.alt) parts.push('Alt');
            parts.push(newShortcut.key);
            setRecordedShortcut(parts.join('+'));
            console.log('Recorded shortcut:', parts.join('+'));
            stopRecording();
        }
        
    };

    const formatShortcut = () => {
        if (!shortcut.key) return recordedShortcut;
        
        const parts = [];
        if (shortcut.ctrl) parts.push('Ctrl');
        if (shortcut.shift) parts.push('Shift');
        if (shortcut.alt) parts.push('Alt');
        if (shortcut.key) parts.push(shortcut.key);
        
        return parts.join('+');
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

            <div style={{ marginBottom: '20px' }}>
                <label
                    style={{ display: 'block', marginBottom: '10px', fontSize: '16px' }}
                >
                    Translation Shortcut:
                </label>
                <div 
                    onClick={isRecording ? stopRecording : startRecording}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    style={{
                        padding: '10px',
                        border: '2px dashed #ccc',
                        borderRadius: '4px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: isRecording ? '#e6f7ff' : '#f9f9f9',
                        outline: 'none'
                    }}
                >
                    {isRecording ? (
                        <span>Press desired key combination...</span>
                    ) : (
                        <span>{formatShortcut() || 'Click to set shortcut'}</span>
                    )}
                </div>
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                    Current shortcut: {formatShortcut() || 'None set'}
                </div>
            </div>
        </div>
    );
};

export default Options;
