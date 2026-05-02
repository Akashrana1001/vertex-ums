import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar } from '../../components/Avatar';
import useSocket from '../../hooks/useSocket';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const AnnouncementFeed = () => {
  const { socket } = useSocket();
  const [items, setItems] = useState([]);
  const [readIds, setReadIds] = useState(new Set());

  useEffect(() => {
    api.get('/announcements').then(r => setItems(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onNew = payload => {
      setItems(p => [payload, ...p]);
      toast.custom(() => (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 glass rounded-xl px-4 py-3 border border-violet-800/40 shadow-2xl max-w-xs"
        >
          <div className="p-2 bg-violet-600/15 rounded-lg">
            <Megaphone size={14} className="text-violet-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium">{payload.teacherName}</p>
            <p className="text-muted-foreground text-xs truncate">{payload.content}</p>
          </div>
        </motion.div>
      ), { duration: 5000 });
    };
    socket.on('newAnnouncement', onNew);
    return () => socket.off('newAnnouncement', onNew);
  }, [socket]);

  const markRead = id => setReadIds(p => new Set([...p, id]));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Announcements</CardTitle>
          {items.some((a, i) => !readIds.has(a._id || i)) && (
            <Badge variant="default" className="text-[10px]">
              {items.filter((a, i) => !readIds.has(a._id || i)).length} new
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No announcements yet</p>
        ) : (
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {items.map((a, i) => {
                const id = a._id || i;
                const unread = !readIds.has(id);
                return (
                  <motion.button
                    key={id}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => markRead(id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-150 ${
                      unread
                        ? 'border-violet-800/40 bg-violet-950/20 hover:bg-violet-950/30'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar name={a.teacherName || a.teacherId?.name || '?'} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-medium text-foreground">
                            {a.teacherName || a.teacherId?.name}
                          </span>
                          {unread && <Badge variant="default" className="text-[10px] py-0">New</Badge>}
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{a.content}</p>
                        <p className="text-muted-foreground/50 text-[11px] mt-1.5">
                          {new Date(a.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
