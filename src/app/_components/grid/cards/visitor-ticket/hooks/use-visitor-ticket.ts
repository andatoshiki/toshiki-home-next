import { useReducer, useCallback } from 'react'
import { getVisitorInfo } from '../utils/visitor-info'

interface VisitorTicketState {
  isPrinting: boolean
  showTicket: boolean
  isReady: boolean
  isDisintegrating: boolean
  visitorInfo: ReturnType<typeof getVisitorInfo>
  visitorId: string | null
  isFullyGenerated: boolean
}

type VisitorTicketAction =
  | { type: 'PRINT_START' }
  | { type: 'PRINT_COMPLETE' }
  | { type: 'TICKET_READY' }
  | { type: 'CLOSE_START' }
  | { type: 'CLOSE_COMPLETE' }
  | { type: 'SET_VISITOR_ID'; payload: string }
  | { type: 'SET_FULLY_GENERATED'; payload: boolean }

const INITIAL_STATE: VisitorTicketState = {
  isPrinting: false,
  showTicket: false,
  isReady: false,
  isDisintegrating: false,
  visitorInfo: getVisitorInfo(),
  visitorId: null,
  isFullyGenerated: false
}

function reducer(
  state: VisitorTicketState,
  action: VisitorTicketAction
): VisitorTicketState {
  switch (action.type) {
    case 'PRINT_START':
      return {
        ...state,
        isPrinting: true,
        showTicket: true,
        isReady: false,
        isDisintegrating: false,
        visitorId: null,
        isFullyGenerated: false
      }
    case 'PRINT_COMPLETE':
      return {
        ...state,
        isPrinting: false
      }
    case 'TICKET_READY':
      return {
        ...state,
        isReady: true
      }
    case 'SET_VISITOR_ID':
      return {
        ...state,
        visitorId: action.payload
      }
    case 'SET_FULLY_GENERATED':
      return {
        ...state,
        isFullyGenerated: action.payload
      }
    case 'CLOSE_START':
      return {
        ...state,
        isDisintegrating: true,
        isReady: false
      }
    case 'CLOSE_COMPLETE':
      return {
        ...INITIAL_STATE,
        visitorInfo: getVisitorInfo()
      }
    default:
      return state
  }
}

const PRINT_DURATION = 2000
const REVEAL_DURATION = 4000
const DISINTEGRATE_DURATION = 1500
const MIN_READY_DELAY = 500 // Minimum time before ticket becomes clickable

export function useVisitorTicket() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const print = useCallback(() => {
    if (state.isPrinting) return

    dispatch({ type: 'PRINT_START' })

    setTimeout(() => {
      dispatch({ type: 'PRINT_COMPLETE' })
    }, PRINT_DURATION)

    // Set ticket ready after reveal duration + minimum delay
    setTimeout(() => {
      dispatch({ type: 'TICKET_READY' })
    }, REVEAL_DURATION + MIN_READY_DELAY)
  }, [state.isPrinting])

  const close = useCallback(() => {
    if (!state.isReady || state.isDisintegrating) return
    dispatch({ type: 'CLOSE_START' })
  }, [state.isReady, state.isDisintegrating])

  const onDisintegrationComplete = useCallback(() => {
    setTimeout(() => {
      dispatch({ type: 'CLOSE_COMPLETE' })
    }, DISINTEGRATE_DURATION)
  }, [])

  const setVisitorId = useCallback((id: string) => {
    dispatch({ type: 'SET_VISITOR_ID', payload: id })
    dispatch({ type: 'SET_FULLY_GENERATED', payload: true })
  }, [])

  return {
    state,
    actions: {
      print,
      close,
      onDisintegrationComplete,
      onAnimationComplete: onDisintegrationComplete, // Alias for compatibility
      setVisitorId
    }
  }
}
