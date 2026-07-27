import { useState, useEffect, useCallback } from "react";
import requests from "../../data/requests";
import { formatDate, formatDateTime } from "./utils";

export default function HistoryTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await requests.list();
    setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (id) => {
    setActingId(id);
    await requests.accept(id);
    setItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, denied: false } : r)),
    );
    setActingId(null);
  };

  if (loading)
    return (
      <div className="admin-loader">
        <span className="btn-spinner" />
      </div>
    );

  return (
    <div className="admin-tab-content">
      {items.length === 0 ? (
        <div className="admin-empty">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No requests yet</p>
        </div>
      ) : (
        <div className="admin-requests-list">
          {items.map((r) => (
            <div key={r.id} className="admin-request-card">
              <div className="admin-request-header">
                <h3 className="admin-request-name">{r.client_name}</h3>
                <span
                  className={`admin-badge ${r.denied ? "admin-badge-denied" : "admin-badge-accepted"}`}
                >
                  {r.denied ? "Denied" : "Accepted"}
                </span>
              </div>
              <div className="admin-request-details">
                <div className="admin-detail">
                  <span className="admin-detail-label">Check-in</span>
                  <span className="admin-detail-value">
                    {formatDate(r.start_date)}
                  </span>
                </div>
                <div className="admin-detail">
                  <span className="admin-detail-label">Check-out</span>
                  <span className="admin-detail-value">
                    {formatDate(r.end_date)}
                  </span>
                </div>
                <div className="admin-detail">
                  <span className="admin-detail-label">Guests</span>
                  <span className="admin-detail-value">{r.guests_amount}</span>
                </div>
                <div className="admin-detail">
                  <span className="admin-detail-label">Submitted</span>
                  <span className="admin-detail-value">
                    {formatDateTime(r.created_at)}
                  </span>
                </div>
              </div>
              {r.note && (
                <div className="admin-request-note">
                  <span className="admin-detail-label">Note</span>
                  <p>{r.note}</p>
                </div>
              )}
              {r.denied && (
                <div className="admin-request-actions">
                  <button
                    className="admin-btn admin-btn-accept"
                    onClick={() => handleApprove(r.id)}
                    disabled={actingId === r.id}
                  >
                    {actingId === r.id ? (
                      <span className="btn-spinner" />
                    ) : (
                      "Approve"
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
