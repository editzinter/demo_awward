"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { fetchPexelsVideo } from "@/lib/pexels";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from 'three';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;

// SDF functions
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float sdSphere(vec3 p, float s) {
  return length(p) - s;
}

mat2 rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

float map(vec3 p) {
  vec3 p1 = p;
  vec3 p2 = p;
  vec3 p3 = p;

  p1.xy *= rot(uTime * 0.2);
  p1.xz *= rot(uTime * 0.3);

  p2.xy *= rot(-uTime * 0.1);
  p2.xz *= rot(-uTime * 0.4);

  p3.xy *= rot(uTime * 0.5);
  p3.yz *= rot(-uTime * 0.2);

  float d1 = sdSphere(p1 + vec3(sin(uTime)*0.5, cos(uTime*0.8)*0.5, 0.0), 0.8 + sin(uTime)*0.1);
  float d2 = sdSphere(p2 + vec3(cos(uTime*1.2)*0.6, -sin(uTime*0.5)*0.6, 0.0), 0.6 + cos(uTime)*0.2);
  float d3 = sdSphere(p3 + vec3(-sin(uTime*0.7)*0.4, -cos(uTime*0.9)*0.4, sin(uTime)*0.5), 0.7);

  float d = smin(d1, d2, 0.5);
  d = smin(d, d3, 0.5);

  // Add displacement
  d += sin(p.x * 5.0 + uTime) * sin(p.y * 5.0 + uTime) * sin(p.z * 5.0 + uTime) * 0.1;

  return d;
}

vec3 calcNormal(vec3 p) {
  const float h = 0.0001;
  const vec2 k = vec2(1, -1);
  return normalize(
    k.xyy * map(p + k.xyy * h) +
    k.yyx * map(p + k.yyx * h) +
    k.yxy * map(p + k.yxy * h) +
    k.xxx * map(p + k.xxx * h)
  );
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);

  vec3 ro = vec3(0.0, 0.0, 3.0);
  vec3 rd = normalize(vec3(uv, -1.0));

  float d0 = 0.0;
  float d;
  vec3 p;

  for(int i = 0; i < 80; i++) {
    p = ro + rd * d0;
    d = map(p);
    if(d < 0.001 || d0 > 10.0) break;
    d0 += d;
  }

  vec3 col = vec3(0.0);

  if(d0 < 10.0) {
    vec3 n = calcNormal(p);

    // Dark metallic lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    vec3 lightDir2 = normalize(vec3(-1.0, -0.5, -0.5));

    float diff1 = max(dot(n, lightDir), 0.0);
    float diff2 = max(dot(n, lightDir2), 0.0);

    // Specular
    vec3 viewDir = normalize(ro - p);
    vec3 reflectDir = reflect(-lightDir, n);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);

    // Red accent rim light
    float rim = 1.0 - max(dot(viewDir, n), 0.0);
    rim = smoothstep(0.6, 1.0, rim);

    col = vec3(0.1) * diff1 + vec3(0.05) * diff2; // Base dark grey
    col += vec3(1.0, 0.1, 0.1) * rim * 2.0; // Red rim
    col += vec3(0.8) * spec; // Shiny highlights

    // Fog
    col = mix(col, vec3(0.0), 1.0 - exp(-0.1 * d0 * d0));
  }

  gl_FragColor = vec4(col, d0 < 10.0 ? 1.0 : 0.0);
}
`;

const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

function SDFBackground() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={{
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2() }
        }}
        transparent={true}
      />
    </mesh>
  );
}

export default function Hero() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadVideo() {
      const url = await fetchPexelsVideo("concert lights stage heavy metal dark", "landscape");
      setVideoUrl(url);
    }
    loadVideo();
  }, []);

  useEffect(() => {
    if (!titleRef.current || !heroRef.current || !subtitleRef.current || !lineRef.current) return;

    // Initial Reveal Animation
    const chars = titleRef.current.innerText.split('');
    titleRef.current.innerText = '';
    chars.forEach((char) => {
      const span = document.createElement('span');
      span.innerText = char;
      span.className = 'inline-block opacity-0 translate-y-full';
      titleRef.current!.appendChild(span);
    });

    const tl = gsap.timeline();

    tl.to(titleRef.current.children, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.08,
      ease: "power4.out",
      delay: 0.2
    })
    .fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.8")
    .fromTo(lineRef.current, { scaleY: 0 }, { scaleY: 1, duration: 1, ease: "power2.out" }, "-=0.5");

    // Scroll Parallax Animation
    const ctx = gsap.context(() => {
      gsap.to(titleRef.current, {
        y: "40%",
        opacity: 0,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(subtitleRef.current, {
        y: "100%",
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => {
      tl.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={heroRef} className="relative w-full h-[100svh] overflow-hidden bg-black flex items-center justify-center">
      {videoUrl && (
        <div className="absolute inset-0 z-0 scale-105">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40 grayscale contrast-150"
            style={{ mixBlendMode: 'screen' }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* SDF Shader Canvas */}
      <div className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-80">
        <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }}>
          <SDFBackground />
        </Canvas>
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 w-full pointer-events-none">
        <h1
          ref={titleRef}
          className="font-oswald text-[14vw] sm:text-[16vw] leading-[0.8] tracking-tighter text-white uppercase drop-shadow-[0_0_60px_rgba(220,38,38,0.5)] select-none mix-blend-exclusion overflow-hidden"
        >
          METALLICA
        </h1>
        <p ref={subtitleRef} className="mt-8 text-sm md:text-xl text-zinc-400 font-roboto-mono tracking-[0.3em] md:tracking-[0.8em] uppercase max-w-2xl opacity-0">
          The World Wired Tour
        </p>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center opacity-70">
        <span className="text-xs tracking-[0.2em] uppercase mb-4 font-bold text-red-600">Scroll</span>
        <div ref={lineRef} className="w-[1px] h-32 bg-gradient-to-b from-red-600 via-zinc-500 to-transparent origin-top scale-y-0" />
      </div>
    </section>
  );
}
