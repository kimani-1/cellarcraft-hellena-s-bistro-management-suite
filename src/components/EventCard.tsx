import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Users, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Event as EventType } from '@shared/types';
const eventTypeConfig = {
  'Wine Tasting': 'bg-red-400/20 text-red-300 border-red-400/30',
  'Launch Party': 'bg-blue-400/20 text-blue-300 border-blue-400/30',
  'Private Event': 'bg-purple-400/20 text-purple-300 border-purple-400/30',
  'Class': 'bg-green-400/20 text-green-300 border-green-400/30',
};
interface EventCardProps {
  event: EventType;
  onEdit: (event: EventType) => void;
  onDelete: (event: EventType) => void;
}
export function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 relative">
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(event)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(event)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardHeader>
        <CardTitle className="text-lg font-bold pr-8">{event.title}</CardTitle>
        <Badge variant="outline" className={cn("font-semibold w-fit", eventTypeConfig[event.type])}>
          {event.type}
        </Badge>
      </CardHeader>
      <CardContent className="flex justify-between items-center text-sm">
        <p className="text-muted-foreground">{format(new Date(event.date), 'p')}</p>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{event.attendees} / {event.maxCapacity}</span>
        </div>
      </CardContent>
    </Card>
  );
}