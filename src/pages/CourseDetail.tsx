import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCourse } from '../contexts/CourseContext';
import { PageContainer } from '../components/layout/PageContainer';
import { 
  ArrowLeft, 
  PlayCircle, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  Video,
  FileText,
  Award,
  Download
} from 'lucide-react';

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getCourse, startLearning, updateProgress, getProgress, generateCertificate } = useCourse();
  
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const [showCertificate, setShowCertificate] = useState(false);
  
  const course = courseId ? getCourse(courseId) : undefined;
  const progress = currentUser && courseId ? getProgress(courseId, currentUser.id) : undefined;
  const certificate = showCertificate && currentUser && courseId ? generateCertificate(courseId, currentUser.id) : null;

  useEffect(() => {
    if (!course || !currentUser) return;
    
    startLearning(course.id, currentUser.id);
    
    if (progress) {
      setCurrentLessonId(progress.currentLessonId);
    } else {
      const firstLesson = course.chapters[0]?.lessons[0];
      if (firstLesson) {
        setCurrentLessonId(firstLesson.id);
      }
    }
  }, [course, currentUser, courseId]);

  const findLessonAndChapter = (lessonId: string) => {
    if (!course) return null;
    for (const chapter of course.chapters) {
      for (const lesson of chapter.lessons) {
        if (lesson.id === lessonId) {
          return { chapter, lesson };
        }
      }
    }
    return null;
  };

  const currentLessonData = findLessonAndChapter(currentLessonId);

  const getNextLesson = () => {
    if (!course) return null;
    const allLessons = course.chapters.flatMap(chapter => chapter.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
    if (currentIndex < allLessons.length - 1) {
      return allLessons[currentIndex + 1];
    }
    return null;
  };

  const getPrevLesson = () => {
    if (!course) return null;
    const allLessons = course.chapters.flatMap(chapter => chapter.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
    if (currentIndex > 0) {
      return allLessons[currentIndex - 1];
    }
    return null;
  };

  const handleLessonComplete = () => {
    if (!currentUser || !course) return;
    updateProgress(course.id, currentUser.id, currentLessonId);
    
    const nextLesson = getNextLesson();
    if (nextLesson) {
      setCurrentLessonId(nextLesson.id);
    }
  };

  if (!course) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-400 text-lg">课程不存在</p>
            <button
              onClick={() => navigate('/courses')}
              className="mt-4 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg"
            >
              返回课程中心
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  const progressPercent = progress ? (progress.completedLessons.length / progress.totalLessons) * 100 : 0;
  const isCompleted = progress?.completedAt;

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/courses')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回课程中心
        </button>

        {showCertificate && certificate && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-300 rounded-2xl p-8 max-w-2xl w-full">
              <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl p-8 text-center border-2 border-primary">
                <Award className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">结业证书</h2>
                <p className="text-gray-400 mb-6">恭喜您完成课程学习！</p>
                <div className="bg-dark-400 rounded-lg p-6 mb-6">
                  <p className="text-gray-300 mb-2">证书编号</p>
                  <p className="text-xl font-mono text-primary">{certificate.certificateNumber}</p>
                </div>
                <p className="text-white text-lg mb-2">{currentUser?.username}</p>
                <p className="text-gray-400 mb-4">已完成</p>
                <p className="text-xl font-semibold text-white mb-6">{certificate.courseName}</p>
                <p className="text-gray-500 text-sm">
                  颁发日期：{certificate.issuedAt.toLocaleDateString('zh-CN')}
                </p>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowCertificate(false)}
                  className="flex-1 px-4 py-2 bg-dark-400 hover:bg-dark-500 text-white rounded-lg"
                >
                  关闭
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  下载证书
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-dark-300 rounded-xl p-4 sticky top-6">
              <h3 className="text-white font-semibold mb-4">课程目录</h3>
              
              {progress && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">学习进度</span>
                    <span className="text-primary">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="w-full bg-dark-400 rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  {isCompleted && (
                    <button
                      onClick={() => setShowCertificate(true)}
                      className="w-full mt-4 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Award className="w-4 h-4" />
                      查看证书
                    </button>
                  )}
                </div>
              )}

              <div className="space-y-4">
                {course.chapters.map((chapter) => (
                  <div key={chapter.id}>
                    <h4 className="text-gray-400 text-sm font-medium mb-2">{chapter.title}</h4>
                    <div className="space-y-1">
                      {chapter.lessons.map((lesson) => {
                        const isCompleted = progress?.completedLessons.includes(lesson.id);
                        const isCurrent = lesson.id === currentLessonId;
                        
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => setCurrentLessonId(lesson.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-3 transition-colors ${
                              isCurrent 
                                ? 'bg-primary/20 text-primary' 
                                : 'text-gray-400 hover:bg-dark-400 hover:text-white'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 flex-shrink-0 text-green-400" />
                            ) : lesson.type === 'video' ? (
                              <Video className="w-4 h-4 flex-shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 flex-shrink-0" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 order-1 lg:order-2">
            {currentLessonData && (
              <div className="bg-dark-300 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-dark-400">
                  <h2 className="text-xl font-semibold text-white mb-2">{currentLessonData.lesson.title}</h2>
                  <p className="text-gray-400 text-sm">{currentLessonData.chapter.title}</p>
                </div>

                <div className="p-6">
                  {currentLessonData.lesson.type === 'video' && (
                    <div className="bg-dark-400 rounded-xl aspect-video flex items-center justify-center mb-6">
                      <div className="text-center">
                        <PlayCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                        <p className="text-gray-400">视频课程</p>
                        <p className="text-gray-500 text-sm">{currentLessonData.lesson.duration}</p>
                      </div>
                    </div>
                  )}

                  <div className="text-gray-300 leading-relaxed mb-6">
                    <p className="mb-4">{currentLessonData.lesson.content}</p>
                    <p className="text-gray-400">
                      这里是课程的详细内容。在实际生产环境中，您可以在这里嵌入真实的视频播放器、富文本内容或其他学习材料。
                    </p>
                  </div>

                  {currentLessonData.lesson.resources.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        课程资料
                      </h4>
                      <div className="space-y-2">
                        {currentLessonData.lesson.resources.map((resource) => (
                          <a
                            key={resource.id}
                            href={resource.url}
                            className="flex items-center gap-3 px-4 py-3 bg-dark-400 rounded-lg hover:bg-dark-500 transition-colors"
                          >
                            <FileText className="w-5 h-5 text-primary" />
                            <span className="text-white">{resource.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-dark-400">
                    <button
                      onClick={() => {
                        const prev = getPrevLesson();
                        if (prev) setCurrentLessonId(prev.id);
                      }}
                      disabled={!getPrevLesson()}
                      className="px-4 py-2 bg-dark-400 hover:bg-dark-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      上一课
                    </button>

                    <button
                      onClick={handleLessonComplete}
                      className="px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                      {progress?.completedLessons.includes(currentLessonId) ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          已完成
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          标记完成
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        const next = getNextLesson();
                        if (next) setCurrentLessonId(next.id);
                      }}
                      disabled={!getNextLesson()}
                      className="px-4 py-2 bg-dark-400 hover:bg-dark-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                      下一课
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
