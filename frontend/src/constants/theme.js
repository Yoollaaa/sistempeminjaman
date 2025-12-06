/**
 * Theme & Design System
 * Unified styling untuk semua role (Admin, Kajur, Mahasiswa)
 */

export const THEME = {
  // === COLORS ===
  colors: {
    // Primary & Secondary
    primary: '#0ea5e9',       // Sky Blue - untuk aksi utama
    primaryHover: '#0284c7',  // Biru lebih gelap untuk hover
    primaryLight: '#e0f2fe',  // Biru sangat muda
    
    secondary: '#64748b',     // Abu-abu untuk teks sekunder
    darkText: '#0f172a',      // Teks utama gelap
    lightText: '#475569',     // Teks lebih terang
    
    // Status Colors
    success: '#10b981',
    successLight: '#dcfce7',
    successDark: '#166534',
    
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    warningDark: '#d97706',
    
    danger: '#ef4444',
    dangerLight: '#fee2e2',
    dangerDark: '#991b1b',
    
    info: '#0284c7',
    infoLight: '#e0f2fe',
    
    // Backgrounds & Borders
    white: '#ffffff',
    bgLight: '#f8fafc',
    bgLighter: '#f1f5f9',
    border: '#e2e8f0',
    borderDark: '#cbd5e1',
  },

  // === TYPOGRAPHY ===
  typography: {
    fontFamily: "'Inter', sans-serif",
    
    // Heading
    h1: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3 },
    h3: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
    h4: { fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
    
    // Body
    body: { fontSize: '0.95rem', fontWeight: 400, lineHeight: 1.6 },
    bodySmall: { fontSize: '0.85rem', fontWeight: 400, lineHeight: 1.5 },
    bodyXSmall: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.4 },
    
    // Label
    label: { fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.4 },
    
    // Button
    button: { fontSize: '0.95rem', fontWeight: 600, lineHeight: 1 },
    buttonSmall: { fontSize: '0.85rem', fontWeight: 600 },
  },

  // === SPACING ===
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },

  // === BORDER RADIUS ===
  radius: {
    sm: '4px',
    md: '8px',
    lg: '10px',
    xl: '12px',
  },

  // === SHADOWS ===
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },

  // === LAYOUT ===
  layout: {
    sidebarWidth: '260px',
    headerHeight: '64px',
  },
};

// === UTILITY STYLES ===
export const getButtonStyles = (variant = 'primary', size = 'md') => {
  const baseStyles = {
    fontFamily: THEME.typography.fontFamily,
    fontWeight: 600,
    border: 'none',
    borderRadius: THEME.radius.md,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.sm,
  };

  const sizes = {
    sm: {
      padding: `${THEME.spacing.sm} ${THEME.spacing.md}`,
      fontSize: THEME.typography.buttonSmall.fontSize,
    },
    md: {
      padding: `${THEME.spacing.md} ${THEME.spacing.lg}`,
      fontSize: THEME.typography.button.fontSize,
    },
    lg: {
      padding: `${THEME.spacing.lg} ${THEME.spacing.xl}`,
      fontSize: THEME.typography.button.fontSize,
    },
  };

  const variants = {
    primary: {
      backgroundColor: THEME.colors.primary,
      color: THEME.colors.white,
      '&:hover': { backgroundColor: THEME.colors.primaryHover },
    },
    secondary: {
      backgroundColor: THEME.colors.bgLight,
      color: THEME.colors.darkText,
      border: `1px solid ${THEME.colors.border}`,
      '&:hover': { backgroundColor: THEME.colors.bgLighter },
    },
    danger: {
      backgroundColor: THEME.colors.danger,
      color: THEME.colors.white,
      '&:hover': { backgroundColor: '#dc2626' },
    },
  };

  return {
    ...baseStyles,
    ...sizes[size] || sizes.md,
    ...variants[variant] || variants.primary,
  };
};

export const getCardStyles = () => ({
  backgroundColor: THEME.colors.white,
  border: `1px solid ${THEME.colors.border}`,
  borderRadius: THEME.radius.lg,
  padding: THEME.spacing.xl,
  boxShadow: THEME.shadows.md,
});

export default THEME;
