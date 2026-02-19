import { useState } from 'react';
import { post } from '../api';

export default function TimeConverter() {
    const [hexTime, setHexTime] = useState('');
    const [format, setFormat] = useState('CUC7');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleConvert = async () => {
        try {
            setError('');
            setResult(null);
            const res = await post('/time/convert', {
                hex_time: hexTime,
                format: format
            });
            setResult(res);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="card">
            <div className="title">CCSDS Time Converter</div>

            <div className="grid">
                {/* Format Selection */}
                <div>
                    <label>Time Format</label>
                    <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        style={{ width: '100%' }}
                    >
                        <option value="CUC7">CUC Unsegmented (7 Bytes)</option>
                        <option value="CDS8">CDS Day Segmented (8 Bytes)</option>
                    </select>
                </div>

                {/* Hex Input */}
                <div>
                    <label>Hex Time Code</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={hexTime}
                            onChange={(e) => setHexTime(e.target.value)}
                            placeholder={format === 'CUC7' ? "e.g., 5B3F1234F0C855" : "e.g., 5B3F1234CAFEBABE"}
                            style={{ flex: 1 }}
                        />
                        <button className="btn" onClick={handleConvert}>Convert</button>
                    </div>
                </div>

                {/* Results */}
                {result && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--accent-color)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                            {result.iso}
                        </div>

                        <div className="grid grid-cols-2" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            <div>Type:</div>
                            <div style={{ fontFamily: 'monospace' }}>{result.type}</div>

                            <div>Epoch:</div>
                            <div>{result.epoch}</div>

                            {result.days !== undefined && (
                                <>
                                    <div>Days:</div>
                                    <div style={{ fontFamily: 'monospace' }}>{result.days}</div>
                                </>
                            )}

                            {result.milliseconds !== undefined && (
                                <>
                                    <div>Milliseconds:</div>
                                    <div style={{ fontFamily: 'monospace' }}>{result.milliseconds}</div>
                                </>
                            )}

                            {result.seconds !== undefined && (
                                <>
                                    <div>Seconds:</div>
                                    <div style={{ fontFamily: 'monospace' }}>{result.seconds}</div>
                                </>
                            )}

                            {result.microseconds !== undefined && (
                                <>
                                    <div>Microseconds:</div>
                                    <div style={{ fontFamily: 'monospace' }}>{result.microseconds}</div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Time Code Formats (Epoch: 1958-01-01)</div>

                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.7rem', marginBottom: '0.25rem', opacity: 0.8 }}>CUC Unsegmented (7 Bytes)</div>
                        <div style={{ display: 'flex', height: '30px', borderRadius: '4px', overflow: 'hidden', textAlign: 'center', fontSize: '0.7rem', lineHeight: '30px', fontWeight: 'bold' }}>
                            <div style={{ width: '57%', background: '#3b82f6', color: 'white' }} title="Seconds (4 bytes)">Seconds (4B)</div>
                            <div style={{ width: '43%', background: '#10b981', color: 'white' }} title="Fractional Seconds (3 bytes)">Fractional (3B)</div>
                        </div>
                        <div style={{ fontSize: '0.65rem', marginTop: '0.25rem', opacity: 0.6, textAlign: 'right' }}>Resolution: 2^-24 (~60ns)</div>
                    </div>

                    <div>
                        <div style={{ fontSize: '0.7rem', marginBottom: '0.25rem', opacity: 0.8 }}>CDS Day Segmented (8 Bytes)</div>
                        <div style={{ display: 'flex', height: '30px', borderRadius: '4px', overflow: 'hidden', textAlign: 'center', fontSize: '0.7rem', lineHeight: '30px', fontWeight: 'bold' }}>
                            <div style={{ width: '25%', background: '#eab308', color: 'black' }} title="Days since Epoch (2 bytes)">Days (2B)</div>
                            <div style={{ width: '50%', background: '#3b82f6', color: 'white' }} title="Milliseconds of Day (4 bytes)">Millis (4B)</div>
                            <div style={{ width: '25%', background: '#10b981', color: 'white' }} title="Microseconds (2 bytes)">Micros (2B)</div>
                        </div>
                    </div>
                </div>

                {error && <div style={{ color: '#ef4444', marginTop: '0.5rem' }}>{error}</div>}
            </div>
        </div>
    );
}
