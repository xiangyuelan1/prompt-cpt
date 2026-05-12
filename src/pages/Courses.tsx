import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCourse } from '../contexts/CourseContext';
import { PageContainer } from '../components/layout/PageContainer';
import { BookOpen, Star, Users, Clock, CheckCircle, PlayCircle } from 'lucide-react';

export function CoursesPage() {
  const { currentUser } = useAuth();
  const { courses, learningProgress } = useCourse();

  const featuredCourses = courses.filter(c => c.isFeatured);
  const otherCourses = courses.filter(c => !c.isFeatured);

  const getCourseProgress = (courseId: string) => {
    if (!currentUser) return null;
    const progress = learningProgress.find(p => p.courseId === courseId && p.userId === currentUser.id);
    if (!progress) return null;
    return {
      progress: (progress.completedLessons.length / progress.totalLessons) * 100,
      completed: progress.completedLessons.length,
      total: progress.totalLessons,
      isCompleted: !!progress.completedAt
    };
  };

  const CourseCard = ({ course }: { course: any }) => {
    const progress = getCourseProgress(course.id);

    return (
      <div className="bg-dark-300 rounded-xl overflow-hidden border border-dark-400 hover:border-primary transition-all hover:shadow-lg">
        <div className="relative">
          <img src={course.coverImage} alt={course.title} className="w-full h-48 object-cover" />
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              course.difficulty === '入门' ? 'bg-green-500/20 text-green-400' :
              course.difficulty === '进阶' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {course.difficulty}
            </span>
          </div>
          {course.isFree && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                免费
              </span>
            </div>
          )}
        </div>
        
        <div className="p-5">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{course.title}</h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.students}人学习</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{course.rating}</span>
            </div>
          </div>

          {progress && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">学习进度</span>
                <span className="text-primary">{Math.round(progress.progress)}%</span>
              </div>
              <div className="w-full bg-dark-400 rounded-full h-2">
                <div 
                  className="bg-primary rounded-full h-2 transition-all"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              {progress.isCompleted && (
                <div className="flex items-center gap-1 text-green-400 text-sm mt-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>已完成</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-white">
              {course.isFree ? '免费' : `¥${course.price}`}
            </div>
            <Link
              to={`/courses/${course.id}`}
              className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {progress ? (
                <>
                  <PlayCircle className="w-4 h-4" />
                  {progress.isCompleted ? '复习' : '继续学习'}
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  开始学习
                </>
              )}
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-4">课程中心</h1>
          <p className="text-gray-400">系统学习提示词工程和AI应用开发技能</p>
        </div>

        {featuredCourses.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              精选课程
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        {otherCourses.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-white mb-6">全部课程</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageContainer>
  );
}
