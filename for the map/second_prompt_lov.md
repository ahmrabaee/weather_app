# Map Studio Rebuild Specification (High Precision & Premium UI)

## Context
We are building a National Early Warning System. The "Map Studio" is a critical workspace where meteorologists place weather warning layers (governorate shapes) over a base map of Palestine. 

## The Problem (CRITICAL - READ CAREFULLY)
Currently, there are major "Drift" and "Invalid Registration" issues:
1. **Drag-and-Drop Offset**: When dragging a layer at a zoom level, the layer "jumps" or offsets from the cursor on release. It doesn't stay exactly where dropped.
2. **Studio-to-Preview Mismatch**: After saving in Map Studio, the layer appears in a different position in the "Create Alert" preview map. This is likely due to inconsistent container sizes or incorrect percentage calculations between the workspace and the view-mode.

## Technical Requirements for the Fix
To solve this "Root and Branch" (جذرياً), you must implement a robust coordinate system:

1. **Normalized Coordinate System**:
   - Store all layer positions (`x`, `y`) and sizes (`width`) as **Percentages (0-100)** relative to the **Base Map Image's actual dimensions**, not the viewport or a random DIV.
   - Use a "Reference Container" that always maintains the exact aspect ratio of the base map image (e.g., if the image is 600x800, the container must always be 3:4 aspect ratio).

2. **Precision Canvas with `react-moveable`**:
   - Use `react-moveable` for transformation (drag, resize, rotate).
   - **Crucial**: Pass the current `zoom` level to the `Moveable` component's `zoom` prop to prevent coordinate drift during scaling.
   - All transformations must be calculated relative to the unscaled dimensions of the Reference Container and then stored as percentages.

3. **Rendering Consistency**:
   - The `MapComponent` (Preview) and `MapStudio` (Workspace) **MUST** use the exact same logic for rendering layers. 
   - Use `absolute` positioning with percentage values (`top: x%`, `left: y%`, `width: w%`) inside an aspect-ratio-locked container.

## Workspace UI/UX Design
- **Theme**: Premium "Command Center" aesthetic. Dark Slate/Navy palette (`slate-950`), Glassmorphism effects, and highly readable typography.
- **Official Atmosphere**: It should look like a professional government tool, not a toy.
- **Controls**:
  - **Sidebar**: High-quality asset library. Searchable list of governorates. 
  - **Layer Logic**: When a user selects a governorate (e.g., Hebron) and a color (Yellow/Orange/Red), use a `mask-image` approach to color the PNG asset dynamically.
  - **Toolbar**: Precision zoom (0.5x to 3x), Reset View, Undo/Redo (essential), and a prominent "Apply to Alert" button.

## Implementation Details (Starting Example)
- **Primary Asset**: Governorate of **Hebron** (Yellow Layer).
- **Base Map**: `/images/base-map.png`.
- **Logic**: Ensure the Hebron layer sits perfectly on its geographical location on the base map and stays there across different screen sizes and zoom levels.

## Success Criteria
- I can drag a layer at 200% zoom and it stays exactly under my mouse.
- When I save and go to the preview, the layer is in the **EXACT SAME PIXEL LOCATION** relative to the base map.
- The UI feels snappy, profesional, and authoritative.
