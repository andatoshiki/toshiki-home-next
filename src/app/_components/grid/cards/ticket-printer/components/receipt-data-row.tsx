import { ScrambleText } from './scramble-text'

interface ReceiptDataRowProps {
  label: string
  value: string
}

export function ReceiptDataRow({ label, value }: ReceiptDataRowProps) {
  return (
    <div className="flex justify-between">
      <span>
        <ScrambleText duration={500} mode="scramble">
          {label}
        </ScrambleText>
      </span>
      <span>
        <ScrambleText duration={500} mode="scramble">
          {value}
        </ScrambleText>
      </span>
    </div>
  )
}
