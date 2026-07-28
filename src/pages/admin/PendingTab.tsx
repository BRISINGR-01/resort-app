import { useState, useEffect, useCallback } from "react";
import requests from "../../data/requests";
import { formatDate, formatDateTime } from "./utils";
import type { Request } from "../../data/types";

export default function PendingTab() {
  const [items, setItems] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await requests.getPending();
    setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAccept = async (id: string) => {
    setActingId(id);
    await requests.accept(id);
    setItems((prev) => prev.filter((r) => r.id !== id));
    setActingId(null);
  };

  const handleDeny = async (id: string) => {
    setActingId(id);
    await requests.reject(id);
    setItems((prev) => prev.filter((r) => r.id !== id));
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
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No pending requests</p>
        </div>
      ) : (
        <div className="admin-requests-list">
          {items.map((r) => (
            <div key={r.id} className="admin-request-card">
              <div className="admin-request-header">
                <h3 className="admin-request-name">{r.client_name}</h3>
                <span className="admin-badge admin-badge-pending">Pending</span>
              </div>
              <div className="admin-request-details">
                <div className="admin-detail">
                  <span className="admin-detail-label">Check-in</span>
                  <span className="admin-detail-value">
                    {formatDate(r.start_date as Date)}
                  </span>
                </div>
                <div className="admin-detail">
                  <span className="admin-detail-label">Check-out</span>
                  <span className="admin-detail-value">
                    {formatDate(r.end_date as Date)}
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
              <div className="admin-request-actions">
                <button
                  className="admin-btn admin-btn-accept"
                  onClick={() => handleAccept(r.id)}
                  disabled={actingId === r.id}
                >
                  {actingId === r.id ? (
                    <span className="btn-spinner" />
                  ) : (
                    "Accept"
                  )}
                </button>
                <button
                  className="admin-btn admin-btn-deny"
                  onClick={() => handleDeny(r.id)}
                  disabled={actingId === r.id}
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
