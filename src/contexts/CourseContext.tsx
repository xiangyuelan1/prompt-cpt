import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Course, Chapter, Lesson, LearningProgress, Quiz, QuizAttempt, Certificate } from '../types/course';

interface CourseContextType {
  courses: Course[];
  learningProgress: LearningProgress[];
  quizAttempts: QuizAttempt[];
  certificates: Certificate[];
  addCourse: (course: Course) => void;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  getCourse: (courseId: string) => Course | undefined;
  startLearning: (courseId: string, userId: string) => void;
  updateProgress: (courseId: string, userId: string, lessonId: string) => void;
  getProgress: (courseId: string, userId: string) => LearningProgress | undefined;
  addQuizAttempt: (attempt: QuizAttempt) => void;
  generateCertificate: (courseId: string, userId: string) => Certificate | null;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

const sampleCourses: Course[] = [
  {
    id: '1',
    title: '提示词工程入门到精通',
    description: '从基础到高级，全面掌握提示词工程的核心技能，成为AI应用开发专家',
    category: '进阶课程',
    difficulty: '进阶',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20prompt%20engineering%20course%20banner%20professional%20design&image_size=landscape_16_9',
    chapters: [
      {
        id: '1-1',
        title: '第一章：提示词基础',
        order: 1,
        lessons: [
          {
            id: '1-1-1',
            title: '1.1 什么是提示词工程',
            type: 'video',
            content: '提示词工程是一门通过设计和优化输入文本，来引导大型语言模型（LLM）产生高质量输出的技术...',
            videoUrl: 'https://example.com/video1',
            duration: '15分钟',
            resources: [
              { id: 'r1', name: '课程讲义.pdf', type: 'pdf', url: 'https://example.com/slides1.pdf' }
            ]
          },
          {
            id: '1-1-2',
            title: '1.2 提示词的基本结构',
            type: 'text',
            content: '一个好的提示词通常包含：任务描述、上下文、输入数据、输出格式要求等部分...',
            duration: '10分钟',
            resources: []
          }
        ]
      },
      {
        id: '1-2',
        title: '第二章：进阶技巧',
        order: 2,
        lessons: [
          {
            id: '1-2-1',
            title: '2.1 思维链提示法',
            type: 'video',
            content: '思维链提示法要求模型逐步推理，展示思考过程，显著提升复杂问题的解决能力...',
            duration: '20分钟',
            resources: []
          },
          {
            id: '1-2-2',
            title: '2.2 小样本学习',
            type: 'text',
            content: '通过提供少量示例，引导模型理解任务要求，提高输出质量...',
            duration: '12分钟',
            resources: []
          }
        ]
      }
    ],
    students: 1234,
    duration: '12小时',
    price: 299,
    isFree: false,
    isFeatured: true,
    rating: 4.8,
    creatorId: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'AI内容创作实战',
    description: '学习使用AI进行高效内容创作，包括文章写作、营销文案、社交媒体内容等',
    category: '基础课程',
    difficulty: '入门',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20content%20creation%20course%20banner%20creative%20design&image_size=landscape_16_9',
    chapters: [
      {
        id: '2-1',
        title: '第一章：内容创作基础',
        order: 1,
        lessons: [
          {
            id: '2-1-1',
            title: '1.1 AI写作入门',
            type: 'video',
            content: '了解AI写作的基本原理和最佳实践...',
            duration: '18分钟',
            resources: []
          }
        ]
      }
    ],
    students: 856,
    duration: '8小时',
    price: 0,
    isFree: true,
    isFeatured: true,
    rating: 4.6,
    creatorId: 'admin',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20')
  }
];

export function CourseProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    const savedCourses = localStorage.getItem('courses');
    const savedProgress = localStorage.getItem('learningProgress');
    const savedAttempts = localStorage.getItem('quizAttempts');
    const savedCertificates = localStorage.getItem('certificates');

    if (savedCourses) {
      setCourses(JSON.parse(savedCourses).map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt)
      })));
    } else {
      setCourses(sampleCourses);
      localStorage.setItem('courses', JSON.stringify(sampleCourses));
    }

    if (savedProgress) {
      setLearningProgress(JSON.parse(savedProgress).map((p: any) => ({
        ...p,
        completedAt: p.completedAt ? new Date(p.completedAt) : null
      })));
    }

    if (savedAttempts) {
      setQuizAttempts(JSON.parse(savedAttempts).map((a: any) => ({
        ...a,
        completedAt: new Date(a.completedAt)
      })));
    }

    if (savedCertificates) {
      setCertificates(JSON.parse(savedCertificates).map((c: any) => ({
        ...c,
        issuedAt: new Date(c.issuedAt)
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('learningProgress', JSON.stringify(learningProgress));
  }, [learningProgress]);

  useEffect(() => {
    localStorage.setItem('quizAttempts', JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  useEffect(() => {
    localStorage.setItem('certificates', JSON.stringify(certificates));
  }, [certificates]);

  const addCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
  };

  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId ? { ...course, ...updates, updatedAt: new Date() } : course
    ));
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
  };

  const getCourse = (courseId: string) => {
    return courses.find(course => course.id === courseId);
  };

  const getTotalLessons = (course: Course) => {
    return course.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0);
  };

  const getFirstLesson = (course: Course) => {
    if (course.chapters.length > 0 && course.chapters[0].lessons.length > 0) {
      return course.chapters[0].lessons[0].id;
    }
    return '';
  };

  const startLearning = (courseId: string, userId: string) => {
    const existingProgress = learningProgress.find(p => p.courseId === courseId && p.userId === userId);
    if (existingProgress) return;

    const course = getCourse(courseId);
    if (!course) return;

    const totalLessons = getTotalLessons(course);
    const firstLessonId = getFirstLesson(course);

    const newProgress: LearningProgress = {
      id: `${userId}-${courseId}`,
      userId,
      courseId,
      completedLessons: [],
      currentLessonId: firstLessonId,
      totalLessons,
      completedAt: null
    };

    setLearningProgress(prev => [...prev, newProgress]);
  };

  const updateProgress = (courseId: string, userId: string, lessonId: string) => {
    setLearningProgress(prev => prev.map(progress => {
      if (progress.courseId === courseId && progress.userId === userId) {
        const newCompletedLessons = progress.completedLessons.includes(lessonId)
          ? progress.completedLessons
          : [...progress.completedLessons, lessonId];
        
        const isCompleted = newCompletedLessons.length >= progress.totalLessons;
        
        return {
          ...progress,
          completedLessons: newCompletedLessons,
          currentLessonId: lessonId,
          completedAt: isCompleted ? new Date() : null
        };
      }
      return progress;
    }));
  };

  const getProgress = (courseId: string, userId: string) => {
    return learningProgress.find(p => p.courseId === courseId && p.userId === userId);
  };

  const addQuizAttempt = (attempt: QuizAttempt) => {
    setQuizAttempts(prev => [...prev, attempt]);
  };

  const generateCertificate = (courseId: string, userId: string) => {
    const progress = getProgress(courseId, userId);
    if (!progress || !progress.completedAt) return null;

    const existingCert = certificates.find(c => c.courseId === courseId && c.userId === userId);
    if (existingCert) return existingCert;

    const course = getCourse(courseId);
    if (!course) return null;

    const certificate: Certificate = {
      id: `cert-${Date.now()}`,
      userId,
      courseId,
      courseName: course.title,
      certificateNumber: `PA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      issuedAt: new Date()
    };

    setCertificates(prev => [...prev, certificate]);
    return certificate;
  };

  return (
    <CourseContext.Provider value={{
      courses,
      learningProgress,
      quizAttempts,
      certificates,
      addCourse,
      updateCourse,
      deleteCourse,
      getCourse,
      startLearning,
      updateProgress,
      getProgress,
      addQuizAttempt,
      generateCertificate
    }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
}
