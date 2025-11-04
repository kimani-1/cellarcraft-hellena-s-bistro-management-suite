import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IMAGE_ASSETS } from "@shared/image-assets";
interface ImageSelectorDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onImageSelect: (url: string) => void;
}
export function ImageSelectorDialog({ isOpen, setIsOpen, onImageSelect }: ImageSelectorDialogProps) {
  const handleSelect = (url: string) => {
    onImageSelect(url);
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Select Product Image</DialogTitle>
          <DialogDescription>
            Choose an image from our curated gallery.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4 -mr-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
            {IMAGE_ASSETS.map((url, index) => (
              <div
                key={index}
                className="aspect-w-1 aspect-h-1 rounded-md overflow-hidden cursor-pointer group"
                onClick={() => handleSelect(url)}
              >
                <img
                  src={url}
                  alt={`Product image ${index + 1}`}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}