import React from 'react';
import { THEME } from '../constants/theme';

/**
 * Layout Dashboard Reusable untuk Admin, Kajur, dan Mahasiswa
 * Menyatukan: Sidebar, Header, dan content area dengan styling konsisten
 */

const DashboardLayout = ({ 
  sidebar,
  title,
  subtitle,
  children,
  userInfo = null,
  showHeader = true,
  headerActions = null,
}) => {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: THEME.colors.bgLight,
      fontFamily: THEME.typography.fontFamily,
    }}>
      {/* SIDEBAR */}
      {sidebar}

      {/* MAIN CONTENT */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* HEADER (OPTIONAL) */}
        {showHeader && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: `${THEME.spacing.lg} ${THEME.spacing.xl}`,
            borderBottom: `1px solid ${THEME.colors.border}`,
            backgroundColor: THEME.colors.white,
            height: THEME.layout.headerHeight,
            boxShadow: THEME.shadows.sm,
          }}>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: THEME.typography.h2.fontSize,
                fontWeight: THEME.typography.h2.fontWeight,
                color: THEME.colors.darkText,
              }}>
                {title}
              </h1>
              {subtitle && (
                <p style={{
                  margin: `${THEME.spacing.sm} 0 0 0`,
                  fontSize: THEME.typography.bodySmall.fontSize,
                  color: THEME.colors.secondary,
                }}>
                  {subtitle}
                </p>
              )}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: THEME.spacing.lg,
            }}>
              {userInfo && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  paddingRight: THEME.spacing.lg,
                  borderRight: `1px solid ${THEME.colors.border}`,
                }}>
                  <div style={{
                    fontSize: THEME.typography.bodySmall.fontSize,
                    color: THEME.colors.secondary,
                  }}>
                    Selamat Datang
                  </div>
                  <div style={{
                    fontSize: THEME.typography.h5.fontSize,
                    fontWeight: THEME.typography.h5.fontWeight,
                    color: THEME.colors.darkText,
                  }}>
                    {userInfo.nama}
                  </div>
                </div>
              )}
              {headerActions}
            </div>
          </div>
        )}

        {/* CONTENT AREA */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: THEME.spacing.xxl,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
