import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  BookOpen, 
  MessageSquare, 
  LayoutDashboard, 
  Plus, 
  ChevronRight, 
  Heart, 
  Activity, 
  Brain, 
  Wind, 
  Droplets, 
  User, 
  Dna,
  History,
  Info,
  Calculator,
  Search,
  ArrowLeft,
  Send,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { ClinicalEvaluation, VitalSigns, PhysicalAssessment } from './types';
import { NORMAL_RANGES, ASSESSMENT_CATEGORIES } from './constants';
import { GoogleGenAI } from "@google/genai";

type View = 'dashboard' | 'assessment' | 'tutor' | 'reference' | 'calculator';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [evaluations, setEvaluations] = useState<ClinicalEvaluation[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Load evaluations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nursing_evaluations');
    if (saved) {
      try {
        setEvaluations(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse evaluations', e);
      }
    }
  }, []);

  const saveEvaluation = (evaluation: ClinicalEvaluation) => {
    const updated = [evaluation, ...evaluations];
    setEvaluations(updated);
    localStorage.setItem('nursing_evaluations', JSON.stringify(updated));
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-1.5 rounded-lg">
            <ClipboardCheck className="text-white w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg tracking-tight">NursingEval</h1>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <LayoutDashboard className="w-6 h-6 text-gray-600" />
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-24">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <Dashboard 
              evaluations={evaluations} 
              onNewAssessment={() => setCurrentView('assessment')}
              onViewReference={() => setCurrentView('reference')}
              onOpenTutor={() => setCurrentView('tutor')}
            />
          )}
          {currentView === 'assessment' && (
            <AssessmentForm 
              onSave={saveEvaluation} 
              onCancel={() => setCurrentView('dashboard')} 
            />
          )}
          {currentView === 'tutor' && (
            <AITutor onBack={() => setCurrentView('dashboard')} />
          )}
          {currentView === 'reference' && (
            <ReferenceGuide onBack={() => setCurrentView('dashboard')} />
          )}
          {currentView === 'calculator' && (
            <MedicalCalculators onBack={() => setCurrentView('dashboard')} />
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <NavButton 
          active={currentView === 'dashboard'} 
          onClick={() => setCurrentView('dashboard')} 
          icon={<LayoutDashboard />} 
          label="Home" 
        />
        <NavButton 
          active={currentView === 'assessment'} 
          onClick={() => setCurrentView('assessment')} 
          icon={<Plus className="w-6 h-6" />} 
          label="Valuta"
          isPrimary
        />
        <NavButton 
          active={currentView === 'tutor'} 
          onClick={() => setCurrentView('tutor')} 
          icon={<MessageSquare />} 
          label="Tutor AI" 
        />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label, isPrimary }: { 
  active: boolean, 
  onClick: () => void, 
  icon: React.ReactNode, 
  label: string,
  isPrimary?: boolean
}) {
  if (isPrimary) {
    return (
      <button 
        onClick={onClick}
        className="flex flex-col items-center -mt-8"
      >
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95",
          active ? "bg-emerald-700" : "bg-emerald-600"
        )}>
          <div className="text-white">{icon}</div>
        </div>
        <span className="text-[10px] font-semibold mt-1 text-emerald-700 uppercase tracking-wider">{label}</span>
      </button>
    );
  }

  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-colors",
        active ? "text-emerald-600" : "text-gray-400"
      )}
    >
      {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </button>
  );
}

// --- Sub-components ---

function Dashboard({ evaluations, onNewAssessment, onViewReference, onOpenTutor }: { 
  evaluations: ClinicalEvaluation[], 
  onNewAssessment: () => void,
  onViewReference: () => void,
  onOpenTutor: () => void
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 space-y-6"
    >
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Ciao, Studente</h2>
        <p className="text-gray-500 text-sm">Pronto per la valutazione clinica di oggi?</p>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <QuickActionCard 
          icon={<Plus className="text-emerald-600" />} 
          title="Nuova Valutazione" 
          onClick={onNewAssessment}
          color="bg-emerald-50"
        />
        <QuickActionCard 
          icon={<MessageSquare className="text-blue-600" />} 
          title="Tutor AI" 
          onClick={onOpenTutor}
          color="bg-blue-50"
        />
        <QuickActionCard 
          icon={<BookOpen className="text-amber-600" />} 
          title="Valori Rif." 
          onClick={onViewReference}
          color="bg-amber-50"
        />
        <QuickActionCard 
          icon={<Calculator className="text-purple-600" />} 
          title="Calcolatori" 
          onClick={() => {}}
          color="bg-purple-50"
        />
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <History className="w-5 h-5 text-gray-400" />
            Recenti
          </h3>
          <button className="text-emerald-600 text-sm font-semibold">Vedi tutti</button>
        </div>

        {evaluations.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 text-center">
            <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <ClipboardCheck className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Nessuna valutazione salvata.</p>
            <button 
              onClick={onNewAssessment}
              className="mt-4 text-emerald-600 font-bold text-sm"
            >
              Inizia ora
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {evaluations.slice(0, 3).map((evalItem) => (
              <div key={evalItem.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Paziente: {evalItem.patientInitials}</p>
                  <p className="text-xs text-gray-500">{new Date(evalItem.date).toLocaleDateString('it-IT')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Completato</span>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="bg-emerald-900 rounded-2xl p-5 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h4 className="font-bold text-lg mb-1">Suggerimento Clinico</h4>
          <p className="text-emerald-100 text-sm leading-relaxed opacity-90">
            Ricorda sempre di valutare il dolore come quinto parametro vitale. Usa la scala VAS o NRS.
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <Heart className="w-24 h-24" />
        </div>
      </div>
    </motion.div>
  );
}

function QuickActionCard({ icon, title, onClick, color }: { icon: React.ReactNode, title: string, onClick: () => void, color: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-4 rounded-2xl flex flex-col items-start gap-3 transition-all active:scale-95 text-left border border-transparent hover:border-gray-200",
        color
      )}
    >
      <div className="bg-white p-2 rounded-xl shadow-sm">
        {icon}
      </div>
      <span className="font-bold text-sm text-gray-800 leading-tight">{title}</span>
    </button>
  );
}

function AssessmentForm({ onSave, onCancel }: { onSave: (e: ClinicalEvaluation) => void, onCancel: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ClinicalEvaluation>>({
    patientInitials: '',
    vitals: {
      heartRate: 70,
      systolicBP: 120,
      diastolicBP: 80,
      respiratoryRate: 16,
      temperature: 36.5,
      spo2: 98,
      painLevel: 0
    },
    assessment: {
      neurological: '',
      respiratory: '',
      cardiovascular: '',
      gastrointestinal: '',
      genitourinary: '',
      integumentary: '',
      musculoskeletal: ''
    },
    nursingDiagnosis: '',
    interventions: [],
    notes: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSave = () => {
    const finalEval: ClinicalEvaluation = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      patientInitials: formData.patientInitials || 'N/A',
      vitals: formData.vitals as VitalSigns,
      assessment: formData.assessment as PhysicalAssessment,
      nursingDiagnosis: formData.nursingDiagnosis || '',
      interventions: formData.interventions || [],
      notes: formData.notes || ''
    };
    onSave(finalEval);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-4 space-y-6"
    >
      <div className="flex items-center justify-between">
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className={cn(
              "h-1.5 rounded-full transition-all",
              step >= i ? "w-8 bg-emerald-600" : "w-4 bg-gray-200"
            )} />
          ))}
        </div>
        <div className="w-10" />
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900">Dati Paziente</h2>
            <p className="text-gray-500 text-sm">Inizia con le informazioni di base.</p>
          </section>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Iniziali Paziente</label>
              <input 
                type="text" 
                value={formData.patientInitials}
                onChange={e => setFormData({...formData, patientInitials: e.target.value})}
                placeholder="Es: M.R."
                className="w-full bg-white border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <VitalInput 
                label="FC (bpm)" 
                value={formData.vitals?.heartRate} 
                onChange={v => setFormData({...formData, vitals: {...formData.vitals!, heartRate: v}})}
              />
              <VitalInput 
                label="FR (atti/min)" 
                value={formData.vitals?.respiratoryRate} 
                onChange={v => setFormData({...formData, vitals: {...formData.vitals!, respiratoryRate: v}})}
              />
              <VitalInput 
                label="PA Sistolica" 
                value={formData.vitals?.systolicBP} 
                onChange={v => setFormData({...formData, vitals: {...formData.vitals!, systolicBP: v}})}
              />
              <VitalInput 
                label="PA Diastolica" 
                value={formData.vitals?.diastolicBP} 
                onChange={v => setFormData({...formData, vitals: {...formData.vitals!, diastolicBP: v}})}
              />
              <VitalInput 
                label="SpO2 (%)" 
                value={formData.vitals?.spo2} 
                onChange={v => setFormData({...formData, vitals: {...formData.vitals!, spo2: v}})}
              />
              <VitalInput 
                label="Temp (°C)" 
                value={formData.vitals?.temperature} 
                onChange={v => setFormData({...formData, vitals: {...formData.vitals!, temperature: v}})}
                step={0.1}
              />
            </div>
          </div>

          <button 
            onClick={nextStep}
            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all"
          >
            Continua
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900">Esame Obiettivo</h2>
            <p className="text-gray-500 text-sm">Valutazione sistematica per apparati.</p>
          </section>

          <div className="space-y-4">
            {ASSESSMENT_CATEGORIES.map(cat => (
              <div key={cat.id} className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  {cat.label}
                </label>
                <textarea 
                  value={(formData.assessment as any)[cat.id]}
                  onChange={e => setFormData({
                    ...formData, 
                    assessment: { ...formData.assessment!, [cat.id]: e.target.value }
                  })}
                  placeholder={`Note su ${cat.label.toLowerCase()}...`}
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[80px]"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={prevStep}
              className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl active:scale-95 transition-all"
            >
              Indietro
            </button>
            <button 
              onClick={nextStep}
              className="flex-[2] bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all"
            >
              Continua
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900">Diagnosi e Note</h2>
            <p className="text-gray-500 text-sm">Concludi la valutazione clinica.</p>
          </section>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Diagnosi Infermieristica (NANDA-I)</label>
              <textarea 
                value={formData.nursingDiagnosis}
                onChange={e => setFormData({...formData, nursingDiagnosis: e.target.value})}
                placeholder="Es: Compromissione degli scambi gassosi..."
                className="w-full bg-white border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[100px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Note Aggiuntive</label>
              <textarea 
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                placeholder="Altre osservazioni rilevanti..."
                className="w-full bg-white border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={prevStep}
              className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl active:scale-95 transition-all"
            >
              Indietro
            </button>
            <button 
              onClick={handleSave}
              className="flex-[2] bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all"
            >
              Salva Valutazione
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function VitalInput({ label, value, onChange, step = 1 }: { label: string, value: any, onChange: (v: number) => void, step?: number }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
      <input 
        type="number" 
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-center font-bold text-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
      />
    </div>
  );
}

function AITutor({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Ciao! Sono il tuo tutor clinico. Posso aiutarti a ragionare su un caso clinico o rispondere a dubbi sulla valutazione infermieristica. Cosa ti serve?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const response = await ai.models.generateContent({ 
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "Sei un tutor clinico esperto per studenti di infermieristica. Aiuta gli studenti a sviluppare il ragionamento clinico. Usa un tono professionale, incoraggiante e didattico. Basa le tue risposte sulle linee guida internazionali (NANDA, NIC, NOC, EBN). Rispondi in italiano."
        }
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || 'Scusa, non sono riuscito a generare una risposta.' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Errore di connessione con il tutor AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col h-[calc(100vh-160px)] p-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">Tutor Clinico AI</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={cn(
            "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed",
            m.role === 'user' 
              ? "bg-emerald-600 text-white ml-auto rounded-tr-none" 
              : "bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm"
          )}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm w-16 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Chiedi al tutor..."
          className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
        />
        <button 
          onClick={sendMessage}
          disabled={loading}
          className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg active:scale-95 transition-all disabled:opacity-50"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  );
}

function ReferenceGuide({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState('');
  
  const filtered = NORMAL_RANGES.filter(r => 
    r.parameter.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="p-4 space-y-6"
    >
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">Valori di Riferimento</h2>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Cerca parametro..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
        />
      </div>

      <div className="space-y-4">
        {['Vitals', 'Lab'].map(cat => (
          <section key={cat}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">{cat === 'Vitals' ? 'Parametri Vitali' : 'Esami di Laboratorio'}</h3>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {filtered.filter(r => r.category === cat).map((r, i, arr) => (
                <div key={r.parameter} className={cn(
                  "p-4 flex items-center justify-between",
                  i !== arr.length - 1 && "border-bottom border-gray-50"
                )}>
                  <div>
                    <p className="font-bold text-gray-800">{r.parameter}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-medium">{r.unit}</p>
                  </div>
                  <div className="bg-emerald-50 px-3 py-1.5 rounded-lg">
                    <span className="text-emerald-700 font-mono font-bold text-sm">{r.range}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </motion.div>
  );
}

function MedicalCalculators({ onBack }: { onBack: () => void }) {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBmi = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) {
      setBmi(w / (h * h));
    }
  };

  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { label: 'Sottopeso', color: 'text-blue-600' };
    if (val < 25) return { label: 'Normopeso', color: 'text-emerald-600' };
    if (val < 30) return { label: 'Sovrappeso', color: 'text-amber-600' };
    return { label: 'Obesità', color: 'text-red-600' };
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="p-4 space-y-6"
    >
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">Calcolatori Clinici</h2>
      </div>
      
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Calculator className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-bold text-gray-800">Calcolo BMI</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Peso (kg)</label>
            <input 
              type="number" 
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="Es: 70"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-center font-bold outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Altezza (cm)</label>
            <input 
              type="number" 
              value={height}
              onChange={e => setHeight(e.target.value)}
              placeholder="Es: 175"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-center font-bold outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <button 
          onClick={calculateBmi}
          className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl active:scale-95 transition-all"
        >
          Calcola BMI
        </button>

        {bmi !== null && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-4 border-t border-gray-50 text-center"
          >
            <p className="text-3xl font-black text-gray-900">{bmi.toFixed(1)}</p>
            <p className={cn("font-bold uppercase text-xs tracking-widest mt-1", getBmiCategory(bmi).color)}>
              {getBmiCategory(bmi).label}
            </p>
          </motion.div>
        )}
      </section>

      <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center">
        <Info className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-400 text-sm">Altri calcolatori (GCS, Gocce) in arrivo.</p>
      </div>
    </motion.div>
  );
}
