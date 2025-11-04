import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Users, ServerCrash } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api-client';
import type { Event as EventType } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { AddEventDialog } from '@/components/AddEventDialog';
const eventTypeConfig = {
  'Wine Tasting': 'bg-red-400/20 text-red-300 border-red-400/30',
  'Launch Party': 'bg-blue-400/20 text-blue-300 border-blue-400/30',
  'Private Event': 'bg-purple-400/20 text-purple-300 border-purple-400/30',
  'Class': 'bg-green-400/20 text-green-300 border-green-400/30',
};
export function EventsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedData = await api<{ items: EventType[] }>('/api/events');
        setEvents(fetchedData.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);
  const handleEventAdded = (newEvent: EventType) => {
    setEvents(prev => [...prev, newEvent].sort((a, b) => a.date - b.date));
  };
  const eventsOnSelectedDate = events.filter(event =>
    date ? format(new Date(event.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') : false
  );
  return (
    <div className="space-y-8">
      <AddEventDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onEventAdded={handleEventAdded}
      />
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground">Events</h1>
          <p className="text-lg text-muted-foreground">Schedule and manage tastings, classes, and private events.</p>
        </div>
        <Button className="bg-gold text-charcoal hover:bg-gold/90" onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Event
        </Button>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-2">
              {isLoading ? <Skeleton className="w-full h-[350px]" /> :
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="w-full"
                  modifiers={{
                    hasEvent: events.map(e => new Date(e.date)),
                  }}
                  modifiersStyles={{
                    hasEvent: {
                      border: '2px solid hsl(var(--primary))',
                      borderRadius: 'var(--radius)',
                    },
                  }}
                />
              }
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold">
            Events on {date ? format(date, 'PPP') : '...'}
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : error ? (
            <div className="text-destructive flex items-center gap-2"><ServerCrash className="h-5 w-5" /> {error}</div>
          ) : eventsOnSelectedDate.length > 0 ? (
            <div className="space-y-4">
              {eventsOnSelectedDate.map(event => (
                <Card key={event.id} className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">{event.title}</CardTitle>
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
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No events scheduled for this day.</p>
          )}
        </div>
      </div>
    </div>
  );
}