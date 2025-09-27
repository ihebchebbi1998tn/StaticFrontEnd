import React, { useState, useRef, useEffect } from "react";
import { format, addMinutes, differenceInMinutes } from "date-fns";
import type { Job } from "../../types";

interface ResizableJobBlockProps {
  job: Job;
  hourWidth: number;
  // onResize is called when the resize is finalized (mouse up)
  onResize: (jobId: string, newEnd: Date) => void;
  // onPreviewResize is called during pointer move to update UI locally (fast preview)
  onPreviewResize?: (jobId: string, newEnd: Date) => void;
  onClick: (job: Job) => void;
  isLocked?: boolean;
}

export function ResizableJobBlock({
  job,
  hourWidth,
  onResize,
  onPreviewResize,
  onClick,
  isLocked = false
}: ResizableJobBlockProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [originalEnd, setOriginalEnd] = useState<Date | null>(null);
  const [previewEnd, setPreviewEnd] = useState<Date | null>(null);
  const blockRef = useRef<HTMLDivElement>(null);

  if (!job.scheduledStart || !job.scheduledEnd) return null;

  const effectiveEnd = previewEnd ?? job.scheduledEnd;
  const duration = differenceInMinutes(effectiveEnd, job.scheduledStart);
  const widthPixels = (duration / 60) * hourWidth;

  const previewRef = React.useRef<typeof onPreviewResize | undefined>(undefined);

  // refs for mutable drag values to avoid stale closures
  const resizeStartXRef = React.useRef(0);
  const originalEndRef = React.useRef<Date | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const lastDeltaRef = React.useRef<number | null>(null);
  // vertical drag refs
  const pointerStartYRef = React.useRef<number | null>(null);
  const verticalDraggingRef = React.useRef(false);
  const clickSuppressedRef = React.useRef(false);

  // keep previewRef updated
  useEffect(() => {
    previewRef.current = onPreviewResize;
  }, [onPreviewResize]);

  // cleanup RAF/listeners on unmount in case of abrupt unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      // reset any body style we may have set
      try { document.body.style.userSelect = ''; document.body.style.cursor = ''; } catch (err) { /* ignore */ }
    };
  }, []);

  const handlePointerMove = (clientX: number) => {
    if (!originalEndRef.current) return;
    const deltaX = clientX - resizeStartXRef.current;
    const rawMinutes = (deltaX / hourWidth) * 60;
    // Snap to 15min grid, but use Math.round for intuitive expansion/shrink
    const deltaMinutes = Math.round(rawMinutes / 15) * 15;

    // Avoid repeated work for same delta
    if (lastDeltaRef.current === deltaMinutes) return;
    lastDeltaRef.current = deltaMinutes;

    const computeAndApply = () => {
      const newEnd = addMinutes(originalEndRef.current!, deltaMinutes);
      // Ensure minimum duration of 15 minutes
      if (differenceInMinutes(newEnd, job.scheduledStart!) >= 15) {
        setPreviewEnd(newEnd);
        if (typeof previewRef.current === 'function') {
          try { previewRef.current(job.id, newEnd); } catch (err) { /* ignore */ }
        }
      }
    };

    // throttle visual updates using RAF for smoothness
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      computeAndApply();
      rafRef.current = null;
    });
  };

  // Vertical expand: when user drags down on the block (not the resize handle)
  const handleBlockPointerDown = (e: React.PointerEvent | React.MouseEvent | React.TouchEvent) => {
    if (isLocked) return;
    const clientX = (e as any).clientX ?? ((e as any).touches && (e as any).touches[0]?.clientX);
    const clientY = (e as any).clientY ?? ((e as any).touches && (e as any).touches[0]?.clientY);
    if (typeof clientY !== 'number') return;

    pointerStartYRef.current = clientY;
    clickSuppressedRef.current = false;

    const move = (ev: PointerEvent | MouseEvent | TouchEvent) => {
      const moveY = (ev as any).clientY ?? ((ev as any).touches && (ev as any).touches[0]?.clientY) ?? ((ev as any).changedTouches && (ev as any).changedTouches[0]?.clientY);
      const moveX = (ev as any).clientX ?? ((ev as any).touches && (ev as any).touches[0]?.clientX) ?? ((ev as any).changedTouches && (ev as any).changedTouches[0]?.clientX);
      if (typeof moveY !== 'number') return;

      const startY = pointerStartYRef.current!;
      const dy = moveY - startY;
      const dx = (typeof clientX === 'number' ? (clientX as number) : 0) - (moveX ?? 0);

      // if user moves vertically enough and more than horizontal, start vertical dragging
      if (!verticalDraggingRef.current && Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) {
        verticalDraggingRef.current = true;
        clickSuppressedRef.current = true;
        // set default preview to 60 minutes from start
        const base = addMinutes(job.scheduledStart!, 60);
        setPreviewEnd(base);
        if (typeof previewRef.current === 'function') previewRef.current(job.id, base);
        try { document.body.style.userSelect = 'none'; document.body.style.cursor = 'ns-resize'; } catch (err) { }
      }

      if (verticalDraggingRef.current) {
        // map vertical pixels to 15min steps: 20px per 15min
        const deltaMinutes = Math.round(dy / 20) * 15;
        const newEnd = addMinutes(job.scheduledStart!, Math.max(15, 60 + deltaMinutes));
        setPreviewEnd(newEnd);
        if (typeof previewRef.current === 'function') previewRef.current(job.id, newEnd);
      }
    };

    const up = (ev: PointerEvent | MouseEvent | TouchEvent) => {
      // finalize if vertical drag occurred
      if (verticalDraggingRef.current) {
        const finalEnd = previewEnd ?? addMinutes(job.scheduledStart!, 60);
        setPreviewEnd(null);
        try { document.body.style.userSelect = ''; document.body.style.cursor = ''; } catch (err) { }
        verticalDraggingRef.current = false;
        pointerStartYRef.current = null;
        if (finalEnd && differenceInMinutes(finalEnd, job.scheduledStart!) >= 15) {
          onResize(job.id, finalEnd);
        }
      }

      // cleanup listeners
      document.removeEventListener('pointermove', move as any);
      document.removeEventListener('mousemove', move as any);
      document.removeEventListener('touchmove', move as any);
      document.removeEventListener('pointerup', up as any);
      document.removeEventListener('mouseup', up as any);
      document.removeEventListener('touchend', up as any);
    };

    document.addEventListener('pointermove', move as any);
    document.addEventListener('mousemove', move as any);
    document.addEventListener('touchmove', move as any, { passive: true } as any);
    document.addEventListener('pointerup', up as any);
    document.addEventListener('mouseup', up as any);
    document.addEventListener('touchend', up as any);
  };

  const endResize = (clientX?: number) => {
    setIsResizing(false);
    setOriginalEnd(null);
    lastDeltaRef.current = null;

    // restore body styles
    try { document.body.style.userSelect = ''; document.body.style.cursor = ''; } catch (err) { /* ignore */ }

    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }

    // finalize with the last previewEnd or calculate from provided clientX
    let finalNewEnd = previewEnd ?? originalEndRef.current;
    if (clientX != null && originalEndRef.current) {
      const finalDelta = Math.round(((clientX - resizeStartXRef.current) / hourWidth) * 60 / 15) * 15;
      finalNewEnd = addMinutes(originalEndRef.current, finalDelta);
    }

    setPreviewEnd(null);
    if (finalNewEnd && differenceInMinutes(finalNewEnd, job.scheduledStart!) >= 15) {
      onResize(job.id, finalNewEnd);
    }
  };

  const handleResizeStart = (e: React.MouseEvent | React.PointerEvent) => {
    if (isLocked) return;
    e.stopPropagation();
    const clientX = (e as any).clientX ?? ((e as any).touches && (e as any).touches[0]?.clientX);
    if (typeof clientX !== 'number') return;

    setIsResizing(true);
    setOriginalEnd(job.scheduledEnd!);
    resizeStartXRef.current = clientX;
    originalEndRef.current = job.scheduledEnd!;
    lastDeltaRef.current = null;

    // Prevent text selection and set cursor
    try { document.body.style.userSelect = 'none'; document.body.style.cursor = 'ew-resize'; } catch (err) { /* ignore */ }

    const pointerMoveListener = (ev: PointerEvent) => handlePointerMove(ev.clientX);
    const mouseMoveListener = (ev: MouseEvent) => handlePointerMove(ev.clientX);
    const touchMoveListener = (ev: TouchEvent) => handlePointerMove(ev.touches[0]?.clientX ?? ev.changedTouches[0]?.clientX);

    const pointerUpListener = (ev: PointerEvent) => {
      document.removeEventListener('pointermove', pointerMoveListener);
      document.removeEventListener('mousemove', mouseMoveListener);
      document.removeEventListener('touchmove', touchMoveListener);
      document.removeEventListener('pointerup', pointerUpListener as any);
      document.removeEventListener('mouseup', pointerUpListener as any);
      document.removeEventListener('touchend', pointerUpListener as any);
      endResize((ev && typeof (ev as any).clientX === 'number') ? (ev as any).clientX : undefined);
    };

    document.addEventListener('pointermove', pointerMoveListener);
    document.addEventListener('mousemove', mouseMoveListener);
    document.addEventListener('touchmove', touchMoveListener, { passive: true } as any);
    document.addEventListener('pointerup', pointerUpListener as any);
    document.addEventListener('mouseup', pointerUpListener as any);
    document.addEventListener('touchend', pointerUpListener as any);
  };

  const getPriorityColor = () => {
    if (isLocked) return 'from-green-500/30 to-green-600/20 border-green-500/50';
    
    switch (job.priority) {
      case 'urgent': return 'from-red-500/30 to-red-600/20 border-red-500/50';
      case 'high': return 'from-orange-500/30 to-orange-600/20 border-orange-500/50';
      case 'medium': return 'from-blue-500/30 to-blue-600/20 border-blue-500/50';
      case 'low': return 'from-gray-500/30 to-gray-600/20 border-gray-500/50';
      default: return 'from-primary/30 to-primary/20 border-primary/50';
    }
  };

  return (
  <div
      ref={blockRef}
      className={`resizable-job-block absolute inset-x-0 bg-gradient-to-r ${getPriorityColor()} 
        border rounded text-xs flex items-center justify-between px-2 cursor-pointer
        hover:shadow-md transition-all duration-200 group z-10
        ${isResizing ? 'resizing shadow-lg ring-2 ring-primary/30' : ''}
        ${isLocked ? 'border-2' : ''}`}
      style={{
        width: `${Math.max(widthPixels, 60)}px`,
        height: '70px'
      }}
      onPointerDown={handleBlockPointerDown}
      onClick={(e) => {
        // suppress click when vertical dragging started to avoid opening sidebar
        if (clickSuppressedRef.current) {
          e.stopPropagation();
          e.preventDefault();
          clickSuppressedRef.current = false;
          return;
        }
        onClick(job);
      }}
    >
      <div className="flex-1 overflow-hidden">
        <div className="font-semibold truncate">{job.title}</div>
        <div className="text-[10px] text-muted-foreground">
          {format(job.scheduledStart, 'HH:mm')} - {format(job.scheduledEnd, 'HH:mm')}
        </div>
        <div className="text-[10px] text-muted-foreground">
          ({Math.round(duration / 60 * 10) / 10}h)
        </div>
        {isLocked && (
          <div className="text-[10px] text-green-600 font-medium">🔒 LOCKED</div>
        )}
      </div>
      
      {!isLocked && (
        <div
          className="resize-handle w-2 h-full cursor-e-resize opacity-0 group-hover:opacity-100 
            transition-all duration-200 hover:scale-110 rounded-r relative overflow-hidden"
          onMouseDown={handleResizeStart}
          onPointerDown={handleResizeStart}
          onTouchStart={(e) => { handleResizeStart(e as any); }}
          title="Drag to resize"
        >
          {/* Resize handle with better visual feedback */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-px bg-primary/60"></div>
        </div>
      )}
    </div>
  );
}