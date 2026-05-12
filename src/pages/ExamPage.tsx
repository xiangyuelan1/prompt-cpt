import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCourse } from '../contexts/CourseContext';
import { PageContainer } from '../components/layout/PageContainer';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Award,
  Timer
} from 'lucide-react';

const sampleExams = [
  {
    id: '1',
    courseId: '1',
    title: '提示词工程基础测验',
    description: '测试您对提示词工程基础知识的掌握程度',
    duration: 30,
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        type: 'single-choice',
        question: '什么是提示词工程？',
        options: [
          '一门编程语言',
          '设计和优化AI输入文本的技术',
          '数据库管理系统',
          '网络安全工具'
        ],
        correctAnswer: 1,
        explanation: '提示词工程是一门通过设计和优化输入文本，来引导大型语言模型（LLM）产生高质量输出的技术。'
      },
      {
        id: 'q2',
        type: 'single-choice',
        question: '以下哪个不是好的提示词应包含的要素？',
        options: [
          '清晰的任务描述',
          '具体的上下文信息',
          '模糊的要求',
          '明确的输出格式'
        ],
        correctAnswer: 2,
        explanation: '好的提示词应该包含清晰的任务描述、具体的上下文信息和明确的输出格式，避免模糊的要求。'
      },
      {
        id: 'q3',
        type: 'multi-choice',
        question: '提示词工程中常用的技巧有哪些？（多选）',
        options: [
          '思维链提示法',
          '小样本学习',
          '角色扮演',
          '格式化输出'
        ],
        correctAnswer: [0, 1, 2, 3],
        explanation: '以上都是提示词工程中常用的技巧。'
      },
      {
        id: 'q4',
        type: 'single-choice',
        question: '思维链提示法的主要作用是什么？',
        options: [
          '让AI回复更快',
          '让AI展示思考过程，提高复杂问题的解决能力',
          '减少AI的token使用',
          '让AI输出更简短'
        ],
        correctAnswer: 1,
        explanation: '思维链提示法要求AI逐步推理，展示思考过程，显著提升复杂问题的解决能力。'
      },
      {
        id: 'q5',
        type: 'single-choice',
        question: '小样本学习是指什么？',
        options: [
          '用很少的数据训练AI模型',
          '在提示词中提供少量示例',
          '只学习一小部分知识',
          '快速完成学习'
        ],
        correctAnswer: 1,
        explanation: '小样本学习是指在提示词中提供少量示例，引导模型理解任务要求，提高输出质量。'
      }
    ]
  }
];

type ExamState = 'intro' | 'in-progress' | 'completed';

export function ExamPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [examState, setExamState] = useState<ExamState>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [score, setScore] = useState(0);

  const exam = sampleExams.find(e => e.id === examId) || sampleExams[0];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examState === 'in-progress' && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setExamState('completed');
            calculateScore();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examState, timeRemaining]);

  const startExam = () => {
    setExamState('in-progress');
    setTimeRemaining(exam.duration * 60);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const calculateScore = () => {
    let correct = 0;
    exam.questions.forEach((question, index) => {
      const userAnswer = answers[question.id];
      if (question.type === 'single-choice') {
        if (userAnswer === question.correctAnswer) {
          correct++;
        }
      } else if (question.type === 'multi-choice') {
        const isCorrect = Array.isArray(userAnswer) && 
          userAnswer.length === question.correctAnswer.length &&
          userAnswer.every(a => question.correctAnswer.includes(a));
        if (isCorrect) {
          correct++;
        }
      }
    });
    const finalScore = Math.round((correct / exam.questions.length) * 100);
    setScore(finalScore);
  };

  const submitExam = () => {
    setExamState('completed');
    calculateScore();
  };

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = exam.questions[currentQuestionIndex];
  const isPassed = score >= exam.passingScore;

  const renderIntro = () => (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        返回
      </button>

      <div className="bg-dark-300 rounded-xl p-8 border border-dark-400">
        <div className="text-center mb-8">
          <Award className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">{exam.title}</h1>
          <p className="text-gray-400">{exam.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-400 rounded-lg p-4 text-center">
            <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-gray-400 text-sm">考试时长</p>
            <p className="text-white font-semibold">{exam.duration} 分钟</p>
          </div>
          <div className="bg-dark-400 rounded-lg p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">题目数量</p>
            <p className="text-white font-semibold">{exam.questions.length} 题</p>
          </div>
          <div className="bg-dark-400 rounded-lg p-4 text-center">
            <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">及格分数</p>
            <p className="text-white font-semibold">{exam.passingScore}%</p>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-yellow-400 font-medium">考试须知</h4>
              <ul className="text-gray-400 text-sm mt-2 space-y-1">
                <li>• 请确保在开始考试前有足够的时间完成</li>
                <li>• 考试开始后不能暂停，计时将持续进行</li>
                <li>• 达到及格分数即可获得相应证书</li>
                <li>• 可以多次参加考试，以最高成绩为准</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={startExam}
          className="w-full px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-lg font-semibold transition-colors"
        >
          开始考试
        </button>
      </div>
    </div>
  );

  const renderInProgress = () => (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Timer className="w-5 h-5" />
            <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
          </div>
        </div>
        <div className="text-gray-400">
          第 {currentQuestionIndex + 1} / {exam.questions.length} 题
        </div>
      </div>

      <div className="bg-dark-300 rounded-xl p-8 border border-dark-400">
        <div className="w-full bg-dark-400 rounded-full h-2 mb-8">
          <div 
            className="bg-primary rounded-full h-2 transition-all"
            style={{ width: `${((currentQuestionIndex + 1) / exam.questions.length) * 100}%` }}
          />
        </div>

        <h2 className="text-xl font-semibold text-white mb-6">{currentQuestion.question}</h2>

        <div className="space-y-3">
          {currentQuestion.options?.map((option, index) => {
            const isSelected = currentQuestion.type === 'single-choice'
              ? answers[currentQuestion.id] === index
              : Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].includes(index);

            return (
              <button
                key={index}
                onClick={() => {
                  if (currentQuestion.type === 'single-choice') {
                    handleAnswer(currentQuestion.id, index);
                  } else {
                    const currentAnswers = Array.isArray(answers[currentQuestion.id]) 
                      ? [...answers[currentQuestion.id]] 
                      : [];
                    if (currentAnswers.includes(index)) {
                      handleAnswer(currentQuestion.id, currentAnswers.filter(a => a !== index));
                    } else {
                      handleAnswer(currentQuestion.id, [...currentAnswers, index]);
                    }
                  }
                }}
                className={`w-full text-left px-4 py-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-white'
                    : 'border-dark-400 text-gray-300 hover:border-dark-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    currentQuestion.type === 'multi-choice' ? 'rounded' : ''
                  } ${isSelected ? 'border-primary bg-primary' : 'border-gray-500'}`}>
                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-400">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-dark-400 hover:bg-dark-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            上一题
          </button>

          {currentQuestionIndex === exam.questions.length - 1 ? (
            <button
              onClick={submitExam}
              className="px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg font-semibold transition-colors"
            >
              提交答案
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(exam.questions.length - 1, prev + 1))}
              className="px-4 py-2 bg-dark-400 hover:bg-dark-500 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              下一题
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 bg-dark-300 rounded-xl p-4 border border-dark-400">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-sm">答题进度</span>
          <span className="text-gray-400 text-sm">{Object.keys(answers).length}/{exam.questions.length} 已作答</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {exam.questions.map((_, index) => {
            const isAnswered = answers[exam.questions[index].id] !== undefined;
            const isCurrent = index === currentQuestionIndex;
            return (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                  isCurrent
                    ? 'bg-primary text-white'
                    : isAnswered
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-dark-400 text-gray-400 hover:bg-dark-500'
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderCompleted = () => (
    <div className="max-w-2xl mx-auto">
      <div className={`bg-dark-300 rounded-xl p-8 border-2 ${
        isPassed ? 'border-green-500' : 'border-red-500'
      }`}>
        <div className="text-center mb-8">
          {isPassed ? (
            <Award className="w-20 h-20 text-green-400 mx-auto mb-4" />
          ) : (
            <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
          )}
          <h1 className="text-3xl font-bold text-white mb-2">
            {isPassed ? '恭喜通过！' : '再接再厉'}
          </h1>
          <p className="text-gray-400">
            {isPassed 
              ? '您已成功通过本次考试，可以获得相应证书' 
              : '很遗憾，未能达到及格分数，再试一次吧'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-dark-400 rounded-lg p-6 text-center">
            <p className="text-gray-400 text-sm mb-2">您的分数</p>
            <p className={`text-4xl font-bold ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
              {score}%
            </p>
          </div>
          <div className="bg-dark-400 rounded-lg p-6 text-center">
            <p className="text-gray-400 text-sm mb-2">及格分数</p>
            <p className="text-4xl font-bold text-white">{exam.passingScore}%</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="text-white font-semibold">答题详情</h3>
          {exam.questions.map((question, index) => {
            const userAnswer = answers[question.id];
            let isCorrect = false;
            if (question.type === 'single-choice') {
              isCorrect = userAnswer === question.correctAnswer;
            } else if (question.type === 'multi-choice') {
              isCorrect = Array.isArray(userAnswer) && 
                userAnswer.length === question.correctAnswer.length &&
                userAnswer.every(a => question.correctAnswer.includes(a));
            }

            return (
              <div key={question.id} className="bg-dark-400 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">第 {index + 1} 题</p>
                    <p className="text-gray-300 mt-1">{question.question}</p>
                    <div className="mt-3 p-3 bg-dark-500/50 rounded-lg">
                      <p className="text-green-400 text-sm">
                        正确答案：{question.options?.[question.correctAnswer as number]}
                      </p>
                      <p className="text-gray-400 text-sm mt-2">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/courses')}
            className="flex-1 px-6 py-3 bg-dark-400 hover:bg-dark-500 text-white rounded-lg font-medium transition-colors"
          >
            返回课程
          </button>
          {!isPassed && (
            <button
              onClick={startExam}
              className="flex-1 px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-lg font-medium transition-colors"
            >
              重新考试
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <PageContainer>
      {examState === 'intro' && renderIntro()}
      {examState === 'in-progress' && renderInProgress()}
      {examState === 'completed' && renderCompleted()}
    </PageContainer>
  );
}
