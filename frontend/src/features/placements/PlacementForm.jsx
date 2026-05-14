import React, { useState } from 'react';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import toast from 'react-hot-toast';

export default function PlacementForm() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        roleOffered: '',
        package: '',
        visitDate: '',
        deadline: '',
        description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/placements', formData);
            toast.success('Placement drive added!');
            setFormData({ companyName: '', roleOffered: '', package: '', visitDate: '', deadline: '', description: '' });
        } catch (error) {
            toast.error('Failed to add placement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold">Add Visiting Company</h3>
            <div className="grid grid-cols-2 gap-4">
                <Input
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                />
                <Input
                    placeholder="Role Offered"
                    value={formData.roleOffered}
                    onChange={(e) => setFormData({ ...formData, roleOffered: e.target.value })}
                    required
                />
            </div>
            <Input
                placeholder="Package (e.g. 12 LPA)"
                value={formData.package}
                onChange={(e) => setFormData({ ...formData, package: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs text-gray-500">Visit Date</label>
                    <Input
                        type="date"
                        value={formData.visitDate}
                        onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                        required
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-gray-500">Deadline</label>
                    <Input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        required
                    />
                </div>
            </div>
            <Textarea
                placeholder="Job Description / Requirements"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Adding...' : 'Post Placement Drive'}
            </Button>
        </form>
    );
}