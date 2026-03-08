import { useState } from 'react'
import { getVisitorInfo } from '../utils/visitor-info'
import { PRINT_DURATION, DISINTEGRATE_DURATION } from '../constants'

const REVEAL_DURATION = 4000 // 5 seconds for reveal animation

export function useReceiptState() {
  const [isPrinting, setIsPrinting] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [visitorInfo] = useState(getVisitorInfo())
  const [disintegrate, setDisintegrate] = useState(false)
  const [lcdState, setLcdState] = useState<'ready' | 'rambling' | 'id'>('ready')
  const [visitorId, setVisitorId] = useState<string | null>(null)
  const [isFullyGenerated, setIsFullyGenerated] = useState(false)

  const handlePrint = () => {
    if (isPrinting) return
    setIsPrinting(true)
    setLcdState('rambling')
    setShowReceipt(true)
    setVisitorId(null)
    setIsFullyGenerated(false)
    setTimeout(() => {
      setIsPrinting(false)
    }, PRINT_DURATION)
    // Mark as fully generated after reveal animation completes
    setTimeout(() => {
      setIsFullyGenerated(true)
    }, REVEAL_DURATION)
  }

  const handleRamblingDone = (id: string) => {
    setVisitorId(id)
    setLcdState('id')
  }

  const handleClose = () => {
    // Only allow closing if ticket is fully generated
    if (!isFullyGenerated) return
    setDisintegrate(true)
    setTimeout(() => {
      setShowReceipt(false)
      setDisintegrate(false)
      setLcdState('ready')
      setVisitorId(null)
      setIsFullyGenerated(false)
    }, DISINTEGRATE_DURATION)
  }

  const handleDisintegrateComplete = () => {
    setShowReceipt(false)
    setDisintegrate(false)
  }

  return {
    isPrinting,
    showReceipt,
    visitorInfo,
    disintegrate,
    lcdState,
    visitorId,
    isFullyGenerated,
    handlePrint,
    handleRamblingDone,
    handleClose,
    handleDisintegrateComplete
  }
}
