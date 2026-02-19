import { useState } from 'react';
import { post } from '../api';

export default function TimeConverter() {
    const [mode, setMode] = useState('decode'); // 'decode', 'encode', 'convert'
    const [hexTime, setHexTime] = useState('');
    const [isoTime, setIsoTime] = useState('');
    const [format, setFormat] = useState('CUC7'); // For decode/encode/convert source
    const [targetFormat, setTargetFormat] = useState('CDS8'); // For convert target
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleAction = async () => {
        try {
            setError('');
            setResult(null);
            let res;

            if (mode === 'decode') {
                res = await post('/time/convert', {
                    hex_time: hexTime,
                    format: format
                });
            } else if (mode === 'encode') {
                if (!isoTime) throw new Error("Please select a date and time");
                res = await post('/time/encode', {
                    iso_time: new Date(isoTime).toISOString(),
                    format: format
                });
            } else if (mode === 'convert') {
                res = await post('/time/cross_convert', {
                    hex_time: hexTime,
                    from_format: format,
                    to_format: targetFormat
                });
            }

            setResult(res);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="card">
            <div className="title">CCSDS Time Converter</div>

            <div className="grid">
                {/* Mode Selection */}
                <div style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                    <label>Operation Mode</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className={`btn ${mode === 'decode' ? '' : 'secondary'}`}
                            onClick={() => { setMode('decode'); setResult(null); setError(''); }}
                            style={{ flex: 1, opacity: mode === 'decode' ? 1 : 0.7 }}
                        >
                            Decode (Hex &rarr; Time)
                        </button>
                        <button
                            className={`btn ${mode === 'encode' ? '' : 'secondary'}`}
                            onClick={() => { setMode('encode'); setResult(null); setError(''); }}
                            style={{ flex: 1, opacity: mode === 'encode' ? 1 : 0.7 }}
                        >
                            Encode (Time &rarr; Hex)
                        </button>
                        <button
                            className={`btn ${mode === 'convert' ? '' : 'secondary'}`}
                            onClick={() => { setMode('convert'); setResult(null); setError(''); }}
                            style={{ flex: 1, opacity: mode === 'convert' ? 1 : 0.7 }}
                        >
                            Convert (Hex &rarr; Hex)
                        </button>
                    </div>
                </div>

                {/* Inputs based on Mode */}
                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                    {mode !== 'convert' && (
                        <div>
                            <label>Format</label>
                            <select
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                style={{ width: '100%' }}
                            >
                                <option value="CUC7">CUC Unsegmented (7 Bytes)</option>
                                <option value="CDS8">CDS Day Segmented (8 Bytes)</option>
                            </select>
                        </div>
                    )}

                    {mode === 'convert' && (
                        <>
                            <div>
                                <label>From Format</label>
                                <select
                                    value={format}
                                    onChange={(e) => {
                                        setFormat(e.target.value);
                                        setTargetFormat(e.target.value === 'CUC7' ? 'CDS8' : 'CUC7');
                                    }}
                                    style={{ width: '100%' }}
                                >
                                    <option value="CUC7">CUC Unsegmented (7 Bytes)</option>
                                    <option value="CDS8">CDS Day Segmented (8 Bytes)</option>
                                </select>
                            </div>
                            <div>
                                <label>To Format</label>
                                <input
                                    type="text"
                                    value={format === 'CUC7' ? 'CDS Day Segmented (8 Bytes)' : 'CUC Unsegmented (7 Bytes)'}
                                    disabled
                                    style={{ width: '100%', opacity: 0.7 }}
                                />
                            </div>
                        </>
                    )}

                    {mode !== 'encode' ? (
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label>Hex Time Code</label>
                            <input
                                type="text"
                                value={hexTime}
                                onChange={(e) => setHexTime(e.target.value)}
                                placeholder={format === 'CUC7' ? "e.g., 5B3F1234F0C855" : "e.g., 5B3F1234CAFEBABE"}
                                style={{ width: '100%' }}
                            />
                        </div>
                    ) : (
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label>Date & Time (Local)</label>
                            <input
                                type="datetime-local"
                                value={isoTime}
                                onChange={(e) => setIsoTime(e.target.value)}
                                step="0.001"
                                style={{ width: '100%' }}
                            />
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '1rem' }}>
                    <button className="btn" onClick={handleAction} style={{ width: '100%' }}>
                        {mode === 'decode' ? 'Decode Time' : mode === 'encode' ? 'Encode to Hex' : 'Convert Format'}
                    </button>
                </div>

                {/* Results */}
                {result && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                        {mode === 'decode' && (
                            <>
                                <div style={{ fontWeight: 'bold', color: 'var(--accent-color)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                    {result.iso}
                                </div>
                                <div className="grid grid-cols-2" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    <div>Type: <span style={{ fontFamily: 'monospace', color: 'white' }}>{result.type}</span></div>
                                    <div>Epoch: <span style={{ color: 'white' }}>{result.epoch}</span></div>
                                    {result.days !== undefined && <div>Days: <span style={{ fontFamily: 'monospace', color: 'white' }}>{result.days}</span></div>}
                                    {result.seconds !== undefined && <div>Seconds: <span style={{ fontFamily: 'monospace', color: 'white' }}>{result.seconds}</span></div>}
                                    {result.milliseconds !== undefined && <div>Millis: <span style={{ fontFamily: 'monospace', color: 'white' }}>{result.milliseconds}</span></div>}
                                    {result.microseconds !== undefined && <div>Micros: <span style={{ fontFamily: 'monospace', color: 'white' }}>{result.microseconds}</span></div>}
                                </div>
                            </>
                        )}

                        {(mode === 'encode' || mode === 'convert') && (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    Resulting Hex ({mode === 'encode' ? format : targetFormat})
                                </div>
                                <div style={{ fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)', wordBreak: 'break-all' }}>
                                    {result.hex}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Note: Epoch is 1958-01-01 (TAI)</div>
                </div>

                {error && <div style={{ color: '#ef4444', marginTop: '0.5rem' }}>{error}</div>}
            </div>
        </div>
    );
}
