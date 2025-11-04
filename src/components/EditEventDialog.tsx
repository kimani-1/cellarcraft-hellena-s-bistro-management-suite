import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Event as EventType } from "@shared/types";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.enum(["Wine Tasting", "Launch Party", "Private Event", "Class"]),
  date: z.date(),
  maxCapacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
});
type EditEventFormData = z.infer<typeof eventSchema>;
interface EditEventDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  event: EventType | null;
  onEventUpdated: (event: EventType) => void;
}
export function EditEventDialog({ isOpen, setIsOpen, event, onEventUpdated }: EditEventDialogProps) {
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(eventSchema),
  });
  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        type: event.type,
        date: new Date(event.date),
        maxCapacity: event.maxCapacity,
      });
    }
  }, [event, reset]);
  const onSubmit = async (data: EditEventFormData) => {
    if (!event) return;
    try {
      const eventData = {
        ...data,
        date: data.date.getTime(),
      };
      const updatedEvent = await api<EventType>(`/api/events/${event.id}`, {
        method: 'PUT',
        body: JSON.stringify(eventData),
      });
      onEventUpdated(updatedEvent);
      toast.success("Event Updated!", { description: `${updatedEvent.title} has been updated.` });
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to update event", { description: error instanceof Error ? error.message : "An unknown error occurred." });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Edit Event</DialogTitle>
          <DialogDescription>
            Update the details for {event?.title}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Event Type</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wine Tasting">Wine Tasting</SelectItem>
                      <SelectItem value="Launch Party">Launch Party</SelectItem>
                      <SelectItem value="Private Event">Private Event</SelectItem>
                      <SelectItem value="Class">Class</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxCapacity">Max Capacity</Label>
              <Input id="maxCapacity" type="number" {...register("maxCapacity")} />
              {errors.maxCapacity && <p className="text-red-500 text-xs">{errors.maxCapacity.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-gold text-charcoal hover:bg-gold/90" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}