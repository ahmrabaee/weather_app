# LOVABLE AI PROMPT: Create Alert Page - Complete Specification

## PROJECT OVERVIEW
You are building a **government Early Warning System** for Palestine. This is an official, formal application used by meteorology departments to create and manage weather/hazard alerts. The design must be professional, authoritative, and trustworthy.

---

## CRITICAL DESIGN PRINCIPLES

### 1. COLOR PALETTE
**PRIMARY COLORS (Government Navy Blue):**
```css
--primary: hsl(213, 50%, 24%);           /* Navy Blue - Main Brand Color */
--primary-foreground: hsl(210, 40%, 98%); /* Near White for text on navy */
--background: hsl(210, 25%, 97%);         /* Light gray background */
--foreground: hsl(220, 20%, 15%);         /* Dark text */
```

**ALERT LEVEL COLORS:**
```css
--alert-yellow: hsl(45, 100%, 51%);   /* #FFC107 - Yellow Warning */
--alert-orange: hsl(33, 100%, 50%);   /* #FF9800 - Orange Alert */
--alert-red: hsl(0, 84%, 50%);        /* #DC2626 - Red Critical */
```

**USAGE RULES:**
- Site header MUST use `bg-primary` (navy blue)
- All primary buttons use navy blue gradient
- Map Composition header MUST match site header exactly
- NO bright blues, NO light blues in headers
- Keep it formal and governmental

### 2. TYPOGRAPHY
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, 20-24px
- **Body**: Regular, 14-16px
- **Small text**: 12-13px
- **All text must be readable and professional**

### 3. LAYOUT STRUCTURE
```
┌─────────────────────────────────────────────┐
│  Header (Navy Blue, 72px height)            │
├─────────────────────────────────────────────┤
│  Page Title: "Create Alert"                 │
├─────────────────────────────────────────────┤
│  Quick Hazard Type Templates (3 cards)      │
├─────────────────────────────────────────────┤
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  MAP COMPOSITION SECTION               │ │
│  │  (Full width, integrated editor)       │ │
│  │                                         │ │
│  │  Header: Navy Blue (matches site)      │ │
│  │  - Title: "Map Composition"            │ │
│  │  - Layer count badge                   │ │
│  │  - Mode toggle button (Edit/Preview)   │ │
│  │                                         │ │
│  │  ┌──────────┬─────────────────────┐   │ │
│  │  │ Sidebar  │   Map Canvas        │   │ │
│  │  │ (Navy)   │   (600x917px)       │   │ │
│  │  │ - Search │   - Zoom controls   │   │ │
│  │  │ - Tabs   │   - Layers          │   │ │
│  │  │ - Assets │   - Moveable boxes │   │ │
│  │  └──────────┴─────────────────────┘   │ │
│  └────────────────────────────────────────┘ │
│                                              │
├─────────────────────────────────────────────┤
│  Form Sections:                              │
│  - Basic Information                         │
│  - Technical Description                     │
│  - Public Advice                             │
│  - Sector Recommendations                    │
├─────────────────────────────────────────────┤
│  Action Buttons (Bottom)                     │
└─────────────────────────────────────────────┘
```

---

## SECTION 1: QUICK HAZARD TEMPLATES

### Design
- 3 large cards in a grid (responsive: 3 cols desktop, 1 col mobile)
- Each card: 
  - Icon at top (48x48px, light background circle)
  - Hazard name below icon
  - Subtitle: "Select hazard type"
  - Hover: slight scale and shadow
  - Click: selects hazard type and scrolls to form

### Hazard Types
1. **Heatwave** - Icon: Flame
2. **Flood** - Icon: Cloud with rain
3. **Soil Moisture** - Icon: Droplets

### Code Structure
```tsx
<div className="grid md:grid-cols-3 gap-6 mb-8">
  {HAZARD_TEMPLATES.map(template => (
    <button 
      onClick={() => selectHazard(template.type)}
      className="gov-card hover:shadow-lg transition-all p-6"
    >
      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <template.icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-semibold text-lg">{template.label}</h3>
      <p className="text-sm text-muted-foreground">Select hazard type</p>
    </button>
  ))}
</div>
```

---

## SECTION 2: MAP COMPOSITION (CRITICAL SECTION)

### OVERVIEW
This is the MOST IMPORTANT section. It allows users to visually compose alert maps by placing colored overlays (governorate shapes) on a base map of Palestine.

### PROBLEMS WE FACED & SOLUTIONS

#### Problem 1: Coordinate Mismatch
**Issue**: Layers appeared in different positions between Studio and Preview
**Root Cause**: Different container dimensions and coordinate systems
**Solution**: 
- Use FIXED 600x917px container (matches base-map.png aspect ratio)
- Store coordinates as percentages relative to 600x917
- Convert to pixels only for rendering

#### Problem 2: Moveable Drift
**Issue**: When dragging layers, they "slid" away from cursor
**Root Cause**: Moveable expected pixel coordinates but got percentages
**Solution**:
- Render layers with pixel-based positioning
- Pass `zoom` prop to Moveable
- Use exact bounds: `{left: 0, top: 0, right: 600, bottom: 917}`

#### Problem 3: Zoom Overflow
**Issue**: When zooming in, map covered the header
**Root Cause**: No overflow containment
**Solution**:
- Header: `z-index: 30`
- Canvas container: `max-height: 600px` + `overflow: hidden`
- Nested wrapper: `style={{ maxWidth: '100%', maxHeight: '100%' }}`

#### Problem 4: Aspect Ratio
**Issue**: Base map is 5999x9177px but we assumed 600x800
**Solution**: Calculate correct height: `917px` (5999/9177 * 600)

---

### MAP COMPOSITION HEADER

**CRITICAL**: Must match site header EXACTLY in color

```tsx
<div className="bg-primary text-primary-foreground p-6 border-b border-primary/20 z-30">
  <div className="flex items-center justify-between">
    {/* Left: Icon + Title */}
    <div className="flex items-center gap-4">
      {/* Simple grid icon */}
      <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center">
        <svg className="w-6 h-6 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
        </svg>
      </div>
      
      <div>
        <h3 className="text-xl font-bold flex items-center gap-2">
          Map Composition
          <span className="px-2 py-0.5 bg-primary-foreground/20 rounded-full text-xs border border-primary-foreground/30">
            {layerCount} layers
          </span>
        </h3>
        <p className="text-primary-foreground/80 text-sm">
          {isEditing ? "Edit mode - Position layers on the map" : "Preview mode - View final composition"}
        </p>
      </div>
    </div>

    {/* Right: Mode Toggle */}
    <button
      onClick={toggleMode}
      className={`px-5 py-2.5 rounded-xl font-semibold ${
        isEditing 
          ? "bg-primary-foreground text-primary" 
          : "border-2 border-primary-foreground bg-primary-foreground/10 text-primary-foreground animate-pulse"
      }`}
    >
      {isEditing ? <Eye /> : <Edit3 />}
      {isEditing ? "Preview" : "Edit Map"}
    </button>
  </div>
</div>
```

**RULES:**
- NO emojis (🎨 ❌, 👁️ ❌) - this is a formal government system
- Background: `bg-primary` (exact match to site header)
- Text: `text-primary-foreground`
- NO gradients, NO bright colors
- Layer count badge: semi-transparent white
- Toggle button: white background when editing, transparent with border when in preview

---

### EDIT MODE LAYOUT

```tsx
<div className="flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
  {/* Sidebar: 320px wide */}
  <div className="w-80 bg-primary border-r border-primary/20">
    {/* Search */}
    <div className="p-4 border-b border-primary-foreground/20">
      <input 
        placeholder="Search governorates..."
        className="w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg px-3 py-2 text-primary-foreground"
      />
    </div>

    {/* Level Tabs */}
    <div className="flex p-1 bg-primary-foreground/10">
      <button className="flex-1 py-1.5 rounded">Yellow</button>
      <button className="flex-1 py-1.5 rounded">Orange</button>
      <button className="flex-1 py-1.5 rounded">Red</button>
    </div>

    {/* Asset List */}
    <div className="p-4 space-y-2 overflow-y-auto">
      {governorates.map(gov => (
        <button
          onClick={() => addLayer(gov.id, selectedLevel)}
          className="w-full p-3 bg-slate-800 rounded-lg hover:bg-slate-700"
        >
          <img src={gov.preview} className="w-full h-20 object-contain" />
          <p className="mt-2 text-sm text-white">{gov.name}</p>
        </button>
      ))}
    </div>
  </div>

  {/* Canvas Area */}
  <div className="flex-1 p-8 min-h-[600px] max-h-[600px] overflow-hidden flex items-center justify-center">
    {/* Dot pattern background */}
    <div className="absolute inset-0 opacity-20" style={{
      backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
      backgroundSize: '24px 24px'
    }} />

    {/* CRITICAL: Nested overflow container */}
    <div className="overflow-hidden" style={{ maxWidth: '100%', maxHeight: '100%' }}>
      {/* Map Container: EXACTLY 600x917px */}
      <div className="relative bg-white shadow-2xl" style={{
        width: '600px',
        height: '917px',
        transform: `scale(${zoom})`,
        transformOrigin: 'center'
      }}>
        {/* Base Map */}
        <img src="/images/base-map.png" className="w-full h-full" />

        {/* Layers */}
        {layers.map(layer => (
          <div
            key={layer.id}
            id={layer.id}
            onClick={() => selectLayer(layer.id)}
            className="absolute cursor-move"
            style={{
              left: `${(layer.x / 100) * 600}px`,
              top: `${(layer.y / 100) * 917}px`,
              width: `${(layer.width / 100) * 600}px`,
              transform: `rotate(${layer.rotation}deg)`,
              opacity: layer.opacity
            }}
          >
            <div style={{
              width: '100%',
              aspectRatio: '1/1',
              maskImage: `url(${layer.src})`,
              maskSize: 'contain',
              backgroundColor: layer.level === 'yellow' ? '#FFC107' : 
                              layer.level === 'orange' ? '#FF9800' : '#DC2626',
              opacity: 0.9
            }} />
          </div>
        ))}

        {/* Move able Controller */}
        {selectedLayer && (
          <Moveable
            target={document.getElementById(selectedLayer.id)}
            zoom={zoom}
            draggable
            resizable
            rotatable
            keepRatio
            bounds={{ left: 0, top: 0, right: 600, bottom: 917 }}
            onDragEnd={({ target }) => {
              const left = parseFloat(target.style.left);
              const top = parseFloat(target.style.top);
              updateLayer(selectedLayer.id, {
                x: (left / 600) * 100,
                y: (top / 917) * 100
              });
            }}
            onResizeEnd={({ target, width }) => {
              updateLayer(selectedLayer.id, {
                width: (width / 600) * 100
              });
            }}
          />
        )}

        {/* Zoom Toolbar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-slate-900/90 backdrop-blur px-3 py-2 rounded-full">
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>
            <ZoomOut />
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.1))}>
            <ZoomIn />
          </button>
          <button onClick={() => setZoom(1)}>
            <Maximize />
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

### PREVIEW MODE

Shows the final map composition with Alert Level Legend overlay

```tsx
<div className="relative bg-slate-50 p-8 min-h-[600px] max-h-[600px] overflow-hidden flex items-center justify-center">
  <div className="relative w-full max-w-2xl">
    {/* Read-only map */}
    <div className="relative bg-white shadow-2xl" style={{ width: '600px', height: '917px' }}>
      <img src="/images/base-map.png" />
      {/* Render layers (same as edit mode but no Moveable) */}
    </div>

    {/* Alert Level Legend - Overlay */}
    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl border-2 backdrop-blur-xl bg-white/90 shadow-2xl"
         style={{
           borderColor: level === 'red' ? '#DC2626' : 
                       level === 'orange' ? '#FF9800' : '#FFC107'
         }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full" style={{
          backgroundColor: level === 'red' ? '#DC2626' : 
                          level === 'orange' ? '#FF9800' : '#FFC107'
        }} />
        <span className="font-semibold text-sm">Alert Level Legend</span>
      </div>
      <p className="text-sm text-slate-700">
        {HAZARD_LEGENDS[hazardType][level].description}
      </p>
      <div className="mt-2 pt-2 border-t flex gap-4 text-xs text-slate-600">
        <div><strong>Hazard:</strong> {hazardType}</div>
        <div><strong>Level:</strong> {level}</div>
      </div>
    </div>
  </div>
</div>
```

---

## SECTION 3: FORM SECTIONS

### Basic Information
```tsx
<div className="gov-card space-y-4">
  <h3 className="font-semibold text-lg border-b pb-2">Basic Information</h3>
  
  {/* Hazard Type */}
  <Select value={hazardType} onValueChange={setHazardType}>
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="heatwave">Heatwave</SelectItem>
      <SelectItem value="flood">Flood</SelectItem>
      <SelectItem value="storm">Storm</SelectItem>
    </SelectContent>
  </Select>

  {/* Alert Level */}
  <Select value={level} onValueChange={setLevel}>
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="yellow">Yellow (Be Cautious)</SelectItem>
      <SelectItem value="orange">Orange (Be Prepared)</SelectItem>
      <SelectItem value="red">Red (Take Action)</SelectItem>
    </SelectContent>
  </Select>

  {/* Title (English) */}
  <Input placeholder="Alert Title (English)" value={titleEn} onChange={e => setTitleEn(e.target.value)} />

  {/* Title (Arabic) */}
  <Input placeholder="عنوان التنبيه (عربي)" value={titleAr} onChange={e => setTitleAr(e.target.value)} dir="rtl" />

  {/* Validity Period */}
  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label>Valid From</Label>
      <Input type="datetime-local" value={validFrom} onChange={e => setValidFrom(e.target.value)} />
    </div>
    <div>
      <Label>Valid To</Label>
      <Input type="datetime-local" value={validTo} onChange={e => setValidTo(e.target.value)} />
    </div>
  </div>

  {/* Affected Areas */}
  <div>
    <Label>Affected Areas</Label>
    <div className="grid grid-cols-3 gap-2 mt-2">
      {AREAS.map(area => (
        <label className="flex items-center gap-2">
          <Checkbox 
            checked={affectedAreas.includes(area)}
            onCheckedChange={() => toggleArea(area)}
          />
          <span className="text-sm">{area}</span>
        </label>
      ))}
    </div>
  </div>
</div>
```

### Technical Description
```tsx
<div className="gov-card space-y-4">
  <h3 className="font-semibold text-lg border-b pb-2">Technical Description</h3>
  
  <div>
    <Label>Description (English)</Label>
    <Textarea 
      placeholder="Detailed technical description in English..."
      rows={4}
      value={technicalDescEn}
      onChange={e => setTechnicalDescEn(e.target.value)}
    />
  </div>

  <div>
    <Label>الوصف التقني (عربي)</Label>
    <Textarea 
      placeholder="وصف تقني مفصل بالعربية..."
      rows={4}
      value={technicalDescAr}
      onChange={e => setTechnicalDescAr(e.target.value)}
      dir="rtl"
    />
  </div>
</div>
```

### Public Advice
```tsx
<div className="gov-card space-y-4">
  <h3 className="font-semibold text-lg border-b pb-2">Public Advice</h3>
  
  <div>
    <Label>Advice (English)</Label>
    <Textarea 
      placeholder="Public safety advice in English..."
      rows={4}
      value={publicAdviceEn}
      onChange={e => setPublicAdviceEn(e.target.value)}
    />
  </div>

  <div>
    <Label>النصائح العامة(عربي)</Label>
    <Textarea 
      placeholder="نصائح السلامة العامة بالعربية..."
      rows={4}
      value={publicAdviceAr}
      onChange={e => setPublicAdviceAr(e.target.value)}
      dir="rtl"
    />
  </div>
</div>
```

---

## SECTION 4: TECHNICAL REQUIREMENTS

### Dependencies
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "react-moveable": "^0.54.0",
  "@radix-ui/react-select": "^2.0.0",
  "@radix-ui/react-checkbox": "^1.0.4",
  "lucide-react": "^0.300.0",
  "sonner": "^1.3.0",
  "tailwindcss": "^3.4.0"
}
```

### State Management
```tsx
interface MapLayer {
  id: string;
  assetId: string;  // e.g., 'hebron'
  level: 'yellow' | 'orange' | 'red';
  src: string;  // path to overlay image
  x: number;    // percentage 0-100
  y: number;    // percentage 0-100
  width: number;   // percentage 0-100
  height: number;  // auto or percentage
  rotation: number; // degrees
  opacity: number;  // 0-1
}

interface FormData {
  hazardType: string;
  level: 'yellow' | 'orange' | 'red';
  titleEn: string;
  titleAr: string;
  validFrom: string; // ISO datetime
  validTo: string;
  affectedAreas: string[];
  technicalDescEn: string;
  technicalDescAr: string;
  publicAdviceEn: string;
  publicAdviceAr: string;
  sectorRecommendations: Record<string, string>;
}
```

### Mouse Wheel Zoom
```tsx
useEffect(() => {
  const handleWheel = (e: WheelEvent) => {
    if (containerRef.current?.contains(e.target as Node)) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(z => Math.max(0.5, Math.min(2, z + delta)));
    }
  };
  const container = containerRef.current;
  if (container) {
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }
}, []);
```

---

## SECTION 5: STYLING GUIDELINES

### Government Card
```css
.gov-card {
  background: white;
  border-radius: 12px;
  border: 1px solid hsl(214, 32%, 91%);
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.gov-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.gov-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 16px;
  height: 16px;
  border-top-left-radius: 12px;
  background: linear-gradient(135deg, hsl(213, 50%, 24%, 0.1), transparent);
}
```

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, hsl(213, 50%, 24%), hsl(213, 45%, 32%));
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
}
```

---

## SECTION 6: ACTION BUTTONS

At the bottom of the page:

```tsx
<div className="flex justify-end gap-4 sticky bottom-0 bg-background/95 backdrop-blur p-4 border-t">
  {/* Save as Draft */}
  <Button variant="outline" onClick={() => handleSubmit(true)}>
    <FileText className="w-4 h-4 mr-2" />
    Save as Draft
  </Button>

  {/* Preview */}
  <Button variant="outline" onClick={() => setShowPreview(true)}>
    <Eye className="w-4 h-4 mr-2" />
    Preview
  </Button>

  {/* Submit for Approval */}
  <Button className="btn-primary" onClick={() => handleSubmit(false)}>
    <Send className="w-4 h-4 mr-2" />
    Submit for Approval
  </Button>
</div>
```

---

## CRITICAL IMPLEMENTATION NOTES

### DO:
✅ Use `bg-primary` for Map Composition header (matches site header)
✅ Fixed 600x917px map container
✅ Store coordinates as percentages
✅ Pass `zoom` prop to Moveable
✅ Add `overflow: hidden` to prevent zoom overflow
✅ Use Inter font
✅ Keep design formal and professional
✅ Support Arabic (RTL) text inputs
✅ Add mouse wheel zoom support
✅ Show Moveable controls immediately on layer selection

### DON'T:
❌ Use bright blue or light blue in headers
❌ Add emojis or decorative elements
❌ Use different aspect ratios
❌ Forget the z-index on header
❌ Use percentage-based positioning for Moveable
❌ Allow map to overflow outside container

---

## EXPECTED BEHAVIOR

1. **On Page Load**: Show hazard type templates
2. **Click Template**: Scroll to form, pre-select hazard type
3. **Map Composition**:
   - Default: Preview mode
   - Click "Edit Map": Show sidebar + canvas
   - Click governorate in sidebar: Add layer to map
   - Layer appears with Moveable controls immediately
   - Drag/resize/rotate layer
   - Zoom with mouse wheel or buttons
   - Map stays within bounds
4. **Click "Preview"**: Hide sidebar, show final map with legend
5. **Fill Form**: Complete all required fields
6. **Submit**: Validate and create alert

---

## ACCESSIBILITY

- All interactive elements must have proper focus states
- Form inputs must have labels
- Color combinations must meet WCAG AA standards
- Support keyboard navigation
- Toast notifications for success/error states

---

## RESPONSIVE DESIGN

- Desktop (>1024px): Full 3-column layout
- Tablet (768-1024px): Stack sections vertically
- Mobile (<768px): Single column, touch-friendly buttons

---

## ERROR HANDLING

- Show validation errors inline
- Required fields: Title (EN), Hazard Type, Level, Valid From/To, At least 1 Affected Area
- Prevent submission if required fields missing
- Toast notifications for success/error

---

## FILE STRUCTURE

```
src/
├── pages/
│   └── CreateAlert.tsx          (Main page)
├── components/
│   ├── Header.tsx               (Site header)
│   ├── MapStudio/
│   │   ├── StudioSidebar.tsx   (Governorate list)
│   │   └── StudioCanvas.tsx    (Map canvas + Moveable)
│   └── ui/                      (shadcn components)
├── types/
│   ├── alert.ts
│   └── mapStudio.ts
├── contexts/
│   └── AppContext.tsx
└── index.css                    (Global styles)
```

---

## FINAL CHECKLIST

- [ ] Navy blue header matching site
- [  ] No emojis in professional UI
- [ ] 600x917px map container
- [ ] Percentage-based coordinate storage
- [ ] Pixel-based rendering for Moveable
- [ ] Zoom overflow prevention
- [ ] Mouse wheel zoom
- [ ] Immediate Moveable on layer select
- [ ] Formal, governmental design
- [ ] Arabic RTL support
- [ ] Responsive layout
- [ ] Form validation
- [ ] Toast notifications

---

**TOTAL LINES: 650+**

This prompt provides everything needed to rebuild the Create Alert page with all the fixes and proper design. Generate the page following these specifications exactly.
