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
  date: z.date({ required_error: "A date is required." }),
  maxCapacity: z.string().min(1, "Capacity is required").transform(Number).pipe(z.number().int().min(1, "Capacity must be at least 1")),
});
type AddEventFormData = z.infer<typeof eventSchema>;
interface AddEventDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onEventAdded: (event: EventType) => void;
}
export function AddEventDialog({ isOpen, setIsOpen, onEventAdded }: AddEventDialogProps) {
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<AddEventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      type: 'Wine Tasting',
      maxCapacity: '10',
      date: new Date(),
    }
  });
  const onSubmit = async (data: AddEventFormData) => {
    try {
      const eventData = {
        ...data,
        date: data.date.getTime(),
        attendees: 0,
      };
      const newEvent = await api<EventType>('/api/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
      });
      onEventAdded(newEvent);
      toast.success("Event Created!", { description: `${newEvent.title} has been scheduled.` });
      setIsOpen(false);
      reset();
    } catch (error) {
      toast.error("Failed to create event", { description: error instanceof Error ? error.message : "An unknown error occurred." });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Create New Event</DialogTitle>
          <DialogDescription>
            Enter the details for the new event.
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Input id="maxCapacity" type="text" inputMode="numeric" {...register("maxCapacity")} />
              {errors.maxCapacity && <p className="text-red-500 text-xs">{errors.maxCapacity.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-gold text-charcoal hover:bg-gold/90" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}