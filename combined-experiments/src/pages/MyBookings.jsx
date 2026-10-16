import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { initialHotels } from "../data/hotelsData";

export function MyBookings() {
  const { registrations, deleteRegistration, updateRegistration, fetchReservations } = useBooking();

  const [editingReg, setEditingReg] = useState(null);
  const [editForm, setEditForm] = useState({
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    specialRequests: "",
    roomType: "Double",
    checkInDate: "",
    nights: 2,
    guests: 2
  });
  const [editSuccessMsg, setEditSuccessMsg] = useState("");

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleOpenEdit = (reg) => {
    setEditingReg(reg);
    setEditForm({
      guestName: reg.guest?.name || "",
      guestPhone: reg.guest?.phone || "",
      guestEmail: reg.guest?.email || "",
      specialRequests: reg.guest?.specialRequests || "",
      roomType: reg.room?.type || "Double",
      checkInDate: parseToIsoDate(reg.stay?.checkInDate),
      nights: reg.stay?.nights || 2,
      guests: reg.stay?.guests || 2
    });
    setEditSuccessMsg("");
  };

  const handleCloseEdit = () => {
    setEditingReg(null);
    setEditSuccessMsg("");
  };

  // Find hotel information and available rooms for editing
  const editingHotel = useMemo(() => {
    if (!editingReg) return null;
    return (
      initialHotels.find(
        (h) => h.id === editingReg.hotel?.id || h.name === editingReg.hotel?.name
      ) || editingReg.hotel
    );
  }, [editingReg]);

  const availableRooms = useMemo(() => {
    return (
      editingHotel?.rooms || [
        { type: "Single", price: 2400, desc: "Single bed with WiFi" },
        { type: "Double", price: 3000, desc: "Double bedroom with skyline view" },
        { type: "Deluxe", price: 4200, desc: "Premium suite with luxury amenities" }
      ]
    );
  }, [editingHotel]);

  // Recalculate pricing live as user edits
  const liveCalculation = useMemo(() => {
    const selectedRoom =
      availableRooms.find(
        (r) => r.type.toLowerCase() === (editForm.roomType || "Double").toLowerCase()
      ) || availableRooms[0];

    const nightsCount = Math.max(1, parseInt(editForm.nights, 10) || 1);
    const guestsCount = Math.max(1, parseInt(editForm.guests, 10) || 1);
    const roomRate = selectedRoom?.price || 3000;
    const subtotal = roomRate * nightsCount;
    const taxGst = Math.round(subtotal * 0.12);
    const totalAmount = subtotal + taxGst;

    const { checkInFormatted, checkOutFormatted } = formatCheckInOut(
      editForm.checkInDate,
      nightsCount
    );

    return {
      selectedRoom,
      roomRate,
      nightsCount,
      guestsCount,
      subtotal,
      taxGst,
      totalAmount,
      checkInFormatted,
      checkOutFormatted
    };
  }, [availableRooms, editForm.roomType, editForm.nights, editForm.guests, editForm.checkInDate]);

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingReg) return;

    const updatedPayload = {
      guest: {
        name: editForm.guestName.trim() || editingReg.guest?.name || "Guest",
        phone: editForm.guestPhone.trim() || editingReg.guest?.phone || "",
        email: editForm.guestEmail.trim() || editingReg.guest?.email || "",
        specialRequests: editForm.specialRequests.trim() || "None"
      },
      room: {
        type: liveCalculation.selectedRoom.type,
        pricePerNight: liveCalculation.roomRate,
        description:
          liveCalculation.selectedRoom.desc ||
          `${liveCalculation.selectedRoom.type} Suite with luxury bedding`
      },
      stay: {
        nights: liveCalculation.nightsCount,
        guests: liveCalculation.guestsCount,
        checkInDate: liveCalculation.checkInFormatted,
        checkOutDate: liveCalculation.checkOutFormatted
      },
      billing: {
        roomRate: liveCalculation.roomRate,
        nights: liveCalculation.nightsCount,
        subtotal: liveCalculation.subtotal,
        taxGst: liveCalculation.taxGst,
        totalAmount: liveCalculation.totalAmount,
        paymentMethod: editingReg.billing?.paymentMethod || "UPI",
        paymentStatus: editingReg.billing?.paymentStatus || "Paid & Verified"
      }
    };

    updateRegistration(editingReg.registrationId, updatedPayload);
    setEditSuccessMsg(`✓ Reservation ${editingReg.registrationId} details updated successfully!`);

    setTimeout(() => {
      setEditingReg(null);
      setEditSuccessMsg("");
    }, 1000);
  };

  return (
    <div className="my-bookings-page">
      <div className="page-header">
        <h1>My Hotel Registrations</h1>
        <p>View, print vouchers, and manage your confirmed room bookings.</p>
      </div>

      {registrations.length === 0 ? (
        <div className="empty-registrations-card">
          <div className="empty-icon">🧳</div>
          <h2>No Active Hotel Registrations</h2>
          <p>
            You haven't registered any hotel rooms yet. Browse our selection of luxury hotels to
            book your first stay.
          </p>
          <Link to="/hotels" className="btn-primary-sm">
            Browse Hotels & Register
          </Link>
        </div>
      ) : (
        <div className="registrations-list">
          {registrations.map((reg) => (
            <div key={reg.registrationId} className="registration-summary-card">
              <div className="reg-card-left">
                <img
                  src={reg.hotel.image}
                  alt={reg.hotel.name}
                  className="reg-hotel-thumb"
                />
              </div>

              <div className="reg-card-center">
                <div className="reg-id-row">
                  <span className="reg-id-tag">{reg.registrationId}</span>
                  <span className="reg-status-badge">✓ {reg.status}</span>
                </div>
                <h3 className="reg-hotel-name">{reg.hotel.name}</h3>
                <p className="reg-hotel-location">📍 {reg.hotel.location}</p>

                <div className="reg-info-chips">
                  <span>🛏️ {reg.room.type} Suite</span>
                  <span>
                    📅 {stayFormat(reg.stay.checkInDate)} ({reg.stay.nights}{" "}
                    {reg.stay.nights === 1 ? "night" : "nights"})
                  </span>
                  <span>
                    👥 {reg.stay.guests} {reg.stay.guests === 1 ? "Guest" : "Guests"}
                  </span>
                  <span>👤 {reg.guest.name}</span>
                </div>
              </div>

              <div className="reg-card-right">
                <div className="reg-price-tag">
                  <span className="price-label">Total Amount</span>
                  <span className="price-val">
                    ₹{reg.billing.totalAmount?.toLocaleString("en-IN")}
                  </span>
                  <span className="price-method">{reg.billing.paymentMethod}</span>
                </div>

                <div className="reg-actions-col">
                  <Link
                    to={`/registration/${reg.registrationId}`}
                    className="btn-view-voucher"
                  >
                    View Details & Voucher →
                  </Link>

                  <div className="reg-action-buttons-row">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(reg)}
                      className="btn-edit-reservation"
                      title="Edit registration details"
                    >
                      ✏️ Edit Details
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to cancel and delete reservation ${reg.registrationId}?`
                          )
                        ) {
                          deleteRegistration(reg.registrationId);
                        }
                      }}
                      className="btn-delete-reservation"
                      title="Cancel and delete reservation"
                    >
                      🗑️ Cancel & Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Registration Modal */}
      {editingReg && (
        <div className="edit-modal-backdrop" onClick={handleCloseEdit}>
          <div
            className="edit-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="edit-modal-header">
              <div className="edit-modal-title-group">
                <h2>✏️ Edit Registration Details</h2>
                <p className="edit-modal-subtitle">
                  {editingReg.hotel?.name} • ID: <strong style={{ color: '#93c5fd' }}>{editingReg.registrationId}</strong>
                </p>
              </div>
              <button
                type="button"
                className="edit-modal-close-btn"
                onClick={handleCloseEdit}
                aria-label="Close dialog"
              >
                &times;
              </button>
            </div>

            <form className="edit-modal-form" onSubmit={handleSaveEdit}>
              <div className="edit-modal-body">
                {editSuccessMsg && (
                  <div className="edit-success-banner">{editSuccessMsg}</div>
                )}

                <div>
                  <div className="edit-section-title">👤 Guest Information</div>
                  <div className="edit-form-grid">
                    <div className="edit-field-group">
                      <label htmlFor="edit-guest-name" className="edit-field-label">
                        Guest Full Name *
                      </label>
                      <input
                        id="edit-guest-name"
                        type="text"
                        required
                        className="edit-input"
                        value={editForm.guestName}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, guestName: e.target.value }))
                        }
                        placeholder="e.g. Rajesh Sharma"
                      />
                    </div>

                    <div className="edit-field-group">
                      <label htmlFor="edit-guest-phone" className="edit-field-label">
                        Phone Number *
                      </label>
                      <input
                        id="edit-guest-phone"
                        type="tel"
                        required
                        className="edit-input"
                        value={editForm.guestPhone}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, guestPhone: e.target.value }))
                        }
                        placeholder="e.g. 9876543210"
                      />
                    </div>

                    <div className="edit-field-group full-width">
                      <label htmlFor="edit-guest-email" className="edit-field-label">
                        Email Address *
                      </label>
                      <input
                        id="edit-guest-email"
                        type="email"
                        required
                        className="edit-input"
                        value={editForm.guestEmail}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, guestEmail: e.target.value }))
                        }
                        placeholder="e.g. guest@traveler.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="edit-section-title">🛏️ Room & Stay Preferences</div>
                  <div className="edit-form-grid">
                    <div className="edit-field-group">
                      <label htmlFor="edit-room-type" className="edit-field-label">
                        Room Suite Type
                      </label>
                      <select
                        id="edit-room-type"
                        className="edit-select"
                        value={editForm.roomType}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, roomType: e.target.value }))
                        }
                      >
                        {availableRooms.map((r) => (
                          <option key={r.type} value={r.type}>
                            {r.type} Suite — ₹{r.price.toLocaleString("en-IN")}/night
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="edit-field-group">
                      <label htmlFor="edit-checkin-date" className="edit-field-label">
                        Check-in Date
                      </label>
                      <input
                        id="edit-checkin-date"
                        type="date"
                        required
                        className="edit-input"
                        value={editForm.checkInDate}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, checkInDate: e.target.value }))
                        }
                      />
                    </div>

                    <div className="edit-field-group">
                      <label htmlFor="edit-nights" className="edit-field-label">
                        Stay Duration (Nights)
                      </label>
                      <input
                        id="edit-nights"
                        type="number"
                        min="1"
                        max="30"
                        required
                        className="edit-input"
                        value={editForm.nights}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, nights: e.target.value }))
                        }
                      />
                    </div>

                    <div className="edit-field-group">
                      <label htmlFor="edit-guests" className="edit-field-label">
                        Number of Guests
                      </label>
                      <input
                        id="edit-guests"
                        type="number"
                        min="1"
                        max="6"
                        required
                        className="edit-input"
                        value={editForm.guests}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, guests: e.target.value }))
                        }
                      />
                    </div>

                    <div className="edit-field-group full-width">
                      <label htmlFor="edit-special-requests" className="edit-field-label">
                        Special Requests / Preferences
                      </label>
                      <textarea
                        id="edit-special-requests"
                        rows="2"
                        className="edit-textarea"
                        value={editForm.specialRequests}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, specialRequests: e.target.value }))
                        }
                        placeholder="e.g. Quiet room, high floor, extra pillows..."
                      />
                    </div>
                  </div>
                </div>

                {/* Live Recalculated Billing Preview */}
                <div className="edit-pricing-box">
                  <div className="edit-pricing-row">
                    <span>
                      Room Rate ({liveCalculation.selectedRoom.type} Suite):
                    </span>
                    <span>
                      ₹{liveCalculation.roomRate.toLocaleString("en-IN")} × {liveCalculation.nightsCount}{" "}
                      {liveCalculation.nightsCount === 1 ? "night" : "nights"}
                    </span>
                  </div>
                  <div className="edit-pricing-row">
                    <span>Subtotal:</span>
                    <span>₹{liveCalculation.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="edit-pricing-row">
                    <span>Taxes & GST (12%):</span>
                    <span>₹{liveCalculation.taxGst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="edit-pricing-row total-row">
                    <span>Updated Total Amount:</span>
                    <span>₹{liveCalculation.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                  {liveCalculation.checkOutFormatted && (
                    <div style={{ fontSize: '0.76rem', color: '#60a5fa', marginTop: '4px' }}>
                      📅 Check-out: {liveCalculation.checkOutFormatted}
                    </div>
                  )}
                </div>
              </div>

              <div className="edit-modal-footer">
                <button
                  type="button"
                  className="btn-edit-cancel"
                  onClick={handleCloseEdit}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-edit-save">
                  💾 Save Changes (PUT)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function stayFormat(dateStr) {
  return dateStr || "Upcoming";
}

function parseToIsoDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }
  return new Date().toISOString().split("T")[0];
}

function formatCheckInOut(isoDateStr, nightsCount) {
  try {
    const cin = new Date(isoDateStr || Date.now());
    if (isNaN(cin.getTime())) {
      return { checkInFormatted: isoDateStr, checkOutFormatted: "" };
    }
    const checkInFormatted = cin.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    const cout = new Date(cin);
    cout.setDate(cout.getDate() + Number(nightsCount || 1));
    const checkOutFormatted = cout.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    return { checkInFormatted, checkOutFormatted };
  } catch {
    return { checkInFormatted: isoDateStr, checkOutFormatted: "" };
  }
}
