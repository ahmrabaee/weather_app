# Comprehensive Project Specification: Palestine Early Warning System - Map Studio & Alert Creation

## 1. Executive Summary
**Project**: Palestine Early Warning System (EWS)
**Goal**: Create a high-end, government-grade **Alert Creation Workflow**.
**The Vision**: A two-step process:
1.  **The Map Studio**: A Photoshop-like workspace where users manually position and resize warning overlays on a map with precision tools.
2.  **The Alert Form**: A formal data entry page that uses the composed map from the Studio.

---

## 2. Part 1: The "Map Studio" (New Requirement)
**Concept**: A dedicated workspace for visual composition. It solves the "misalignment" issue by giving the user full manual control.

### 2.1. Layout & UI
-   **Vibe**: Professional Design Software (like Photoshop or Canva).
-   **Canvas**: The central area displaying `2palestine_illustrated_map.png`. It should be large and centered.
-   **Sidebar (The Palette)**:
    -   Located on the Left.
    -   Contains categorized "Assets":
        -   **Yellow Warnings**: List of governorate shapes in yellow.
        -   **Orange Warnings**: List of governorate shapes in orange.
        -   **Red Warnings**: List of governorate shapes in red.
    -   **Interaction**: Clicking an item (e.g., "Hebron Yellow") drops it onto the Canvas.

### 2.2. The "Free Transform" Experience (Critical)
We need **Photoshop-style controls** for the overlays.
-   **Selection**: Clicking an overlay on the canvas selects it.
-   **Bounding Box**: A box appears around the selected image with **resize handles** (corners and edges).
-   **Actions**:
    -   **Drag**: Move the image pixel-by-pixel.
    -   **Resize**: Scale the image up/down to fit the base map perfectly.
    -   **Delete**: Remove the overlay.
-   **Tech Recommendation**: Use `react-moveable`, `react-rnd`, or `react-resizable-rotatable-draggable`.

### 2.3. The "Done" Action
-   **Button**: A prominent "Done" / "تم" button.
-   **Action**:
    1.  Saves the current configuration (which overlays are added, their x/y coordinates, width/height).
    2.  Triggers a **Smooth Fade Transition** back to the `CreateAlert` page.

---

## 3. Part 2: The `CreateAlert` Page (The Form)
This is the main page where the user enters text data.

### 3.1. Integration with Map Studio
-   **Map Preview Area**: Instead of a small interactive map, this area now displays the **Result** of the Map Studio.
-   **"Edit Map" Button**: A large, clear button overlaying the map preview (or next to it) that says "Open Map Studio" / "تعديل الخريطة". Clicking it launches the Studio (with the current state loaded).

### 3.2. Form Fields (Standard)
-   **Design System**: "Government Navy Blue" (see Section 4).
-   **Cards**:
    -   **Basic Info**: Hazard Type, Alert Level (Yellow/Orange/Red toggles), Title (En/Ar).
    -   **Scope**: Affected Areas (Checkboxes), Time Range.
    -   **Details**: Technical Description, Public Advice.
    -   **Sectors**: Recommendations for Civil Defense, Agriculture, etc.

---

## 4. Design System & Aesthetics
**Theme**: "Government Navy Blue" - Formal, Authoritative, Luxurious.

### 4.1. Colors
-   **Primary**: `hsl(213 50% 24%)` (Navy Blue).
-   **Background**: `hsl(210 25% 97%)` (Light Blue/Gray).
-   **Alert Colors**:
    -   Yellow: `#FFC107`
    -   Orange: `#FF9800`
    -   Red: `#DC2626`

### 4.2. Components
-   **Cards**: White, rounded-xl, subtle shadow, blue corner accents (`.gov-card`).
-   **Typography**: `Inter` font.
-   **Animations**: Smooth fade-ins, sliding panels.

---

## 5. Technical Requirements for Lovable
1.  **New Route/Component**: Create the `MapStudio` component.
2.  **Interactive Library**: Implement the drag/resize functionality using a robust React library. **Do not build this from scratch** if a library can provide a better "Photoshop" feel.
3.  **State Sharing**: The state (map composition) needs to be shared between `MapStudio` and `CreateAlert`. Use a Context or simply pass state if using a parent wrapper.
4.  **Transition**: The switch between the Form and the Studio should feel like a seamless app transition (e.g., using `AnimatePresence` from framer-motion), not a hard page reload.

---

## 6. Assets
-   **Base Map**: `/images/base-map.png`
-   **Overlays**: `/images/overlays/hebron.png` (and others as placeholders).

## 7. Final Vision
The user enters the "Map Studio", feels like an artist placing the warning exactly over the governorate, hits "Done", and sees their masterpiece embedded in the official alert form. This solves the alignment issue by giving the user total control.
