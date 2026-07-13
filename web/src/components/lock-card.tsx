import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type LockCardProps = {
  lockUntil: bigint | null
  disabled: boolean
  saving: boolean
  onLock: (until: bigint) => void
}

function formatLockDate(until: bigint): string {
  return new Date(Number(until) * 1000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function LockCard({ lockUntil, disabled, saving, onLock }: LockCardProps) {
  const [date, setDate] = useState('')
  const today = new Date().toISOString().slice(0, 10)
  const locked = lockUntil !== null && Number(lockUntil) * 1000 > Date.now()

  const handleLock = () => {
    onLock(BigInt(Math.floor(new Date(`${date}T00:00:00`).getTime() / 1000)))
  }

  return (
    <Card className="rounded-2xl shadow-none">
      <CardHeader>
        <CardTitle>Time lock</CardTitle>
        <CardDescription>
          {locked && lockUntil !== null
            ? `Savings locked until ${formatLockDate(lockUntil)}`
            : 'Savings are unlocked. Set a date to protect your goal.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <label className="text-sm font-medium" htmlFor="lock-date">
          Lock savings until
        </label>
        <Input
          id="lock-date"
          type="date"
          className="mt-2"
          min={today}
          value={date}
          disabled={disabled}
          onChange={(e) => setDate(e.target.value)}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleLock} disabled={disabled || saving || date === '' || date < today}>
          {saving ? 'Locking...' : 'Lock savings'}
        </Button>
      </CardFooter>
    </Card>
  )
}
