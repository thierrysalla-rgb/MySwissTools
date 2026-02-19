const API_BASE_URL = '/api';

export async function post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const contentType = response.headers.get('content-type');

    if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
            const error = await response.json();
            throw new Error(error.detail || 'API request failed');
        } else {
            const text = await response.text();
            console.error('Non-JSON Error Response:', text);
            throw new Error(`Server error (non-JSON). Status: ${response.status}`);
        }
    }

    if (contentType && contentType.includes('application/json')) {
        return response.json();
    } else {
        throw new Error('Expected JSON response but received something else.');
    }
}
