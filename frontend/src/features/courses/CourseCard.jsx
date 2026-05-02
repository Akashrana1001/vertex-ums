import { motion } from 'framer-motion';
import { BookOpen, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Card, CardContent } from '../../components/ui/card';

export const CourseCard = ({ course, onEnroll, enrolled, attendancePercent }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -3 }}
    transition={{ duration: 0.25 }}
  >
    <Card className="h-full hover:border-violet-800/40 hover:shadow-[0_0_30px_-10px_rgba(139,92,246,0.25)] transition-all duration-300">
      <CardContent className="p-5 flex flex-col gap-4 h-full">
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl bg-violet-600/15 border border-violet-600/20">
            <BookOpen size={16} className="text-violet-400" />
          </div>
          {enrolled
            ? <Badge variant="success">Enrolled</Badge>
            : onEnroll
              ? <Button size="sm" variant="outline" onClick={() => onEnroll(course._id)} className="h-7 text-xs">Enroll</Button>
              : null
          }
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm leading-tight">{course.title}</h3>
          <p className="text-muted-foreground text-xs mt-1">{course.teacherId?.name || 'Instructor'}</p>
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <Users size={11} />
          <span>{course.enrolledStudents?.length || 0} students</span>
        </div>

        {attendancePercent !== undefined && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Attendance</span>
              <span className="text-foreground font-medium">{attendancePercent}%</span>
            </div>
            <Progress value={attendancePercent} />
          </div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);
