import { useState, useEffect, useRef } from 'react';
import '../styles/Overlays.css';

export default function MiniTerminal() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputVal, setInputVal] = useState('');
    const [history, setHistory] = useState([{ type: 'output', text: 'SYSTEM_READY. TYPE "HELP"' }]);
    const inputRef = useRef(null);
    const outputRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [history]);

    const executeCommand = (cmd) => {
        const cleanCmd = cmd.toLowerCase().trim();
        if (!cleanCmd) return;

        const newHistory = [...history, { type: 'cmd', text: `> ${cleanCmd}` }];

        let responseText = '';
        switch (cleanCmd) {
            case 'help': responseText = 'AVAILABLE: PROJECTS, ABOUT, SKILLS, CONTACT, CV, CLEAR'; break;
            case 'projects':
                window.location.href = '#projects';
                responseText = 'DISPLAYING PROJECT LOGS...';
                setIsOpen(false);
                break;
            case 'about':
                window.location.href = '#about';
                responseText = 'LEANDRO GRANEROS: IT SPECIALIST & WEB DEVELOPER.';
                setIsOpen(false);
                break;
            case 'skills':
                window.location.href = '#skills';
                responseText = 'CORE_STACK: JS, C, SQL, PYTHON, VBA, PS, UI/UX...';
                setIsOpen(false);
                break;
            case 'contact':
                window.location.href = '#contact';
                responseText = 'ESTABLISHING CONNECTION...';
                setIsOpen(false);
                break;
            case 'cv':
                responseText = 'LINKING TO SECURE_CV_V2.025...';
                window.open('/cv.pdf', '_blank');
                break;
            case 'clear':
                setHistory([]);
                return;
            default: responseText = `COMMAND NOT FOUND: ${cleanCmd}. TYPE 'HELP'`;
        }

        if (responseText) {
            newHistory.push({ type: 'output', text: responseText });
        }
        setHistory(newHistory);
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            executeCommand(inputVal);
            setInputVal('');
        }
    };

    // We reuse the CSS class 'terminal-hidden' to toggle visibility logic if needed, 
    // or just inline styles. script.js toggled a class.
    // The CSS for #mini-terminal involves fixed positioning.
    // We'll use the id="mini-terminal" and manipulate class.

    return (
        <div id="mini-terminal" className={!isOpen ? 'terminal-hidden' : ''}>
            <div className="terminal-header">
                <span>TERMINAL_V.1.0</span>
                <span>CTRL+K TO TOGGLE</span>
            </div>
            <div className="terminal-output" id="mini-terminal-output" ref={outputRef}>
                {history.map((line, idx) => (
                    <div key={idx} className={line.type === 'cmd' ? 'line cmd' : 'line'}>
                        {line.text}
                    </div>
                ))}
            </div>
            <div className="terminal-input-area">
                <span className="prompt">{'>'}</span>
                <input
                    type="text"
                    id="terminal-input"
                    ref={inputRef}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    autoComplete="off"
                />
            </div>
        </div>
    );
}
