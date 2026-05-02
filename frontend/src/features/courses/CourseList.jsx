import { CourseCard } from './CourseCard';
import { SkeletonCard } from '../../components/SkeletonLoader';

export const CourseList = ({ courses, loading, onEnroll, enrolledIds = [], attendanceMap = {} }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!courses?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          <span className="text-muted-foreground text-xl">📚</span>
        </div>
        <p className="text-foreground font-medium text-sm">No courses found</p>
        <p className="text-muted-foreground text-xs mt-1">Create or enroll in a course to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map(course => (
        <CourseCard
          key={course._id}
          course={course}
          onEnroll={onEnroll}
          enrolled={enrolledIds.includes(course._id)}
          attendancePercent={attendanceMap[course._id]}
        />
      ))}
    </div>
  );
};
