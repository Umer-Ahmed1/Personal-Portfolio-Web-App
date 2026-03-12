import { useEffect, useRef, memo } from 'react';
import {
  Clock,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three';

const vertexShader = `
precision highp float;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;

const vec3 BLACK = vec3(0.0);
const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 background_color(vec2 uv) {
  vec3 col = vec3(0.0);
  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;
  col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
  col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

vec3 getLineColor(float t, vec3 baseColor) {
  if (lineGradientCount <= 0) return baseColor;
  vec3 gradientColor;
  if (lineGradientCount == 1) {
    gradientColor = lineGradient[0];
  } else {
    float clampedT = clamp(t, 0.0, 0.9999);
    float scaled = clampedT * float(lineGradientCount - 1);
    int idx = int(floor(scaled));
    float f = fract(scaled);
    int idx2 = min(idx + 1, lineGradientCount - 1);
    gradientColor = mix(lineGradient[idx], lineGradient[idx2], f);
  }
  return gradientColor * 0.5;
}

float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;
  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + x_offset + x_movement) * amp;
  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius);
    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
    y += bendOffset;
  }
  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;
  if (parallax) baseUv += parallaxOffset;

  vec3 col = vec3(0.0);
  vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);

  vec2 mouseUv = vec2(0.0);
  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }

  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi, baseUv, mouseUv, interactive
      ) * 0.2;
    }
  }

  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi, baseUv, mouseUv, interactive
      );
    }
  }

  if (enableTop) {
    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      float angle = topWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      ruv.x *= -1.0;
      col += lineCol * wave(
        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi, baseUv, mouseUv, interactive
      ) * 0.1;
    }
  }

  fragColor = vec4(col, 1.0);
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

const MAX_GRADIENT_STOPS = 8;

type WavePosition = { x: number; y: number; rotate: number };

type FloatingLinesProps = {
  linesGradient?: string[];
  enabledWaves?: Array<'top' | 'middle' | 'bottom'>;
  lineCount?: number | number[];
  lineDistance?: number | number[];
  topWavePosition?: WavePosition;
  middleWavePosition?: WavePosition;
  bottomWavePosition?: WavePosition;
  animationSpeed?: number;
  interactive?: boolean;
  bendRadius?: number;
  bendStrength?: number;
  mouseDamping?: number;
  parallax?: boolean;
  parallaxStrength?: number;
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
};

function hexToVec3(hex: string): Vector3 {
  let value = hex.trim().replace('#', '');
  let r = 255, g = 255, b = 255;
  if (value.length === 3) {
    r = parseInt(value[0] + value[0], 16);
    g = parseInt(value[1] + value[1], 16);
    b = parseInt(value[2] + value[2], 16);
  } else if (value.length === 6) {
    r = parseInt(value.slice(0, 2), 16);
    g = parseInt(value.slice(2, 4), 16);
    b = parseInt(value.slice(4, 6), 16);
  }
  return new Vector3(r / 255, g / 255, b / 255);
}

function FloatingLinesInner({
  linesGradient,
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = [6],
  lineDistance = [5],
  topWavePosition,
  middleWavePosition,
  bottomWavePosition = { x: 2.0, y: -0.7, rotate: -1 },
  animationSpeed = 1,
  interactive = true,
  bendRadius = 5.0,
  bendStrength = -0.5,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
  mixBlendMode = 'screen',
}: FloatingLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  /*
   * KEY FIX: store all props in refs so the useEffect never needs to
   * re-run when props change. Re-running the effect destroys and
   * recreates the WebGL context — that's what causes the flicker.
   * Instead we update the uniform values directly inside the render loop.
   */
  const propsRef = useRef({
    linesGradient, enabledWaves, lineCount, lineDistance,
    topWavePosition, middleWavePosition, bottomWavePosition,
    animationSpeed, interactive, bendRadius, bendStrength,
    mouseDamping, parallax, parallaxStrength,
  });

  // Keep propsRef current on every render without triggering the effect
  propsRef.current = {
    linesGradient, enabledWaves, lineCount, lineDistance,
    topWavePosition, middleWavePosition, bottomWavePosition,
    animationSpeed, interactive, bendRadius, bendStrength,
    mouseDamping, parallax, parallaxStrength,
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── helpers that read from propsRef (always fresh) ──────────────────
    const getLineCount = (waveType: 'top' | 'middle' | 'bottom'): number => {
      const { enabledWaves, lineCount } = propsRef.current;
      if (typeof lineCount === 'number') return lineCount;
      const index = enabledWaves.indexOf(waveType);
      return index === -1 ? 0 : (lineCount[index] ?? 6);
    };

    const getLineDistance = (waveType: 'top' | 'middle' | 'bottom'): number => {
      const { enabledWaves, lineDistance } = propsRef.current;
      if (typeof lineDistance === 'number') return lineDistance;
      const index = enabledWaves.indexOf(waveType);
      return index === -1 ? 0.1 : (lineDistance[index] ?? 0.1);
    };

    // ── Three.js setup — runs ONCE ───────────────────────────────────────
    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    const renderer = new WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const { enabledWaves: ew } = propsRef.current;

    const uniforms = {
      iTime:            { value: 0 },
      iResolution:      { value: new Vector3(1, 1, 1) },
      animationSpeed:   { value: propsRef.current.animationSpeed },
      enableTop:        { value: ew.includes('top') },
      enableMiddle:     { value: ew.includes('middle') },
      enableBottom:     { value: ew.includes('bottom') },
      topLineCount:     { value: getLineCount('top') },
      middleLineCount:  { value: getLineCount('middle') },
      bottomLineCount:  { value: getLineCount('bottom') },
      topLineDistance:    { value: getLineDistance('top') * 0.01 },
      middleLineDistance: { value: getLineDistance('middle') * 0.01 },
      bottomLineDistance: { value: getLineDistance('bottom') * 0.01 },
      topWavePosition: {
        value: new Vector3(
          propsRef.current.topWavePosition?.x ?? 10.0,
          propsRef.current.topWavePosition?.y ?? 0.5,
          propsRef.current.topWavePosition?.rotate ?? -0.4,
        ),
      },
      middleWavePosition: {
        value: new Vector3(
          propsRef.current.middleWavePosition?.x ?? 5.0,
          propsRef.current.middleWavePosition?.y ?? 0.0,
          propsRef.current.middleWavePosition?.rotate ?? 0.2,
        ),
      },
      bottomWavePosition: {
        value: new Vector3(
          propsRef.current.bottomWavePosition?.x ?? 2.0,
          propsRef.current.bottomWavePosition?.y ?? -0.7,
          propsRef.current.bottomWavePosition?.rotate ?? 0.4,
        ),
      },
      iMouse:           { value: new Vector2(-1000, -1000) },
      interactive:      { value: propsRef.current.interactive },
      bendRadius:       { value: propsRef.current.bendRadius },
      bendStrength:     { value: propsRef.current.bendStrength },
      bendInfluence:    { value: 0 },
      parallax:         { value: propsRef.current.parallax },
      parallaxStrength: { value: propsRef.current.parallaxStrength },
      parallaxOffset:   { value: new Vector2(0, 0) },
      lineGradient: {
        value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1)),
      },
      lineGradientCount: { value: 0 },
    };

    // Apply gradient colours
    const applyGradient = () => {
      const { linesGradient } = propsRef.current;
      if (linesGradient && linesGradient.length > 0) {
        const stops = linesGradient.slice(0, MAX_GRADIENT_STOPS);
        uniforms.lineGradientCount.value = stops.length;
        stops.forEach((hex, i) => {
          const c = hexToVec3(hex);
          uniforms.lineGradient.value[i].set(c.x, c.y, c.z);
        });
      } else {
        uniforms.lineGradientCount.value = 0;
      }
    };
    applyGradient();

    const material = new ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    const geometry = new PlaneGeometry(2, 2);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const clock = new Clock();

    // ── Resize ───────────────────────────────────────────────────────────
    const setSize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      const cw = renderer.domElement.width;
      const ch = renderer.domElement.height;
      uniforms.iResolution.value.set(cw, ch, 1);
    };
    setSize();

    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(setSize)
      : null;
    ro?.observe(container);

    // ── Mouse tracking — smooth lerp values ──────────────────────────────
    const targetMouse      = new Vector2(-1000, -1000);
    const currentMouse     = new Vector2(-1000, -1000);
    const targetParallax   = new Vector2(0, 0);
    const currentParallax  = new Vector2(0, 0);
    let targetInfluence  = 0;
    let currentInfluence = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dpr = renderer.getPixelRatio();
      targetMouse.set(x * dpr, (rect.height - y) * dpr);
      targetInfluence = 1.0;

      if (propsRef.current.parallax) {
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        targetParallax.set(
          ((x - cx) / rect.width)  * (propsRef.current.parallaxStrength ?? 0.2),
          (-(y - cy) / rect.height) * (propsRef.current.parallaxStrength ?? 0.2),
        );
      }
    };

    const handlePointerLeave = () => { targetInfluence = 0; };

    if (interactive) {
      renderer.domElement.addEventListener('pointermove', handlePointerMove);
      renderer.domElement.addEventListener('pointerleave', handlePointerLeave);
    }

    // ── Render loop ──────────────────────────────────────────────────────
    let raf = 0;
    let active = true;

    const renderLoop = () => {
      if (!active) return;
      const { mouseDamping: damp = 0.05 } = propsRef.current;

      uniforms.iTime.value = clock.getElapsedTime();

      if (propsRef.current.interactive) {
        currentMouse.lerp(targetMouse, damp);
        uniforms.iMouse.value.copy(currentMouse);

        currentInfluence += (targetInfluence - currentInfluence) * damp;
        uniforms.bendInfluence.value = currentInfluence;
      }

      if (propsRef.current.parallax) {
        currentParallax.lerp(targetParallax, damp);
        uniforms.parallaxOffset.value.copy(currentParallax);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    // ── Cleanup — runs only on unmount ───────────────────────────────────
    return () => {
      active = false;
      cancelAnimationFrame(raf);
      ro?.disconnect();

      if (interactive) {
        renderer.domElement.removeEventListener('pointermove', handlePointerMove);
        renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.parentElement?.removeChild(renderer.domElement);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← EMPTY array: effect runs once, never re-runs

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden floating-lines-container"
      style={{ mixBlendMode }}
    />
  );
}

// memo() prevents FloatingLines from unmounting/remounting when the parent
// re-renders due to state changes (hover, click, form input, etc.)
// Without this, every parent re-render destroys the WebGL context → white flash.
const FloatingLines = memo(FloatingLinesInner);
export default FloatingLines;