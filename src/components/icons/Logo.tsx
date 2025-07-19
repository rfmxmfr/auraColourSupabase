export function Logo(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
    return (
      <div className={`font-headline text-2xl font-bold tracking-tight ${props.className}`}>
        Aura Colours
      </div>
    );
  }
  