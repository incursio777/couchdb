import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';

const quizQuestions = [
  {
    question: '¿Qué es CouchDB?',
    options: [
      'Una base de datos relacional SQL',
      'Una base de datos NoSQL orientada a documentos',
      'Un sistema de archivos distribuido',
      'Una herramienta de visualización de datos'
    ],
    correct: 1,
    explanation: 'CouchDB es una base de datos NoSQL que almacena datos en documentos JSON.'
  },
  {
    question: '¿Qué formato usa CouchDB para almacenar documentos?',
    options: ['XML', 'JSON', 'CSV', 'YAML'],
    correct: 1,
    explanation: 'CouchDB almacena todos los documentos en formato JSON.'
  },
  {
    question: '¿Qué protocolo usa CouchDB para comunicarse?',
    options: ['FTP', 'SMTP', 'HTTP/REST', 'WebSocket'],
    correct: 2,
    explanation: 'CouchDB usa HTTP/REST, lo que permite acceder a la base de datos desde cualquier lenguaje.'
  },
  {
    question: '¿Qué es la replicación en CouchDB?',
    options: [
      'Eliminar documentos duplicados',
      'Copiar datos entre bases de datos',
      'Comprimir la base de datos',
      'Validar documentos'
    ],
    correct: 1,
    explanation: 'La replicación permite copiar y sincronizar datos entre diferentes instancias de CouchDB.'
  },
  {
    question: '¿Cómo maneja CouchDB los conflictos de escritura?',
    options: [
      'Bloquea los documentos',
      'Usa control de versiones MVCC',
      'Rechaza todas las escrituras conflictivas',
      'Sobrescribe siempre con la última'
    ],
    correct: 1,
    explanation: 'CouchDB usa MVCC (Multi-Version Concurrency Control) para manejar conflictos sin bloqueos.'
  },
  {
    question: '¿Qué son las vistas (views) en CouchDB?',
    options: [
      'Interfaces gráficas',
      'Índices creados con MapReduce',
      'Copias de seguridad',
      'Usuarios con permisos'
    ],
    correct: 1,
    explanation: 'Las vistas son índices generados usando funciones MapReduce para consultar datos eficientemente.'
  },
  {
    question: '¿Qué significa que CouchDB sea "eventually consistent"?',
    options: [
      'Los datos nunca son consistentes',
      'Los datos son consistentes inmediatamente',
      'Los datos llegarán a ser consistentes con el tiempo',
      'Solo hay un servidor'
    ],
    correct: 2,
    explanation: 'Eventually consistent significa que las réplicas se sincronizarán eventualmente, priorizando disponibilidad.'
  },
  {
    question: '¿Qué es un documento en CouchDB?',
    options: [
      'Un archivo PDF',
      'Una tabla de base de datos',
      'Un objeto JSON con _id único',
      'Una línea de código'
    ],
    correct: 2,
    explanation: 'En CouchDB, un documento es un objeto JSON que debe tener un campo _id único.'
  }
];

export default function QuizModal({ isOpen, onClose, onAnswer, round }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answered, setAnswered] = useState(false);

  // Calcular índice de pregunta de forma segura
  const getQuestionIndex = () => {
    // Para ronda 5 -> índice 0, ronda 10 -> índice 1, etc.
    const index = Math.floor((round - 5) / 5);
    // Asegurar que el índice esté dentro del rango
    return index % quizQuestions.length;
  };

  const questionIndex = getQuestionIndex();
  const currentQuestion = quizQuestions[questionIndex];

  // Si no hay pregunta válida, no mostrar nada
  if (!currentQuestion) {
    return null;
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    const correct = selectedAnswer === currentQuestion.correct;
    setIsCorrect(correct);
    setShowResult(true);
    setAnswered(true);
    // call onAnswer when showing result so the game knows it was answered
    try { onAnswer && onAnswer(correct); } catch (err) {}
  };

  const handleContinue = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setAnswered(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { /* prevent external close while modal active */ }}>
    <DialogContent className="sm:max-w-2xl bg-slate-900 border-blue-500" style={{background:'#0b1220', border: '2px solid #2563eb'}}>
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center gap-2">
            🧠 Quiz de CouchDB - Ronda {round}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Responde correctamente para ganar puntos bonus
          </DialogDescription>
        </DialogHeader>

        {!showResult ? (
          <div className="space-y-6 py-4">
            <h3 className="text-lg font-semibold text-white">
              {currentQuestion.question}
            </h3>

            <RadioGroup value={selectedAnswer?.toString()} onValueChange={(v) => !answered && setSelectedAnswer(parseInt(v))}>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
                  <RadioGroupItem id={`option-${index}`} name={`quiz-${round}`} value={index.toString()} checked={selectedAnswer === index} onChange={() => !answered && setSelectedAnswer(index)} />
                  <Label htmlFor={`option-${index}`} className="text-white cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null || answered}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Confirmar Respuesta
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className={`flex items-center gap-3 p-4 rounded-lg ${
              isCorrect ? 'bg-green-900/30' : 'bg-red-900/30'
            }`}>
              {isCorrect ? (
                <>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">¡Correcto! 🎉</h3>
                    <p className="text-gray-300">+100 puntos</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-8 h-8 text-red-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Incorrecto</h3>
                    <p className="text-gray-300">
                      La respuesta correcta es: {currentQuestion.options[currentQuestion.correct]}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 bg-slate-800 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Explicación:</h4>
              <p className="text-gray-300">{currentQuestion.explanation}</p>
            </div>

            <Button
              onClick={handleContinue}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Continuar Juego
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}