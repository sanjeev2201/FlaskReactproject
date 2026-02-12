import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function FileUpload() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            const response = await axios.post('http://localhost:5001/fileupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploading(false);
            alert(response.data.message);
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploading(false);
            alert('Failed to upload file');
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h3 className="mb-4">File Upload</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="file"
                            className="form-control"
                            onChange={handleFileChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default FileUpload;
