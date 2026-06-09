import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Code2, AlertCircle, Play, CheckCircle2, XCircle, RotateCcw, BookOpen, Layers, ChevronLeft } from 'lucide-react';
import questionsData from './data/questions.json';
import logoImage from '../nb.webp';

type Question = typeof questionsData[0];

const CHAPTERS = [
  { id: 2, title: "Introduction to Python Programming", desc: "Variables, Input/Output, Arithmetic" },
  { id: 3, title: "Control Statements", desc: "If, If-Else, While, For, Break, Continue" },
  { id: 4, title: "Functions", desc: "Defining functions, Scope, Default arguments" },
  { id: 5, title: "Sequences: Lists and Tuples", desc: "List methods, slicing, tuples" },
  { id: 6, title: "Dictionaries and Sets", desc: "Key-value pairs, sets operations (up to 6.4)" }
];

const TOPICS = [
  { id: "memory", title: "Memory Questions", icon: <Brain size={24} />, desc: "Test your theoretical knowledge and concepts." },
  { id: "fix-code", title: "Fix Code", icon: <AlertCircle size={24} />, desc: "Identify and fix syntax or logical errors." },
  { id: "output", title: "Predict Output", icon: <Code2 size={24} />, desc: "Determine what the code snippet will print." }
];

function App() {
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const [started, setStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, boolean>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const filteredQuestions = useMemo(() => {
    if (!selectedChapter || !selectedTopic) return [];
    return questionsData.filter(q => q.chapter === selectedChapter && q.type === selectedTopic);
  }, [selectedChapter, selectedTopic]);

  const question = filteredQuestions[currentQIndex];
  const progress = filteredQuestions.length > 0 ? ((currentQIndex) / filteredQuestions.length) * 100 : 0;
  const correctCount = Object.values(userAnswers).filter(Boolean).length;
  const incorrectCount = Object.values(userAnswers).filter(v => v === false).length;

  const handleOptionClick = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
    
    setUserAnswers(prev => ({
      ...prev,
      [currentQIndex]: index === question.correctAnswerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQIndex < filteredQuestions.length - 1) {
      setCurrentQIndex(i => i + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const prevQuestion = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(i => i - 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const restartQuiz = () => {
    setStarted(false);
    setCurrentQIndex(0);
    setUserAnswers({});
    setShowExplanation(false);
    setSelectedOption(null);
    setIsFinished(false);
  };

  const goHome = () => {
    setSelectedChapter(null);
    setSelectedTopic(null);
    restartQuiz();
  };

  const goBackToTopics = () => {
    restartQuiz();
  };

  const startTest = (topicId: string) => {
    setSelectedTopic(topicId);
    setStarted(true);
    setCurrentQIndex(0);
    setUserAnswers({});
    setShowExplanation(false);
    setSelectedOption(null);
    setIsFinished(false);
  };

  // Screen 1: Select Chapter
  if (!selectedChapter) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="blob-container"><div className="blob blob-1"></div><div className="blob blob-2"></div></div>
      <div className="main-content">
        <header className="header" style={{ position: 'relative', marginBottom: '40px', borderRadius: '16px' }}>
          <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={logoImage} alt="Logo" style={{ height: '80px', objectFit: 'contain' }} />
          </div>
          <div style={{ color: 'var(--text-muted)' }}>Select a Chapter to begin</div>
        </header>

        <div className="grid-cards">
          {CHAPTERS.map(ch => (
            <motion.div 
              key={ch.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-panel interactive-card"
              onClick={() => setSelectedChapter(ch.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                <div style={{ background: 'rgba(77, 124, 255, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
                  <BookOpen size={28} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '20px' }}>Chapter {ch.id}</h3>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{ch.title}</span>
                </div>
              </div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>{ch.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <footer style={{ marginTop: 'auto', padding: '24px', textAlign: 'center', borderTop: '1px solid var(--glass-border)', background: 'rgba(11, 15, 25, 0.8)', backdropFilter: 'blur(12px)' }}>
        <p style={{ color: 'var(--text-muted)', margin: '0 0 12px 0', fontSize: '18px', fontWeight: 600 }}>إعداد عبد الهادي</p>
        <a href="https://wa.me/962780347278" target="_blank" rel="noreferrer" style={{ color: '#25D366', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', background: 'rgba(37, 211, 102, 0.1)', borderRadius: '50%', transition: 'all 0.2s', padding: '10px' }}>
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        </a>
      </footer>
      </div>
    );
  }

  // Screen 2: Select Topic
  if (!started && selectedChapter) {
    return (
      <div className="main-content">
        <button className="btn-secondary" onClick={() => setSelectedChapter(null)} style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ChevronLeft size={18} /> Back to Chapters
        </button>

        <div className="glass-panel" style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 8px 0' }}>Chapter {selectedChapter}</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Choose the type of questions you want to practice.</p>
        </div>

        <div className="grid-cards">
          {TOPICS.map(topic => (
            <motion.div 
              key={topic.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-panel interactive-card"
              onClick={() => startTest(topic.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                <div style={{ background: 'rgba(255, 51, 102, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--secondary)' }}>
                  {topic.icon}
                </div>
                <h3 style={{ margin: 0, fontSize: '20px' }}>{topic.title}</h3>
              </div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>{topic.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Handle empty state if no questions match
  if (started && filteredQuestions.length === 0) {
    return (
      <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel start-screen">
          <Layers size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h2>No Questions Found</h2>
          <p>There are currently no questions for Chapter {selectedChapter} - {TOPICS.find(t=>t.id===selectedTopic)?.title}.</p>
          <button className="btn-primary" onClick={() => setStarted(false)}>Go Back</button>
        </div>
      </div>
    );
  }

  // Screen 4: Finished
  if (isFinished) {
    return (
      <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel start-screen"
        >
          <h2 style={{ fontSize: '36px', marginBottom: '10px' }}>Test Completed!</h2>
          <p style={{ fontSize: '24px', color: 'var(--text-main)', marginBottom: '10px' }}>
            النتيجة النهائية: <strong style={{ color: 'var(--success)' }}>{correctCount}</strong> صحيحة من أصل <strong style={{ color: 'var(--primary)' }}>{filteredQuestions.length}</strong>
          </p>
          <p style={{ fontSize: '18px', color: 'var(--danger)', marginBottom: '30px' }}>
            الإجابات الخاطئة: {incorrectCount}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={restartQuiz}>
              <RotateCcw size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '8px' }} />
              Retry Topic
            </button>
            <button className="btn-primary" onClick={goHome}>
              Go Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Screen 3: Quiz Active
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="blob-container"><div className="blob blob-1"></div><div className="blob blob-2"></div></div>
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button className="btn-secondary" onClick={goBackToTopics} style={{ padding: '8px 12px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ChevronLeft size={16} /> رجوع للخلف
          </button>
          <div className="logo" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }} onClick={goHome}>
            <img src={logoImage} alt="Logo" style={{ height: '60px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '20px', fontWeight: 600, fontSize: '16px', background: 'rgba(255,255,255,0.02)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <div style={{ color: 'var(--success)' }}>صحيح: {correctCount}</div>
          <div style={{ color: 'var(--danger)' }}>خاطئ: {incorrectCount}</div>
          <div style={{ color: 'var(--text-muted)', borderLeft: '1px solid var(--glass-border)', paddingLeft: '16px' }}>الأسئلة: {filteredQuestions.length}</div>
        </div>
      </header>

      <main className="main-content">
        <div className="quiz-progress">
          <div className="quiz-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-panel"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Question {currentQIndex + 1} of {filteredQuestions.length}</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span className={`difficulty-badge difficulty-${question.difficulty}`}>
                  {question.difficulty.replaceAll('-', ' ')}
                </span>
                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                  Ch {question.chapter} • {TOPICS.find(t=>t.id===question.type)?.title}
                </span>
              </div>
            </div>

            <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>{question.question}</h2>

            {question.codeSnippet && (
              <div className="code-block">
                <pre style={{ margin: 0 }}><code>{question.codeSnippet}</code></pre>
              </div>
            )}

            <div style={{ marginTop: '24px' }}>
              {question.options.map((opt, idx) => {
                let btnClass = 'btn-option';
                if (showExplanation) {
                  if (idx === question.correctAnswerIndex) btnClass += ' correct';
                  else if (idx === selectedOption) btnClass += ' incorrect';
                }

                return (
                  <button 
                    key={idx} 
                    className={btnClass}
                    onClick={() => handleOptionClick(idx)}
                    disabled={showExplanation}
                  >
                    <div style={{ 
                      width: '24px', height: '24px', borderRadius: '50%', 
                      border: '1px solid var(--glass-border)', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center', fontSize: '12px' 
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div style={{ flex: 1, fontFamily: question.codeSnippet ? "'Fira Code', monospace" : "inherit" }}>
                      {opt.includes('\n') ? <pre style={{margin: 0}}>{opt}</pre> : opt}
                    </div>
                    {showExplanation && idx === question.correctAnswerIndex && <CheckCircle2 color="var(--success)" />}
                    {showExplanation && idx === selectedOption && idx !== question.correctAnswerIndex && <XCircle color="var(--danger)" />}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {showExplanation && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ marginTop: '24px', padding: '16px', background: 'rgba(77, 124, 255, 0.05)', borderRadius: '8px', borderLeft: '4px solid var(--primary)', overflow: 'hidden' }}
                >
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--primary)' }}>Explanation</h4>
                  <p style={{ margin: 0, color: 'var(--text-main)' }}>{question.explanation}</p>
                  
                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button className="btn-secondary" onClick={prevQuestion} disabled={currentQIndex === 0} style={{ opacity: currentQIndex === 0 ? 0.5 : 1 }}>
                      <ChevronLeft size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} /> رجوع للسؤال السابق
                    </button>
                    <button className="btn-primary" onClick={nextQuestion}>
                      {currentQIndex === filteredQuestions.length - 1 ? 'Finish Test' : 'Next Question'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </main>
      <footer style={{ marginTop: 'auto', padding: '24px', textAlign: 'center', borderTop: '1px solid var(--glass-border)', background: 'rgba(11, 15, 25, 0.8)', backdropFilter: 'blur(12px)' }}>
        <p style={{ color: 'var(--text-muted)', margin: '0 0 12px 0', fontSize: '18px', fontWeight: 600 }}>إعداد عبد الهادي</p>
        <a href="https://wa.me/962780347278" target="_blank" rel="noreferrer" style={{ color: '#25D366', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', background: 'rgba(37, 211, 102, 0.1)', borderRadius: '50%', transition: 'all 0.2s', padding: '10px' }}>
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        </a>
      </footer>
    </div>
  );
}

export default App;
