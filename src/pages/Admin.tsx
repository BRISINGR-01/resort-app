import { useState } from "react";
import { Link } from "react-router-dom";
import PendingTab from "./admin/PendingTab";
import HistoryTab from "./admin/HistoryTab";
import CalendarTab from "./admin/CalendarTab";
import AddBookingTab from "./admin/AddBookingTab";import { useTranslation } from 'react-i18next'
import i18next from 'i18next'


const tabs = [
  { id: "calendar", label: i18next.t('calendar', 'Calendar') },
  { id: "add", label: i18next.t('addBooking', 'Add Booking') },
  { id: "pending", label: i18next.t('pending', 'Pending') },
  { id: "history", label: i18next.t('history', 'History') },
];

export default function Admin() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <div className="admin">
      <header className="admin-header">
        <div className="admin-header-inner">
          <Link to="/" className="admin-back">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
            {t('backToSite', 'Back to Site')}
          </Link>
          <h1 className="admin-title">{t('adminDashboard', 'Admin Dashboard')}</h1>
        </div>
      </header>

      <nav className="admin-tabs">
        <div className="admin-tabs-inner">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? "admin-tab-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="admin-main">
        <div className="container">
          {activeTab === "pending" && <PendingTab />}
          {activeTab === "history" && <HistoryTab />}
          {activeTab === "calendar" && <CalendarTab />}
          {activeTab === "add" && <AddBookingTab />}
        </div>
      </main>
    </div>
  );
}
