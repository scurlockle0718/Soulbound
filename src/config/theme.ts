// ============================================
// THEME CONFIGURATION
// Edit this file to customize colors, fonts, and styles
// ============================================

export const theme = {
  // MAIN COLOR PALETTE
  colors: {
    // Primary colors (used for buttons, highlights, active states)
    primary: '#4a90e2',
    primaryDark: '#7b68ee',
    
    // Accent colors
    gold: '#f5a623',
    red: '#ef4444',
    purple: '#7b68ee',
    blue: '#4a90e2',
    green: '#10b981',
    
    // Background colors
    bgDark: '#0f0f1e',
    bgMedium: '#1a1a2e',
    bgLight: '#16213e',
    
    // Text colors
    textPrimary: '#e8e8e8',
    textSecondary: '#a8a8b8',
    textMuted: '#6b6b7b',
    
    // Rarity colors (for items)
    rarity: {
      1: '#6b7280', // Common - Gray
      2: '#10b981', // Uncommon - Green
      3: '#3b82f6', // Rare - Blue
      4: '#a855f7', // Epic - Purple
      5: '#f59e0b', // Legendary - Gold
    },
    
    // Quest type colors
    questTypes: {
      main: '#f5a623',
      side: '#4a90e2',
      commission: '#10b981',
    },
  },

  // GRADIENTS
  gradients: {
    primary: 'from-[#4a90e2] to-[#7b68ee]',
    gold: 'from-[#e6be8a] to-[#d4a574]',
    purple: 'from-[#7b68ee] to-[#a855f7]',
    green: 'from-[#10b981] to-[#059669]',
  },

  // SPACING & SIZING
  spacing: {
    navHeight: '70px', // Bottom navigation height
    headerHeight: '80px', // Top header height
    cardPadding: '16px',
    screenPadding: '20px',
  },

  // BORDER RADIUS
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    xlarge: '20px',
  },

  // SHADOWS & EFFECTS
  effects: {
    cardShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    glowShadow: '0 0 20px rgba(74, 144, 226, 0.3)',
    borderOpacity: '0.1', // For border-white/10 style borders
  },

  // ANIMATIONS
  animations: {
    hoverScale: '1.02',
    pressScale: '0.98',
    transitionSpeed: '0.3s',
  },

  // DIFFICULTY INDICATORS
  difficulty: {
    colors: ['#10b981', '#3b82f6', '#f5a623', '#ef4444', '#dc2626'],
    labels: ['Easy', 'Medium', 'Hard', 'Very Hard', 'Extreme'],
  },

  // SCREEN DIMENSIONS (Samsung Galaxy S23 Ultra)
  dimensions: {
    width: '430px',
    height: '932px',
  },
};

// Helper function to get rarity color
export const getRarityColor = (rarity: number): string => {
  return theme.colors.rarity[rarity as keyof typeof theme.colors.rarity] || theme.colors.rarity[1];
};

// Helper function to get difficulty color
export const getDifficultyColor = (difficulty: number): string => {
  return theme.difficulty.colors[difficulty - 1] || theme.difficulty.colors[0];
};

// Helper function to get quest type color
export const getQuestTypeColor = (type: 'main' | 'side' | 'commission'): string => {
  return theme.colors.questTypes[type];
};