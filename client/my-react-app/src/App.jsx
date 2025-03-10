// src/App.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../APIsConfig/axiosInstance.js';

function App() {
    const [data, setData] = useState('');

    useEffect(() => {
        axiosInstance.get('/shop/login')
            .then(response => setData(response.data.message))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className="app">
            <h1>React + Axios in Separate Folder</h1>
            <p>{data}</p>
        </div>
    );
}

export default App;
