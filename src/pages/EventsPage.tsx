import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { PlusCircle, ServerCrash } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '@/lib/api-client';
import type { Event as EventType } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { AddEventDialog } from '@/components/AddEventDialog';
import { EditEventDialog } from '@/components/EditEventDialog';
import { DeleteConfirmationDialog } from '@/components/DeleteConfirmationDialog';
import { EventCard } from '@/components/EventCard';
import { toast } from 'sonner';
export function EventsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedData = await api<{ items: EventType[] }>('/api/events');
        setEvents(fetchedData.items.sort((a, b) => a.date - b.date) || []);
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
  const handleEditEvent = (event: EventType) => {
    setSelectedEvent(event);
    setIsEditDialogOpen(true);
  };
  const handleEventUpdated = (updatedEvent: EventType) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e).sort((a, b) => a.date - b.date));
  };
  const handleDeleteEvent = (event: EventType) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };
  const confirmDeleteEvent = async () => {
    if (!selectedEvent) return;
    try {
      await api(`/api/events/${selectedEvent.id}`, { method: 'DELETE' });
      setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
      toast.success("Event Deleted", { description: `${selectedEvent.title} has been removed.` });
    } catch (err) {
      toast.error("Failed to delete event", { description: err instanceof Error ? err.message : "An unknown error occurred." });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedEvent(null);
    }
  };
  const eventsOnSelectedDate = events.filter(event =>
    date ? format(new Date(event.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') : false
  );
  return (
    <div className="space-y-8">
      <AddEventDialog isOpen={isAddDialogOpen} setIsOpen={setIsAddDialogOpen} onEventAdded={handleEventAdded} />
      <EditEventDialog isOpen={isEditDialogOpen} setIsOpen={setIsEditDialogOpen} event={selectedEvent} onEventUpdated={handleEventUpdated} />
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteEvent}
        title="Delete Event?"
        description={`Are you sure you want to delete the event "${selectedEvent?.title}"? This action cannot be undone.`}
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
                <EventCard key={event.id} event={event} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
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