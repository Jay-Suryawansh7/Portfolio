# Hero Section Implementation Plan

## Components
1. **`HeroSection` (Main)**
   - Wraps `Canvas` and `Overlay`.
   - Handles loading states.

2. **`Scene` (R3F)**
   - **Cam/Lights**: `PerspectiveCamera` (fov 45), `AmbientLight`, `SpotLight`.
   - **`ParticleText`**: 
     - Loads font (Helvetiker for now, accessible via URL).
     - Creates geometry from "JAY".
     - Discards faces, keeps vertices.
     - Adds more points via sampling (MeshSurfaceSampler) to reach 2000+.
     - *Animation*: `useFrame` logic to displace particles based on mouse pointer (normalized coordinates).
   - **`Background`**:
     - `Stars` or custom points for depth.
     - Rotating gradient mesh behind text.

3. **`Overlay` (HTML/Framer)**
   - Absolute positioning over Canvas.
   - `motion.h1` for "JAY" (if not pure 3D) or Name "JAY SURYAWANSHI".
   - `motion.p` for tagline.
   - Buttons with `whileHover` scales and glows.

## Tech Details
- **Mouse Interaction**: `useThree` to get pointer. Raycaster not strictly needed if we just project mouse to a plane, but `pointer` (approx -1 to 1) is enough for a "screen space" repel effect, or we unproject it to world space z=0.
- **Colors**: Cyan (#00f5ff) and Purple (#a855f7).

## File Structure
- `src/components/HeroSection.tsx`: All code in one file for portability as requested.
