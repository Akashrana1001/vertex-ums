import React, { useState } from 'react';
import axios from '../../api/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import toast from 'react-hot-toast';

export default function DocumentUploadForm() {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'STUDY_MATERIAL'
    });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFile({
                    data: reader.result,
                    name: selectedFile.name,
                    type: selectedFile.type
                });
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                fileData: file?.data,
                fileName: file?.name,
                fileType: file?.type
            };
            await axios.post('/api/documents', payload);
            toast.success('Document uploaded successfully!');
            setFormData({ title: '', description: '', type: 'STUDY_MATERIAL' });
            setFile(null);
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';
        } catch (error) {
            toast.error('Failed to upload document');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold">Upload Study Material</h3>
            <Input
                placeholder="Document Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
            />
            <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="space-y-1">
                <label className="text-xs text-gray-500">Select File (PDF, Image, etc.)</label>
                <Input
                    type="file"
                    onChange={handleFileChange}
                    required
                />
            </div>
            <select
                className="w-full p-2 border rounded-md"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
                <option value="STUDY_MATERIAL">Study Material</option>
                <option value="SYLLABUS">Syllabus</option>
                <option value="ASSIGNMENT">Assignment</option>
                <option value="UNIVERSITY_POLICY">University Policy</option>
            </select>
            <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Uploading...' : 'Share Document'}
            </Button>
        </form>
    );
}