import { useState } from 'react';
import { post } from '../api';

export default function SpaceWireTool() {
    const [address, setAddress] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        try {
            setError('');
            setResult(null);
            const res = await post('/spw/analyze', { address: parseInt(address) });
            setResult(res);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="card">
            <div className="title">SpaceWire Address Helper</div>
            <div className="grid">
                <div>
                    <label>Address (Decimal 0-255)</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="number"
                            min="0" max="255"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="e.g., 32"
                            style={{ flex: 1 }}
                        />
                        <button className="btn" onClick={handleAnalyze}>Analyze</button>
                    </div>
                </div>

                {result && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>{result.type}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Hex: {result.hex_value}</div>
                        <div style={{ marginTop: '0.5rem' }}>{result.description}</div>
                    </div>
                )}

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>SpaceWire Addressing</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Path Address</div>
                            <div style={{ fontSize: '0.7rem' }}>0 - 31</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Physical link routing</div>
                        </div>
                        <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Logical Address</div>
                            <div style={{ fontSize: '0.7rem' }}>32 - 255</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Destination node ID</div>
                        </div>
                    </div>
                </div>

                {error && <div style={{ color: '#ef4444', marginTop: '0.5rem' }}>{error}</div>}
            </div>
        </div>
    );
}
