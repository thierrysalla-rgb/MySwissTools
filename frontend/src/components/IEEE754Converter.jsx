import { useState } from 'react';
import { post } from '../api';

export default function IEEE754Converter() {
    const [floatVal, setFloatVal] = useState('');
    const [hexVal, setHexVal] = useState('');
    const [error, setError] = useState('');

    const handleToHex = async () => {
        try {
            setError('');
            const res = await post('/ieee754/to_hex', { value: parseFloat(floatVal) });
            setHexVal(res.hex);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToFloat = async () => {
        try {
            setError('');
            const res = await post('/ieee754/to_float', { value: hexVal });
            setFloatVal(res.float);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="card">
            <div className="title">IEEE 754 Converter</div>
            <div className="grid">
                <div>
                    <label>Decimal (Float)</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="number"
                            step="any"
                            value={floatVal}
                            onChange={(e) => setFloatVal(e.target.value)}
                            placeholder="1.0"
                            style={{ flex: 1 }}
                        />
                        <button className="btn" onClick={handleToHex}>To Hex &rarr;</button>
                    </div>
                </div>

                <div>
                    <label>Hexadecimal (32-bit)</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={hexVal}
                            onChange={(e) => setHexVal(e.target.value)}
                            placeholder="0x3F800000"
                            style={{ flex: 1 }}
                        />
                        <button className="btn" onClick={handleToFloat}>&larr; To Float</button>
                    </div>
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>IEEE 754 Single Precision (32-bit)</div>
                    <div style={{ display: 'flex', height: '30px', borderRadius: '4px', overflow: 'hidden', textAlign: 'center', fontSize: '0.7rem', lineHeight: '30px', fontWeight: 'bold' }}>
                        <div style={{ width: '3.125%', background: '#ef4444', color: 'white' }} title="Sign (1 bit)">S</div>
                        <div style={{ width: '25%', background: '#3b82f6', color: 'white' }} title="Exponent (8 bits)">Exponent (8)</div>
                        <div style={{ width: '71.875%', background: '#10b981', color: 'white' }} title="Mantissa (23 bits)">Mantissa (23)</div>
                    </div>
                </div>

                {error && <div style={{ color: '#ef4444', marginTop: '0.5rem' }}>{error}</div>}
            </div>
        </div>
    );
}
