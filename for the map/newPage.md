# The "Map Studio": A Comprehensive Design & Technical Specification

## 1. Vision & Philosophy
**The Concept**: "Photoshop for National Safety".
We are building a specialized, high-end graphical workspace called the **Map Studio**. It is not just a map; it is a canvas where authorized personnel compose critical alert visualizations with artistic precision.

**The User Experience**:
The user enters a focused, immersive environment. The noise of the standard form fades away. They are presented with a large, beautiful map of Palestine. To their left, a palette of warning assets. They pick a warning, place it on the map, sculpt it to perfection using professional-grade handles, and then "publish" their composition back to the alert system.

**Aesthetic Direction**:
-   **Core Theme**: "Government Navy Blue" (Authoritative, Trustworthy).
-   **Studio Vibe**: "Dark Mode Professional". While the main app is light/white, the Map Studio canvas area should feel like Adobe Photoshop or Figma—dark, neutral backgrounds that make the map and colorful warnings pop.
-   **Precision**: Every border, shadow, and interaction must feel crisp and engineered.

---

## 2. Visual Design System (The "DNA")

### 2.1. Color Palette
#### The Studio Environment
-   **Canvas Background**: `#1E293B` (Slate 800) - A deep, neutral dark blue-gray. Reduces eye strain and highlights the map.
-   **Panel Background**: `#0F172A` (Slate 900) - Darker, grounding sidebar.
-   **Panel Border**: `#334155` (Slate 700) - Subtle separation.

#### The Brand (Government Identity)
-   **Primary Brand**: `hsl(213 50% 24%)` (Navy Blue) - Used for primary actions (Save/Done).
-   **Accent**: `hsl(210 40% 92%)` (Light Blue) - Used for hover states on dark backgrounds.

#### The Warning System (Semantic Colors)
These are the *only* colors allowed for warning assets.
-   **Yellow (Caution)**:
    -   Base: `#FFC107`
    -   Glow: `rgba(255, 193, 7, 0.5)`
    -   Border: `#B78A00`
-   **Orange (Preparedness)**:
    -   Base: `#FF9800`
    -   Glow: `rgba(255, 152, 0, 0.5)`
    -   Border: `#B26A00`
-   **Red (Action)**:
    -   Base: `#DC2626`
    -   Glow: `rgba(220, 38, 38, 0.5)`
    -   Border: `#991B1B`

### 2.2. Typography
-   **Font Family**: `Inter`, sans-serif.
-   **Headers**: Weight 700 (Bold). Tracking -0.02em.
-   **UI Labels**: Weight 500 (Medium). Text-sm (14px).
-   **Tooltips**: Weight 400 (Regular). Text-xs (12px).

### 2.3. Iconography
-   **Library**: `lucide-react`.
-   **Style**: Stroke width 2px. Rounded caps.
-   **Key Icons**:
    -   `Move` (Drag tool)
    -   `Maximize2` (Resize)
    -   `RotateCw` (Rotate)
    -   `Trash2` (Delete)
    -   `Check` (Done)
    -   `Undo` / `Redo` (History)

---

## 3. Detailed Layout Specification

### 3.1. The Viewport
The Map Studio occupies the **entire screen** (Fixed Overlay) or a **Dedicated Page**.
-   **Z-Index**: 50 (Above everything).
-   **Transition**: `AnimatePresence` (Framer Motion).
    -   *Enter*: Opacity 0 -> 1, Scale 0.95 -> 1.
    -   *Exit*: Opacity 1 -> 0, Scale 1 -> 0.95.

### 3.2. The Sidebar (Asset Palette)
-   **Position**: Left (Fixed width: 320px).
-   **Background**: Glassmorphism Dark (`bg-slate-900/95 backdrop-blur-md`).
-   **Header**:
    -   Title: "Warning Assets" / "عناصر التحذير".
    -   Search Bar: "Search governorates..." (Input with Search icon).
-   **Tabs/Filter**:
    -   Segmented Control: [Yellow] [Orange] [Red].
    -   Active Tab: Highlights with the respective color (e.g., Yellow tab gets yellow underline).
-   **Asset Grid**:
    -   Layout: Grid (2 columns).
    -   **Item Card**:
        -   Aspect Ratio: Square.
        -   Content: Thumbnail of the governorate shape.
        -   Label: Name of the governorate (e.g., "Hebron").
        -   **Interaction**:
            -   *Hover*: Scale up 1.05, Border glow.
            -   *Click*: Adds the asset to the center of the Canvas.
            -   *Drag*: (Advanced) Drag from sidebar to drop on canvas.

### 3.3. The Canvas (Workspace)
-   **Position**: Center (Flex grow).
-   **Background**: Dot Pattern (`radial-gradient(circle, #334155 1px, transparent 1px)`).
-   **The Map**:
    -   Image: `2palestine_illustrated_map.png`.
    -   Behavior: Centered. Responsive height (fit within viewport minus padding).
    -   Shadow: Deep Drop Shadow (`shadow-2xl`).
-   **Controls Overlay**:
    -   Floating Toolbar (Bottom Center):
        -   Zoom In / Zoom Out.
        -   Fit to Screen.
        -   Reset.

### 3.4. The Top Bar (Action Bar)
-   **Position**: Top (Height: 64px).
-   **Background**: Transparent / Gradient (`bg-gradient-to-b from-slate-900 to-transparent`).
-   **Left**: "Map Studio" Logo/Text.
-   **Center**: "Editing: Hebron Warning" (Context).
-   **Right**:
    -   **Cancel Button**: Ghost variant, text-slate-400 hover:text-white.
    -   **Done Button**: Solid Primary (`bg-primary hover:bg-primary/90`).
        -   Icon: Check.
        -   Label: "Apply to Alert" / "اعتماد الخريطة".

---

## 4. Interaction Design: The "Photoshop" Experience

### 4.1. Selecting an Object
-   **Trigger**: User clicks on a placed warning shape on the map.
-   **Visual Feedback**:
    -   A **Blue Bounding Box** appears around the shape.
    -   **8 Handles** appear (4 corners, 4 edges).
    -   **Rotation Handle** appears (top center, connected by a line).

### 4.2. Transforming (The "Ctrl+T" Logic)
This is the most critical technical requirement.
-   **Move**:
    -   Cursor: `move` (4-way arrow).
    -   Action: Dragging anywhere inside the bounding box moves the shape.
    -   Constraint: Can move outside map bounds (for cropping effects), but visually clipped by map container.
-   **Resize**:
    -   Cursor: `nwse-resize`, `nesw-resize`, etc.
    -   Action: Dragging a corner handle scales the image.
    -   **Aspect Ratio**: LOCKED by default (Shift key to unlock, or toggle in UI). We don't want distorted governorates.
-   **Rotate**:
    -   Cursor: `grab` -> `grabbing`.
    -   Action: Dragging the rotation handle spins the shape.
    -   Snapping: Snap to 0, 45, 90 degrees.

### 4.3. Keyboard Shortcuts (Pro Features)
-   `Delete` / `Backspace`: Remove selected overlay.
-   `Arrow Keys`: Nudge position (1px per press).
-   `Shift + Arrow`: Big nudge (10px per press).
-   `Esc`: Deselect all.
-   `Ctrl + Z`: Undo (if history is implemented).

---

## 5. Technical Implementation Guide for Lovable

### 5.1. Recommended Libraries
Do not reinvent the wheel. Use these battle-tested libraries:
1.  **`react-moveable`**: The gold standard for "Photoshop-like" handles in React.
    -   Supports: Draggable, Resizable, Rotatable, Snappable.
    -   Styling: Fully customizable handles.
2.  **`react-selecto`**: For selecting multiple items (optional, but good for future).
3.  **`zustand`**: For managing the state of the studio (layers, positions, history).
4.  **`framer-motion`**: For the UI transitions.

### 5.2. Data Structure
The "Map Composition" should be stored as a JSON object:

```typescript
interface MapLayer {
  id: string;
  type: 'overlay';
  assetId: string; // e.g., 'hebron-yellow'
  src: string;
  // Transform Data
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  // Metadata
  opacity: number;
  zIndex: number;
}

interface MapComposition {
  baseMapId: 'palestine-v1';
  layers: MapLayer[];
  viewport: { zoom: number; pan: { x: number; y: number } };
}
```

### 5.3. Integration Logic
1.  **CreateAlert Page**:
    -   Has a state `mapComposition: MapComposition | null`.
    -   Displays a **Static Preview** of the composition (rendering the layers as absolute positioned images).
2.  **MapStudio Component**:
    -   Accepts `initialComposition` as a prop.
    -   Internal state tracks the live editing.
    -   On "Done", calls `onSave(newComposition)`.

---

## 6. Step-by-Step User Journey

### Step 1: Initiation
-   User is on `CreateAlert`.
-   They see the "Map Location" card. It shows the blank base map.
-   They click a large button: **"Open Map Studio"**.

### Step 2: The Studio Opens
-   The screen dims. The Studio overlay expands from the center.
-   The interface is dark, professional. The map is centered.

### Step 3: Composition
-   User clicks "Yellow" tab in sidebar.
-   User clicks "Hebron".
-   **Hebron.png** drops onto the center of the map.
-   User drags it to the southern part of the West Bank.
-   User grabs the corner handle and scales it up slightly to match the borders.
-   User nudges it with arrow keys for pixel-perfect alignment.

### Step 4: Finalization
-   User clicks "Done" (Top Right).
-   Studio fades out.
-   `CreateAlert` form is revealed.
-   The Map Card now shows the **exact** composition the user just created.

---

## 7. Specific Asset Instructions
-   **Base Map**: Use `/images/base-map.png`.
-   **Overlays**:
    -   Use `/images/overlays/hebron.png` for testing.
    -   Apply CSS filters to this single image to generate the "Yellow", "Orange", and "Red" variants in the sidebar preview.
    -   *Yellow Filter*: `brightness(0) saturate(100%) invert(78%) sepia(68%) saturate(986%) hue-rotate(356deg) brightness(102%) contrast(106%)` (Approximate for #FFC107).
    -   *Better Approach*: Use a mask. `<div style={{ maskImage: 'url(hebron.png)', backgroundColor: '#FFC107' }} />`. This is cleaner than CSS filters for coloring.

---

## 8. Conclusion
This specification describes a high-fidelity, professional tool. It shifts the burden of alignment from "code guessing" to "user precision", which is the correct approach for a system requiring high trust and accuracy. The result will be a flexible, powerful feature that elevates the entire application.
