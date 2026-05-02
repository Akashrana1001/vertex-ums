import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Calendar, Building2, Briefcase, IndianRupee, Clock } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { STUDENT_NAV } from '../../config/navConfig';
import Particles from '../../components/Particles';

export default function StudentPlacements() {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlacements = async () => {
            try {
                const res = await axios.get('/api/placements');
                setPlacements(res.data);
            } catch (err) {
                console.error('Failed to fetch placements');
            } finally {
                setLoading(false);
            }
        };
        fetchPlacements();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'UPCOMING': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'ONGOING': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'COMPLETED': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
            default: return '';
        }
    };

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar links={STUDENT_NAV} />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar title="Placements" />
                <main className="p-6 space-y-6 relative">
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <Particles
              particleColors={["#3b82f6", "#60a5fa", "#2563eb"]}
              particleCount={200}
              particleSpread={10}
              speed={0.1}
              particleBaseSize={100}
              moveParticlesOnHover={false}
              alphaParticles={false}
              disableRotation={false}
              pixelRatio={1}
            />
          </div>
          <div className="relative z-10 h-full flex flex-col space-y-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Campus Placements</h1>
                        <Badge variant="outline" className="px-3 py-1">
                            Active Drives: {placements.filter(p => p.status !== 'COMPLETED').length}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading ? (
                            <p>Loading placements...</p>
                        ) : placements.length === 0 ? (
                            <p className="text-muted-foreground">No placement drives listed yet.</p>
                        ) : (
                            placements.map((job) => (
                                <Card key={job._id} className="overflow-hidden border-white/[0.08] bg-white shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md">
                                    <div className={`h-1.5 w-full ${job.status === 'UPCOMING' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="p-2 bg-secondary rounded-xl">
                                                <Building2 size={24} className="text-primary" />
                                            </div>
                                            <Badge className={getStatusColor(job.status)}>
                                                {job.status}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-xl font-bold">{job.companyName}</CardTitle>
                                        <CardDescription className="text-primary font-medium flex items-center gap-1.5 pt-1">
                                            <Briefcase size={16} /> {job.roleOffered}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-50 bg-gray-50/30 px-3 rounded-lg">
                                            <div className="flex items-center gap-2 text-sm">
                                                <IndianRupee size={16} className="text-muted-foreground" />
                                                <span className="font-semibold">{job.package || 'Not specified'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar size={16} className="text-muted-foreground" />
                                                <span>{new Date(job.visitDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                                {job.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground border-t border-gray-50">
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} />
                                                Deadline: {new Date(job.deadline).toLocaleDateString()}
                                            </div>
                                            <div className="text-primary font-medium hover:underline cursor-pointer">
                                                View Details →
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
        </main>
            </div>
        </div>
    );
}
