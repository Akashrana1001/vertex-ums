import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import useSocket from '../../hooks/useSocket';
import toast from 'react-hot-toast';

export const AnnouncementComposer = ({ courses = [] }) => {
  const { socket } = useSocket();
  const [content, setContent] = useState('');
  const [courseId, setCourseId] = useState('');
  const [sending, setSending] = useState(false);

  const post = () => {
    if (!content.trim()) return;
    setSending(true);
    socket?.emit('postAnnouncement', { content: content.trim(), courseId: courseId || null });
    toast.success('Announcement posted!');
    setContent('');
    setCourseId('');
    setTimeout(() => setSending(false), 500);
  };

  return (
    <Card>
      <CardHeader><CardTitle>New Announcement</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <select
          value={courseId}
          onChange={e => setCourseId(e.target.value)}
          className="flex h-10 w-full rounded-xl border border-border bg-input px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-violet-500 transition-all"
        >
          <option value="">Broadcast to all students</option>
          {courses.map(c => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </select>

        <Textarea
          rows={4}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write your announcement…"
        />

        <div className="flex justify-end">
          <Button
            onClick={post}
            disabled={!content.trim() || sending}
            size="sm"
            className="gap-2"
          >
            <Send size={13} />
            Post
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
