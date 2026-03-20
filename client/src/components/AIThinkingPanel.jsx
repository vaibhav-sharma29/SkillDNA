import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const steps = [
  { id: 1, text: 'Fetching GitHub profile...', icon: '🔗' },
  { id: 2, text: 'Analyzing commit quality...', icon: '💾' },
  { id: 3, text: 'Extracting language signals...', icon: '🛠' },
  { id: 4, text: 'Parsing resume claims...', icon: '📄' },
  { id: 5, text: 'Verifying skills vs GitHub...', icon: '🔍' },
  { id: 6, text: 'Running AI scoring engine...', icon: '🤖' },
  { id: 7, text: 'Calculating bias delta...', icon: '⚖️' },
  { id: 8, text: 'Generating reasoning chain...', icon: '💡' },
]

export default function AIThinkingPanel({ active, currentStep }) {
  const [visibleSteps, setVisibleSteps] = useState([])

  useEffect(() => {
    if (!active) { setVisibleSteps([]); return }
    setVisibleSteps([])
    steps.forEach((s, i) => {
      setTimeout(() => setVisibleSteps(prev => [...prev, s.id]), i * 800)
    })
  }, [active])

  if (!active && visibleSteps.length === 0) return null

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      className="fixed right-6 top-24 w-64 glass-purple rounded-2xl p-4 z-40">
      <div className="flex items-center gap-2 mb-4">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full" />
        <span className="text-violet-300 text-xs font-semibold uppercase tracking-wider">AI Thinking</span>
      </div>
      <div className="space-y-2">
        <AnimatePresence>
          {steps.map(step => (
            visibleSteps.includes(step.id) && (
              <motion.div key={step.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2">
                <span className="text-sm">{step.icon}</span>
                <span className="text-white/60 text-xs">{step.text}</span>
                {visibleSteps[visibleSteps.length - 1] === step.id && active && (
                  <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-1 h-3 bg-violet-400 rounded ml-auto" />
                )}
                {visibleSteps[visibleSteps.length - 1] !== step.id && (
                  <span className="text-green-400 text-xs ml-auto">✓</span>
                )}
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
