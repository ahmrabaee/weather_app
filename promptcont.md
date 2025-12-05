# Interactive Palestine Map - Implementation Guide

## 🎯 Core Requirements

**Map Source:** `public/images/final-map.png`
- Container: 100% width, min-height 500px (300px mobile)
- Border: 1px solid #E5E7EB, radius: 12px
- Shadow: 0 2px 8px rgba(0,0,0,0.1)
- Background: linear-gradient(135deg, #F8F9FA, #E9ECEF)

---

## 🔍 Zoom & Pan

### Zoom Controls (Top-right corner)
```
Buttons: 36px × 36px, white background, 1px border #D1D5DB
├─ Zoom In (+): Increase 20%, max 300%
├─ Zoom Out (-): Decrease 20%, min 100%
└─ Reset (⌂): Return to 100%

Additional:
- Mouse wheel: ±10% zoom
- Touch: Pinch to zoom, double-tap for 200%
- Transitions: 300ms ease-in-out
```

### Pan/Drag
- Enabled when zoom > 100%
- Cursor: grab → grabbing
- Touch: Single-finger drag
- Prevent dragging beyond boundaries

---

## 🎯 Manual Marker Placement (CRITICAL)

### Create/Edit Alert Page ONLY

**User Flow:**
1. Select alert level (Yellow/Orange/Red) from form
2. Click **anywhere** on map → Marker appears at **exact pixel**
3. Click existing marker → Remove it
4. "Clear All Markers" button → Remove all

**Marker Specifications:**
```css
Yellow (16px): #FFC107, border: 2px #FFD54F, pulse: 2s
Orange (20px): #FF9800, border: 2px #FFB74D, pulse: 1.5s
Red (24px): #DC2626, border: 3px #EF4444, pulse: 1s, icon: ⚠

All markers:
- Position: Exact click coordinates (stored as x%, y%)
- Glow: Multi-layer box-shadow
- Animation: scale(1 → 1.3), opacity(0.8 → 1)
- Placement animation: scale(0 → 1) over 300ms
- Hover: scale(1.1), cursor: pointer
- Click: Remove marker
```

**State Management:**
```javascript
markers: [
  { id: string, x: percentage, y: percentage, level: 'yellow'|'orange'|'red' }
]

// Click handler
onClick(event) {
  const rect = map.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  
  // Check if clicking existing marker → remove
  // Otherwise → add new marker at (x, y) with current alert level
}
```

**UI Elements:**
- Cursor: crosshair (default), pointer (over marker)
- Instructions: "Click on the map to place alert markers"
- Clear button below map
- Map border pulses briefly when marker placed

**IMPORTANT:** 
- Governorate selection (Ramallah, Jericho, etc.) is for **filtering/organization ONLY**
- Does NOT place markers automatically
- Markers are ONLY placed by manual clicks

---

## 🗺️ Map Usage Per Page

### Page 3: Create/Edit Alert
- **Size:** 60% width, 450px height
- **Features:** Zoom, pan, manual marker placement
- **Behavior:** Interactive marker placement as described above

### Page 7: Public Alert View
- **Size:** 100% width, 500px height
- **Features:** Zoom, pan, display saved markers (read-only)
- **Behavior:** Load and display markers at saved coordinates, no editing

### Header Mini-Map (Pages 5, 6, 8)
- **Size:** 120px × 100px, top-right of header
- **Features:** Static preview, small colored dots for active alerts
- **Behavior:** Click → Navigate to full map view

---

## 🎨 Animations & Styles

### Pulse Keyframes
```css
@keyframes alertPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
    box-shadow: 0 0 10px [color], 0 0 20px [color], 0 0 30px [color];
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
    box-shadow: 0 0 20px [color], 0 0 40px [color], 0 0 60px [color], 0 0 80px [color];
  }
}

/* Apply with different durations per level */
.marker-yellow { animation: yellowPulse 2s infinite; }
.marker-orange { animation: orangePulse 1.5s infinite; }
.marker-red { animation: redPulse 1s infinite; }
```

### Marker Placement Animation
```css
.marker-enter {
  animation: markerAppear 300ms ease-out;
}

@keyframes markerAppear {
  from { opacity: 0; transform: scale(0); }
  to { opacity: 1; transform: scale(1); }
}
```

---

## 📱 Responsive Design

| Breakpoint | Zoom Controls | Map Height | Marker Size |
|------------|---------------|------------|-------------|
| Desktop (≥1024px) | 36px buttons | 500px | 16-24px |
| Tablet (768-1023px) | 30px buttons | 400px | 14-20px |
| Mobile (<768px) | 44px buttons (bottom-right) | 300px | 12-18px |

---

## 🛠️ Component Props

```typescript
interface InteractivePalestineMapProps {
  mode: 'edit' | 'view' | 'mini';
  markers?: Array<{ x: number, y: number, level: string }>;
  onMarkersChange?: (markers: Array) => void;
  selectedAlertLevel?: 'yellow' | 'orange' | 'red';
  enableZoom?: boolean;
  enablePan?: boolean;
  enableMarkerPlacement?: boolean;
  height?: string;
}

// State
{
  currentZoom: 100-300,
  panOffset: { x, y },
  markers: Array,
  hoveredMarker: string | null,
  isDragging: boolean
}
```

---

## ⚡ Performance

- Use CSS transforms for zoom/pan (GPU accelerated)
- Debounce mouse wheel (100ms)
- Throttle pan events (60fps)
- Lazy load map image
- Memoize marker positions

---

## ✅ Success Criteria Checklist

Map component is complete when:

- [ ] Zoom in/out works smoothly (100%-300%)
- [ ] Pan/drag works when zoomed
- [ ] Click anywhere on map places marker at exact position
- [ ] Marker color/size matches selected alert level
- [ ] Click existing marker removes it
- [ ] "Clear All Markers" button works
- [ ] Markers pulse with correct animation and speed
- [ ] Governorate selection does NOT place markers
- [ ] Markers stored as coordinates (x%, y%, level)
- [ ] Public view displays markers at exact saved positions
- [ ] Mini-map in header (pages 5, 6, 8)
- [ ] Mobile touch gestures work
- [ ] No yellow tinted overlay on regions
- [ ] Performance smooth (60fps)

---

## 📝 Key Points

**DO:**
✅ Place markers by clicking map (exact pixel)
✅ Store coordinates as percentages (responsive)
✅ Allow unlimited markers per alert
✅ Pulse markers based on severity
✅ Separate governorate selection from marker placement

**DON'T:**
❌ Auto-place markers when selecting governorates
❌ Use yellow tinted overlay on regions
❌ Restrict number of markers
❌ Place markers at predefined region centers (user controls exact position)

---

**END OF SPECIFICATION**
