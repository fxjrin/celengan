import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export type ActivityEntry = {
  id: number
  label: string
  at: Date
}

type ActivityCardProps = {
  entries: ActivityEntry[]
}

export function ActivityCard({ entries }: ActivityCardProps) {
  return (
    <Card className="rounded-2xl shadow-none">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Actions from this session</CardDescription>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet this session.</p>
        ) : (
          <ul className="space-y-3">
            {entries.map((entry) => (
              <li key={entry.id} className="flex items-baseline justify-between gap-4 text-sm">
                <span>{entry.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {entry.at.toLocaleTimeString('en-GB')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
