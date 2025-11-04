export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-full animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-display font-bold text-gold">{title}</h1>
        <p className="text-muted-foreground mt-2">This page is under construction.</p>
      </div>
    </div>
  );
}