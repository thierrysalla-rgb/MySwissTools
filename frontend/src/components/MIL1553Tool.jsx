import { useState } from 'react';
import { post } from '../api';

export default function MIL1553Tool() {
    const [hexWord, setHexWord] = useState('');
    const [rtAddress, setRtAddress] = useState(0);
    const [trBit, setTrBit] = useState(0);
    const [subaddress, setSubaddress] = useState(0);
    const [wordCount, setWordCount] = useState(0);
    const [error, setError] = useState('');

    const handleDecommutate = async () => {
        try {
            setError('');
            const res = await post('/mil1553/decommutate', { hex_word: hexWord });
            setRtAddress(res.remote_terminal_address);
            setTrBit(res.transmit_receive);
            setSubaddress(res.subaddress_mode);
            setWordCount(res.data_word_count_mode_code);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCommutate = async () => {
        try {
            setError('');
            const res = await post('/mil1553/commutate', {
                rt_address: parseInt(rtAddress),
                transmit_receive: parseInt(trBit),
                subaddress_mode: parseInt(subaddress),
                data_word_count_mode_code: parseInt(wordCount)
            });
            setHexWord(res.hex_word);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="card">
            <div className="title">MIL-STD-1553 Command Word</div>

            <div className="grid">
                <div>
                    <label>Command Word (Hex)</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={hexWord}
                            onChange={(e) => setHexWord(e.target.value)}
                            placeholder="0x0821"
                            style={{ flex: 1 }}
                        />
                        <button className="btn" onClick={handleDecommutate}>Decommutate</button>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', margin: '1rem 0' }}></div>

                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                    <div>
                        <label>RT Address (0-31)</label>
                        <input
                            type="number"
                            min="0" max="31"
                            value={rtAddress}
                            onChange={(e) => setRtAddress(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div>
                        <label>T/R Bit (0-1)</label>
                        <select
                            value={trBit}
                            onChange={(e) => setTrBit(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <option value="0">0 (Receive)</option>
                            <option value="1">1 (Transmit)</option>
                        </select>
                    </div>
                    <div>
                        <label>Subaddress (0-31)</label>
                        <input
                            type="number"
                            min="0" max="31"
                            value={subaddress}
                            onChange={(e) => setSubaddress(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div>
                        <label>Word Count (0-31)</label>
                        <input
                            type="number"
                            min="0" max="31"
                            value={wordCount}
                            onChange={(e) => setWordCount(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Command Word Structure (16 bits)</div>
                    <div style={{ display: 'flex', height: '30px', borderRadius: '4px', overflow: 'hidden', textAlign: 'center', fontSize: '0.7rem', lineHeight: '30px', fontWeight: 'bold' }}>
                        <div style={{ width: '31.25%', background: '#eab308', color: 'black' }} title="Remote Terminal Address (5 bits)">RT (5)</div>
                        <div style={{ width: '6.25%', background: '#ef4444', color: 'white' }} title="Transmit/Receive (1 bit)">T/R</div>
                        <div style={{ width: '31.25%', background: '#3b82f6', color: 'white' }} title="Subaddress (5 bits)">SA (5)</div>
                        <div style={{ width: '31.25%', background: '#10b981', color: 'white' }} title="Word Count / Mode Code (5 bits)">WC (5)</div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button className="btn" onClick={handleCommutate}>Commutate (Build Hex)</button>
                </div>

                {error && <div style={{ color: '#ef4444', marginTop: '0.5rem' }}>{error}</div>}
            </div>
        </div>
    );
}
