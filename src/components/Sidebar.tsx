import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const label = (text: string) =>
    collapsed ? null : <span className={styles.label}>{text}</span>;

  return (
    <aside
      className={styles.sidebar}
      style={{ width: collapsed ? "80px" : "255.99px" }}
    >
      <div className={styles.content}>
        <button
          type="button"
          onClick={() => navigate("/app")}
          className={`${styles.interactive} ${styles.logoButton}`}
          aria-label="Go to dashboard"
        >
          <div className={styles.logoIcon}>F</div>
          {!collapsed && <span className={styles.logoText}>Fluxora</span>}
        </button>

        <div className={styles.divider} />

        <nav className={styles.nav} aria-label="Sidebar navigation">
          <NavLink
            to="/app"
            end
            aria-label="Dashboard"
            className={({ isActive }) =>
              [
                styles.interactive,
                styles.interactiveCompact,
                styles.navLink,
                isActive ? styles.navLinkActive : "",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className={styles.activeBar} aria-hidden="true" />
                )}
                <svg
                  className={styles.icon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
                  <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
                  <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
                  <rect x="14" y="14" width="7" height="7" strokeWidth="2" />
                </svg>
                {label("Dashboard")}
              </>
            )}
          </NavLink>

          <NavLink
            to="/app/streams"
            aria-label="Streams"
            className={({ isActive }) =>
              [
                styles.interactive,
                styles.interactiveCompact,
                styles.navLink,
                isActive ? styles.navLinkActive : "",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className={styles.activeBar} aria-hidden="true" />
                )}
                <svg
                  className={styles.icon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <line x1="8" y1="6" x2="21" y2="6" strokeWidth="2" />
                  <line x1="8" y1="12" x2="21" y2="12" strokeWidth="2" />
                  <line x1="8" y1="18" x2="21" y2="18" strokeWidth="2" />
                  <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="2" />
                  <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="2" />
                  <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="2" />
                </svg>
                {label("Streams")}
              </>
            )}
          </NavLink>

          <NavLink
            to="/app/recipient"
            aria-label="Recipient"
            className={({ isActive }) =>
              [
                styles.interactive,
                styles.interactiveCompact,
                styles.navLink,
                isActive ? styles.navLinkActive : "",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className={styles.activeBar} aria-hidden="true" />
                )}
                <svg
                  className={styles.icon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" strokeWidth="2" />
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" strokeWidth="2" />
                </svg>
                {label("Recipient")}
              </>
            )}
          </NavLink>
        </nav>

        <div className={styles.utility}>
          <a
            href="/docs/getting-started"
            className={`${styles.interactive} ${styles.interactiveCompact} ${styles.utilityLink}`}
            aria-label="Documentation"
          >
            <svg className={styles.icon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <g clipPath="url(#clip0_1_1594)">
                <path d="M12.497 1.66626H4.99879C4.55687 1.66626 4.13305 1.84181 3.82056 2.1543C3.50807 2.46679 3.33252 2.89061 3.33252 3.33253V16.6627C3.33252 17.1046 3.50807 17.5284 3.82056 17.8409C4.13305 18.1534 4.55687 18.329 4.99879 18.329H14.9964C15.4383 18.329 15.8622 18.1534 16.1746 17.8409C16.4871 17.5284 16.6627 17.1046 16.6627 16.6627V5.83194L12.497 1.66626Z" stroke="currentColor" strokeWidth="1.66627" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.6641 1.66626V4.9988C11.6641 5.44072 11.8396 5.86455 12.1521 6.17703C12.4646 6.48952 12.8884 6.66507 13.3303 6.66507H16.6629" stroke="currentColor" strokeWidth="1.66627" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.33131 7.49823H6.66504" stroke="currentColor" strokeWidth="1.66627" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.3301 10.8307H6.66504" stroke="currentColor" strokeWidth="1.66627" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.3301 14.1633H6.66504" stroke="currentColor" strokeWidth="1.66627" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
            </svg>
            {label("Documentation")}
          </a>

          <a
            href="/legal/terms"
            className={`${styles.interactive} ${styles.interactiveCompact} ${styles.utilityLink}`}
            aria-label="Legal"
          >
            <svg className={styles.icon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <g clipPath="url(#clip0_1_1603)">
                <path d="M13.3301 13.3302L15.8295 6.6651L18.3289 13.3302C17.6041 13.8717 16.7293 14.1633 15.8295 14.1633C14.9297 14.1633 14.0549 13.8717 13.3301 13.3302Z" stroke="currentColor" strokeWidth="1.66627" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.6665 13.3302L4.16591 6.6651L6.66532 13.3302C5.94049 13.8717 5.0657 14.1633 4.16591 14.1633C3.26612 14.1633 2.39133 13.8717 1.6665 13.3302Z" stroke="currentColor" strokeWidth="1.66627" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.83203 17.4958H14.1634" stroke="currentColor" strokeWidth="1.66627" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.99756 2.49939V17.4958" stroke="currentColor" strokeWidth="1.66627" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.49951 5.83192H4.16578C5.83205 5.83192 8.33146 4.99878 9.99773 4.16565C11.664 4.99878 14.1634 5.83192 15.8297 5.83192H17.4959" stroke="currentColor" strokeWidth="1.66627" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
            </svg>
            {label("Legal")}
          </a>

          <div className={styles.divider} />

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className={`${styles.interactive} ${styles.interactiveCompact} ${styles.collapseButton}`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            <svg
              className={`${styles.icon} ${collapsed ? styles.rotated : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <polyline points="15,18 9,12 15,6" strokeWidth="2" />
            </svg>
            {!collapsed && <span className={styles.label}>Collapse</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
