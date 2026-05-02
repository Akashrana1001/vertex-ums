import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock4 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import useSocket from '../../hooks/useSocket';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export const AttendanceModal = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    if (!socket) return;
    const onOpened = ({ courseId, courseName }) => {
      setSession({ courseId, courseName });
      setMarked(false);
      toast('📋 Attendance is open!', {
        style: { background: '#18181b', color: '#fff', border: '1px solid rgba(139,92,246,0.4)' }
      });
    };
    const onClosed = ({ courseId }) => setSession(p => p?.courseId === courseId ? null : p);
    socket.on('attendanceOpened', onOpened);
    socket.on('attendanceClosed', onClosed);
    return () => { socket.off('attendanceOpened', onOpened); socket.off('attendanceClosed', onClosed); };
  }, [socket]);

  const markPresent = () => {
    if (!session || marked) return;
    socket?.emit('markPresent', { courseId: session.courseId, studentId: user.id });
    setMarked(true);
    toast.success('Attendance marked!');
  };

  return (
    <AnimatePresence>
      {session && (
        <motion.div
          key="attendance-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.85, y: 32 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 32 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="glass-card rounded-2xl w-full max-w-sm text-center overflow-hidden"
          >
            <div className="h-0.5 bg-gradient-to-r from-violet-600 to-indigo-500" />
            <div className="p-8">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-violet-600/15 border border-violet-600/25 flex items-center justify-center">
                <Clock4 size={28} className="text-violet-400" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Attendance Open</h2>
              <p className="text-muted-foreground text-sm mt-1.5 mb-7">{session.courseName}</p>

              <AnimatePresence mode="wait">
                {marked ? (
                  <motion.div
                    key="marked"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-600/15 border border-emerald-600/25 flex items-center justify-center">
                      <CheckCircle2 size={28} className="text-emerald-400" />
                    </div>
                    <p className="text-emerald-400 font-semibold text-sm">Marked present!</p>
                  </motion.div>
                ) : (
                  <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Button onClick={markPresent} className="w-full h-11" size="lg">
                      Mark Present
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
