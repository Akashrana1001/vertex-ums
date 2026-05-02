import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Users, Radio } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import useSocket from '../../hooks/useSocket';

export const AttendanceManager = ({ courseId, courseName }) => {
  const { socket } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [presentCount, setPresentCount] = useState(0);

  useEffect(() => {
    if (!socket) return;
    const onUpdate = ({ courseId: cid, presentCount: count }) => {
      if (cid !== courseId) return;
      setPresentCount(count);
    };
    socket.on('attendanceUpdate', onUpdate);
    return () => socket.off('attendanceUpdate', onUpdate);
  }, [socket, courseId]);

  const start = () => {
    socket?.emit('startAttendance', { courseId });
    setIsOpen(true);
    setPresentCount(0);
  };

  const stop = () => {
    socket?.emit('stopAttendance', { courseId });
    setIsOpen(false);
  };

  return (
    <Card className="overflow-hidden">
      <div className={`h-0.5 w-full ${isOpen ? 'bg-gradient-to-r from-emerald-600 to-teal-500' : 'bg-border'} transition-all duration-500`} />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm">{courseName}</CardTitle>
            {isOpen && (
              <div className="flex items-center gap-1.5 mt-1">
                <Radio size={10} className="text-emerald-400 animate-pulse" />
                <span className="text-[11px] text-emerald-400">Session active</span>
              </div>
            )}
          </div>
          {isOpen ? (
            <Button variant="destructive" size="sm" onClick={stop} className="h-8 gap-1.5">
              <Square size={12} /> Stop
            </Button>
          ) : (
            <Button size="sm" onClick={start} className="h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20">
              <Play size={12} /> Start
            </Button>
          )}
        </div>
      </CardHeader>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0">
              <div className="rounded-xl bg-emerald-950/30 border border-emerald-900/40 p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-600/15 rounded-xl border border-emerald-600/20">
                  <Users size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Present</p>
                  <motion.p
                    key={presentCount}
                    initial={{ scale: 1.4, color: '#34d399' }}
                    animate={{ scale: 1, color: '#ffffff' }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl font-bold text-foreground"
                  >
                    {presentCount}
                  </motion.p>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
