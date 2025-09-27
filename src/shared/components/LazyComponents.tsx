import React, { Suspense } from 'react';

interface LazyComponentWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: string;
}

export const LazyComponentWrapper: React.FC<LazyComponentWrapperProps> = ({
  children,
  fallback,
  minHeight = '200px'
}) => {
  const defaultFallback = (
    <div 
      className="flex items-center justify-center bg-background/50"
      style={{ minHeight }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground">Loading component...</span>
      </div>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

interface LazyListItemProps {
  children: React.ReactNode;
  threshold?: number;
  placeholder?: React.ReactNode;
  className?: string;
}

export const LazyListItem: React.FC<LazyListItemProps> = ({
  children,
  threshold = 0.1,
  placeholder,
  className
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);

  const elementRef = React.useCallback((node: HTMLElement | null) => {
    if (node) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsVisible(true);
            setHasLoaded(true);
            observer.disconnect();
          }
        },
        { threshold }
      );
      
      observer.observe(node);
      
      return () => observer.disconnect();
    }
  }, [threshold, hasLoaded]);

  const defaultPlaceholder = (
    <div className="h-20 bg-muted/30 rounded animate-pulse" />
  );

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : (placeholder || defaultPlaceholder)}
    </div>
  );
};