import { useState } from 'react';
import { post } from '../api';

export default function GenericDecommutator() {
    const [hexStream, setHexStream] = useState('');
    const [schema, setSchema] = useState([]);
    const [fieldName, setFieldName] = useState('');
    const [fieldSize, setFieldSize] = useState(8); // Default 8 bits
    const [fieldType, setFieldType] = useState('ID');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const handleAddField = () => {
        if (!fieldName) {
            setError("Field name is required");
            return;
        }
        const newField = {
            name: fieldName,
            size: fieldType === 'F3' ? 32 : parseInt(fieldSize), // F3 fixed at 32 bits
            type: fieldType
        };
        setSchema([...schema, newField]);
        setFieldName('');
        setFieldSize(8);
        setError('');
    };

    const handleRemoveField = (index) => {
        const newSchema = schema.filter((_, i) => i !== index);
        setSchema(newSchema);
        setResults(null); // Clear results on schema change
    };

    const handleReset = () => {
        setSchema([]);
        setResults(null);
        setError('');
        setFieldName('');
        setFieldSize(8);
        // Optional: clear hexStream too? User might want to keep it. 
        // "supprime les resultats" -> I'll keep the stream.
    };

    const handleDecommutate = async () => {
        try {
            setError('');
            setResults(null);
            const res = await post('/generic/decommutate', {
                hex_stream: hexStream,
                schema_list: schema
            });
            setResults(res.results);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="card">
            <div className="title">Generic Decommutator (Bit-Level)</div>

            <div className="grid">
                {/* Hex Input */}
                <div>
                    <label>Hex Stream Payload</label>
                    <input
                        type="text"
                        value={hexStream}
                        onChange={(e) => setHexStream(e.target.value)}
                        placeholder="e.g., 0A0B0C0D3F800000"
                        style={{ width: '100%' }}
                    />
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', margin: '1rem 0' }}></div>

                {/* Schema Definition */}
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Define Schema</div>

                    <div className="grid grid-cols-2" style={{ gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'end' }}>
                        <div>
                            <label>Name</label>
                            <input
                                type="text"
                                value={fieldName}
                                onChange={(e) => setFieldName(e.target.value)}
                                placeholder="Field Name"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label>Type</label>
                            <select
                                value={fieldType}
                                onChange={(e) => setFieldType(e.target.value)}
                                style={{ width: '100%' }}
                            >
                                <option value="ID">ID (Int)</option>
                                <option value="F3">F3 (Float32)</option>
                            </select>
                        </div>
                        <div>
                            <label>Size (Bits)</label>
                            <input
                                type="number"
                                min="1"
                                value={fieldType === 'F3' ? 32 : fieldSize}
                                onChange={(e) => setFieldSize(e.target.value)}
                                disabled={fieldType === 'F3'}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <button className="btn" onClick={handleAddField}>Add</button>
                    </div>
                </div>

                {/* Schema List */}
                {schema.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', padding: '0.5rem' }}>
                        {schema.map((field, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <span>
                                    <span style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>{field.name}</span>
                                    <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                                        ({field.type}, {field.size} bits)
                                    </span>
                                </span>
                                <button
                                    onClick={() => handleRemoveField(index)}
                                    style={{ background: 'none', border: 'none', color: '#ef4444', padding: '0 0.5rem' }}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button className="btn" onClick={handleDecommutate} disabled={schema.length === 0} style={{ flex: 1 }}>
                        Decommutate
                    </button>
                    <button
                        className="btn"
                        onClick={handleReset}
                        style={{ backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }}
                    >
                        Reset
                    </button>
                </div>

                {/* Results */}
                {results && (
                    <div style={{ marginTop: '1rem' }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Results</div>
                        <div className="grid">
                            {results.map((item, index) => (
                                <div key={index} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                    <div style={{ fontFamily: 'monospace', color: 'var(--accent-color)' }}>{item.value}</div>
                                    <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {item.size_bits} bits
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {error && <div style={{ color: '#ef4444', marginTop: '0.5rem' }}>{error}</div>}
            </div>
        </div>
    );
}
