import { useState } from 'react';
import { post } from '../api';

export default function CANTool() {
    const [hexId, setHexId] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        try {
            setError('');
            setResult(null);
            const res = await post('/can/analyze', { hex_id: hexId });
            setResult(res);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="card">
            <div className="title">CAN Identifier Analyzer</div>
            <div className="grid">
                <div>
                    <label>Identifier (Hex)</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={hexId}
                            onChange={(e) => setHexId(e.target.value)}
                            placeholder="e.g., 0x18F00400"
                            style={{ flex: 1 }}
                        />
                        <button className="btn" onClick={handleAnalyze}>Analyze</button>
                    </div>
                </div>

                {result && (
                    <div style={{ marginTop: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>{result.id_type}</div>

                            <div className="grid grid-cols-2" style={{ fontSize: '0.9rem' }}>
                                <div>Binary:</div>
                                <div style={{ fontFamily: 'monospace' }}>{result.binary_str}</div>

                                {result.base_id && (
                                    <>
                                        <div>Base ID (11-bit):</div>
                                        <div style={{ fontFamily: 'monospace' }}>{result.base_id}</div>
                                    </>
                                )}

                                {result.extended_id && (
                                    <>
                                        <div>Extended ID (18-bit):</div>
                                        <div style={{ fontFamily: 'monospace' }}>{result.extended_id}</div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                            <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>CAN Identifier Formats</div>
                            <div style={{ marginBottom: '0.75rem' }}>
                                <div style={{ fontSize: '0.7rem', marginBottom: '0.25rem', opacity: 0.8 }}>Standard Frame (11-bit Identifier)</div>
                                <div style={{ display: 'flex', height: '20px', borderRadius: '4px', overflow: 'hidden', textAlign: 'center', fontSize: '0.65rem', lineHeight: '20px', fontWeight: 'bold' }}>
                                    <div style={{ width: '30%', background: '#3b82f6', color: 'white' }}>Base ID (11)</div>
                                    <div style={{ width: '10%', background: '#9ca3af', color: 'white' }}>RTR</div>
                                    <div style={{ width: '10%', background: '#9ca3af', color: 'white' }}>IDE</div>
                                    <div style={{ width: '10%', background: '#9ca3af', color: 'white' }}>r0</div>
                                    <div style={{ width: '15%', background: '#9ca3af', color: 'white' }}>DLC</div>
                                    <div style={{ width: '25%', background: '#6b7280', color: 'white' }}>Data Field</div>
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.7rem', marginBottom: '0.25rem', opacity: 0.8 }}>Extended Frame (29-bit Identifier)</div>
                                <div style={{ display: 'flex', height: '20px', borderRadius: '4px', overflow: 'hidden', textAlign: 'center', fontSize: '0.65rem', lineHeight: '20px', fontWeight: 'bold' }}>
                                    <div style={{ width: '20%', background: '#3b82f6', color: 'white' }}>Base (11)</div>
                                    <div style={{ width: '5%', background: '#9ca3af', color: 'white' }}>SRR</div>
                                    <div style={{ width: '5%', background: '#9ca3af', color: 'white' }}>IDE</div>
                                    <div style={{ width: '35%', background: '#10b981', color: 'white' }}>Extended ID (18)</div>
                                    <div style={{ width: '5%', background: '#9ca3af', color: 'white' }}>RTR</div>
                                    <div style={{ width: '30%', background: '#9ca3af', color: 'white' }}>...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && <div style={{ color: '#ef4444', marginTop: '0.5rem' }}>{error}</div>}
            </div>
        </div>
    );
}
