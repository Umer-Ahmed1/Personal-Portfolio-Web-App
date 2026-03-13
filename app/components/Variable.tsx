import { forwardRef, useRef, useEffect, MutableRefObject, CSSProperties, HTMLAttributes } from 'react';

// ── Hooks ─────────────────────────────────────────────────────────────────────
function useAnimationFrame(callback: () => void) {
  useEffect(() => {
    let frameId: number;
    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback]);
}

function useMousePositionRef(containerRef: MutableRefObject<HTMLElement | null>) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (ev: MouseEvent) => updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface VariableProximityProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
  // kept for API compatibility — ignored since we use weight/scale instead
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  containerRef: MutableRefObject<HTMLElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  // weight range — works with any font
  fromWeight?: number;
  toWeight?: number;
  // scale range
  fromScale?: number;
  toScale?: number;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

// ── Component ─────────────────────────────────────────────────────────────────
const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>((props, ref) => {
  const {
    label,
    containerRef,
    radius = 120,
    falloff = 'linear',
    fromWeight = 300,
    toWeight = 800,
    fromScale = 1,
    toScale = 1.12,
    className = '',
    onClick,
    style,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fromFontVariationSettings,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toFontVariationSettings,
    ...restProps
  } = props;

  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mousePositionRef = useMousePositionRef(containerRef);
  const lastPositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  const calculateFalloff = (distance: number): number => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    switch (falloff) {
      case 'exponential': return norm ** 2;
      case 'gaussian':    return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
      default:            return norm; // linear
    }
  };

  useAnimationFrame(() => {
    if (!containerRef?.current) return;
    const { x, y } = mousePositionRef.current;
    if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) return;
    lastPositionRef.current = { x, y };

    const containerRect = containerRef.current.getBoundingClientRect();

    letterRefs.current.forEach((el) => {
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2 - containerRect.left;
      const cy = rect.top  + rect.height / 2 - containerRect.top;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

      const t = dist >= radius ? 0 : calculateFalloff(dist);

      const weight = Math.round(fromWeight + (toWeight - fromWeight) * t);
      const scale  = fromScale + (toScale - fromScale) * t;

      el.style.fontWeight = String(weight);
      el.style.transform  = `scale(${scale})`;
    });
  });

  // Split into words → letters, tracking a global letter index
  const words = label.split(' ');
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      onClick={onClick}
      style={{
        display: 'inline',
        fontFamily: 'inherit',  // ← always uses the parent font
        fontSize:   'inherit',
        lineHeight: 'inherit',
        color:      'inherit',
        ...style,
      }}
      className={className}
      {...restProps}
    >
      {words.map((word, wi) => (
        <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((letter) => {
            const idx = letterIndex++;
            return (
              <span
                key={idx}
                ref={(el) => { letterRefs.current[idx] = el; }}
                style={{
                  display:        'inline-block',
                  fontWeight:     fromWeight,
                  transform:      'scale(1)',
                  transition:     'font-weight 0.08s linear, transform 0.08s linear',
                  transformOrigin:'center bottom',
                }}
                aria-hidden="true"
              >
                {letter}
              </span>
            );
          })}
          {wi < words.length - 1 && (
            <span style={{ display: 'inline-block' }}>&nbsp;</span>
          )}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.displayName = 'VariableProximity';
export default VariableProximity;