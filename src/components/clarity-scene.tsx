import { useEffect, useRef } from "react";

export function ClarityScene() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let stopped = false;
    let cleanup = () => {};
    import("three").then((THREE) => {
      if (stopped) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, element.clientWidth / element.clientHeight, 0.1, 100);
      camera.position.z = Math.max(10, 10 / camera.aspect);
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); } catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(element.clientWidth, element.clientHeight);
      element.appendChild(renderer.domElement);
      const swatch = document.createElement("canvas");
      swatch.width = 1; swatch.height = 1;
      const swatchContext = swatch.getContext("2d");
      if (!swatchContext) { renderer.dispose(); return; }
      swatchContext.fillStyle = getComputedStyle(element).getPropertyValue("--scene-color").trim();
      swatchContext.fillRect(0, 0, 1, 1);
      const pixel = swatchContext.getImageData(0, 0, 1, 1).data;
      const color = new THREE.Color().setRGB((pixel[0] ?? 0) / 255, (pixel[1] ?? 0) / 255, (pixel[2] ?? 0) / 255, THREE.SRGBColorSpace);
      const material = new THREE.MeshPhysicalMaterial({ color, metalness: 0.35, roughness: 0.26, clearcoat: 1 });
      const geometry = new THREE.TorusKnotGeometry(1.55, 0.47, 220, 28, 2, 3);
      const sculpture = new THREE.Mesh(geometry, material);
      sculpture.scale.setScalar(0.82);
      sculpture.rotation.set(0.3, 0.4, -0.25);
      scene.add(sculpture);
      const wireGeometry = new THREE.TorusKnotGeometry(1.57, 0.49, 100, 12, 2, 3);
      const wireMaterial = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.12 });
      const wire = new THREE.Mesh(wireGeometry, wireMaterial);
      wire.scale.setScalar(1.22);
      sculpture.add(wire);
      const ambient = new THREE.AmbientLight(0xffffff, 2.3);
      const key = new THREE.DirectionalLight(0xffffff, 4); key.position.set(-3, 5, 5);
      const fill = new THREE.DirectionalLight(0xffffff, 2); fill.position.set(4, -1, 3);
      scene.add(ambient, key, fill);
      let x = 0, y = 0;
      const pointer = (event: PointerEvent) => { x = (event.clientX / window.innerWidth - 0.5) * 0.6; y = (event.clientY / window.innerHeight - 0.5) * 0.3; };
      window.addEventListener("pointermove", pointer);
      const observer = new ResizeObserver(() => {
        camera.aspect = element.clientWidth / element.clientHeight;
        camera.position.z = Math.max(10, 10 / camera.aspect);
        camera.updateProjectionMatrix(); renderer.setSize(element.clientWidth, element.clientHeight);
      });
      observer.observe(element);
      const start = performance.now();
      renderer.setAnimationLoop(() => {
        if (!reduced) { sculpture.rotation.y = 0.4 + (performance.now() - start) * 0.00009 + x; sculpture.rotation.x += (0.3 + y - sculpture.rotation.x) * 0.025; }
        renderer.render(scene, camera);
      });
      cleanup = () => { observer.disconnect(); window.removeEventListener("pointermove", pointer); renderer.setAnimationLoop(null); geometry.dispose(); wireGeometry.dispose(); material.dispose(); wireMaterial.dispose(); renderer.dispose(); renderer.domElement.remove(); };
    });
    return () => { stopped = true; cleanup(); };
  }, []);
  return <div className="clarity-scene" ref={host} role="img" aria-label="An interactive blue sculpture transforming interconnected lines into a clear, continuous system" />;
}