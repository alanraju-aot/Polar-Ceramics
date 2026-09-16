export const SAMPLE_ROOMS = [
  {
    id: 'living-hall',
    name: 'Grand Living Hall',
    category: 'Hall / Living Room',
    subtitle: 'High-ceiling architectural salon with panoramic bay windows',
    image: '/rooms/living-hall.jpg',
    defaultSurface: 'floor',
    // 6 Normalized boundary endpoints: 3 Top [P1, P2, P3] and 3 Bottom [P4, P5, P6]
    surfaces: {
      floor: {
        name: 'Main Living Floor',
        points: [
          { x: 0.12, y: 0.50 }, // P1: Top-Left
          { x: 0.50, y: 0.50 }, // P2: Top-Center
          { x: 0.88, y: 0.50 }, // P3: Top-Right
          { x: 0.94, y: 0.90 }, // P4: Bottom-Right
          { x: 0.50, y: 0.90 }, // P5: Bottom-Center
          { x: 0.06, y: 0.90 }  // P6: Bottom-Left
        ],
        defaultScale: 1.0,
        defaultRotation: 0,
        groutColor: '#C4C9D0',
        groutWidth: 2,
        blendMode: 'multiply',
        lightingIntensity: 0.78
      },
      wall: {
        name: 'Right Feature Wall',
        points: [
          { x: 0.84, y: 0.28 },
          { x: 0.92, y: 0.28 },
          { x: 1.00, y: 0.28 },
          { x: 0.98, y: 0.54 },
          { x: 0.91, y: 0.54 },
          { x: 0.84, y: 0.54 }
        ],
        defaultScale: 0.8,
        defaultRotation: 0,
        groutColor: '#E2E8F0',
        groutWidth: 1.5,
        blendMode: 'multiply',
        lightingIntensity: 0.7
      }
    }
  },
  {
    id: 'luxury-bathroom',
    name: 'Master Luxury Bathroom',
    category: 'Bathroom & Spa',
    subtitle: 'Modern master bath with freestanding tub and cove lighting',
    image: '/rooms/luxury-bathroom.jpg',
    defaultSurface: 'floor',
    supportsSanitary: true,
    surfaces: {
      floor: {
        name: 'Bathroom Floor',
        points: [
          { x: 0.04, y: 0.60 }, // P1: Top-Left
          { x: 0.50, y: 0.60 }, // P2: Top-Center
          { x: 0.96, y: 0.60 }, // P3: Top-Right
          { x: 0.94, y: 0.90 }, // P4: Bottom-Right
          { x: 0.50, y: 0.90 }, // P5: Bottom-Center
          { x: 0.06, y: 0.90 }  // P6: Bottom-Left
        ],
        defaultScale: 0.9,
        defaultRotation: 0,
        groutColor: '#9CA3AF',
        groutWidth: 2,
        blendMode: 'multiply',
        lightingIntensity: 0.85
      },
      wall: {
        name: 'Walk-In Shower Accent Wall',
        points: [
          { x: 0.02, y: 0.18 },
          { x: 0.14, y: 0.18 },
          { x: 0.27, y: 0.18 },
          { x: 0.27, y: 0.84 },
          { x: 0.14, y: 0.84 },
          { x: 0.02, y: 0.84 }
        ],
        defaultScale: 0.7,
        defaultRotation: 0,
        groutColor: '#CBD5E1',
        groutWidth: 1.5,
        blendMode: 'multiply',
        lightingIntensity: 0.8
      }
    }
  },
  {
    id: 'modern-kitchen',
    name: 'Contemporary Kitchen',
    category: 'Kitchen & Dining',
    subtitle: 'Chef kitchen with waterfall island counter & pendant glows',
    image: '/rooms/modern-kitchen.jpg',
    defaultSurface: 'floor',
    surfaces: {
      floor: {
        name: 'Kitchen Main Floor',
        points: [
          { x: 0.02, y: 0.54 }, // P1: Top-Left
          { x: 0.49, y: 0.54 }, // P2: Top-Center
          { x: 0.96, y: 0.54 }, // P3: Top-Right
          { x: 0.94, y: 0.90 }, // P4: Bottom-Right
          { x: 0.50, y: 0.90 }, // P5: Bottom-Center
          { x: 0.06, y: 0.90 }  // P6: Bottom-Left
        ],
        defaultScale: 1.1,
        defaultRotation: 0,
        groutColor: '#D1D5DB',
        groutWidth: 2,
        blendMode: 'multiply',
        lightingIntensity: 0.82
      }
    }
  },
  {
    id: 'master-bedroom',
    name: 'Executive Bedroom Suite',
    category: 'Bedroom Suite',
    subtitle: 'Dusk balcony view with warm lighting and king suite',
    image: '/rooms/master-bedroom.jpg',
    defaultSurface: 'floor',
    surfaces: {
      floor: {
        name: 'Bedroom Lounge Floor',
        points: [
          { x: 0.02, y: 0.58 }, // P1: Top-Left
          { x: 0.38, y: 0.58 }, // P2: Top-Center
          { x: 0.74, y: 0.58 }, // P3: Top-Right
          { x: 0.72, y: 0.90 }, // P4: Bottom-Right
          { x: 0.36, y: 0.90 }, // P5: Bottom-Center
          { x: 0.06, y: 0.90 }  // P6: Bottom-Left
        ],
        defaultScale: 1.0,
        defaultRotation: 0,
        groutColor: '#B0B8C1',
        groutWidth: 2,
        blendMode: 'multiply',
        lightingIntensity: 0.88
      }
    }
  },
  {
    id: 'customer-demo-room',
    name: 'Customer Upload Demo Room',
    category: 'Custom Upload Preview',
    subtitle: 'Simulated customer room photo showing how custom upload works',
    image: '/rooms/customer-sample-room.svg',
    defaultSurface: 'floor',
    isDemoUpload: true,
    surfaces: {
      floor: {
        name: 'Target Floor Area',
        points: [
          { x: 0.04, y: 0.56 }, // P1: Top-Left
          { x: 0.50, y: 0.56 }, // P2: Top-Center
          { x: 0.96, y: 0.56 }, // P3: Top-Right
          { x: 0.94, y: 0.90 }, // P4: Bottom-Right
          { x: 0.50, y: 0.90 }, // P5: Bottom-Center
          { x: 0.06, y: 0.90 }  // P6: Bottom-Left
        ],
        defaultScale: 1.0,
        defaultRotation: 0,
        groutColor: '#E2E8F0',
        groutWidth: 2,
        blendMode: 'multiply',
        lightingIntensity: 0.85
      }
    }
  }
];

export const DEFAULT_CUSTOMER_POINTS = [
  { x: 0.08, y: 0.56 }, // P1: Top-Left
  { x: 0.50, y: 0.56 }, // P2: Top-Center
  { x: 0.92, y: 0.56 }, // P3: Top-Right
  { x: 0.94, y: 0.90 }, // P4: Bottom-Right
  { x: 0.50, y: 0.90 }, // P5: Bottom-Center
  { x: 0.06, y: 0.90 }  // P6: Bottom-Left
];
