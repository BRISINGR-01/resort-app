import { useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "./DatePicker";
import { basicInformation } from "../data/basicInformation";

export default function Contact() {
  const [guests, setGuests] = useState(1);
  const [dates, setDates] = useState([]);
  const [status, setStatus] = useState("idle");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const onsubmit = async (data) => {
    setStatus("submitting");
    try {
      await new Promise((r) => setTimeout(r, 1500));
      console.log({ ...data, guests });
      setStatus("failed");
      setDates([]);
      setGuests(1);
    } catch {
      setStatus("success");
    }
  };

  const handleDateChange = (ci, co) => {
    setDates([ci, co]);
    setValue(
      "dates",
      ci && co ? `${ci.toISOString()}-${co.toISOString()}` : "",
      {
        shouldValidate: true,
      },
    );
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <p className="section-label">Get in Touch</p>
            <p className="contact-text">
              Have questions about the studio, the area, or available dates?
              We'd love to hear from you!
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-item-icon">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4>Location</h4>
                  <p>
                    <a href={basicInformation.contact.location.maps}>
                      {basicInformation.contact.location.text}
                    </a>
                  </p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4>Email</h4>
                  <a href={`mailto:${basicInformation.contact.email}`}>
                    {basicInformation.contact.email}
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4>Phone</h4>
                  <a
                    href={
                      "tel:" + basicInformation.contact.phone.replace(" ", "")
                    }
                  >
                    {basicInformation.contact.phone}
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H15V13.9999H17.0762C17.5066 13.9999 17.8887 13.7245 18.0249 13.3161L18.4679 11.9871C18.6298 11.5014 18.2683 10.9999 17.7564 10.9999H15V8.99992C15 8.49992 15.5 7.99992 16 7.99992H18C18.5523 7.99992 19 7.5522 19 6.99992V6.31393C19 5.99091 18.7937 5.7013 18.4813 5.61887C17.1705 5.27295 16 5.27295 16 5.27295C13.5 5.27295 12 6.99992 12 8.49992V10.9999H10C9.44772 10.9999 9 11.4476 9 11.9999V12.9999C9 13.5522 9.44771 13.9999 10 13.9999H12V21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z"
                      fill="#currentColor"
                    />
                  </svg>
                </div>
                <div>
                  <h4>Social media</h4>
                  <a href={basicInformation.contact.facebook}>Facebook</a>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            {status === "success" ? (
              <div className="form-success">
                <div className="form-success-icon">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3>Inquiry Sent!</h3>
                <p>
                  Thank you for reaching out. We'll get back to you shortly.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setStatus("idle")}
                >
                  Send Another
                </button>
              </div>
            ) : status === "failed" ? (
              <div className="form-success">
                <div className="form-fail-icon">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <h3>Something went wrong</h3>
                <p>We couldn't send your inquiry. Please try again.</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setStatus("idle")}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <form
                className="contact-form"
                onSubmit={handleSubmit(onsubmit)}
                noValidate
              >
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="John Smith"
                      className={errors.name ? "input-error" : ""}
                      {...register("name", {
                        required: "Full name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                    />
                    {errors.name && (
                      <span className="form-error">{errors.name.message}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="guests">Guests</label>
                    <div className="guest-selector">
                      <button
                        type="button"
                        className="guest-btn"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      >
                        −
                      </button>
                      <span className="guest-count">{guests}</span>
                      <button
                        type="button"
                        className="guest-btn"
                        onClick={() =>
                          setGuests((g) =>
                            Math.min(basicInformation.maxGuests, g + 1),
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <input
                      type="hidden"
                      name="guests"
                      value={guests}
                      {...register("guests", {
                        required: "Amount of guests is required",
                        max: {
                          value: basicInformation.maxGuests,
                          message: `No more than ${basicInformation.maxGuests} guests are allowed`,
                        },
                        min: {
                          value: 1,
                          message: "At least 1 guest is required",
                        },
                      })}
                    />
                    {errors.guests && (
                      <span className="form-error">
                        {errors.guests.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="john@example.com"
                      className={errors.email ? "input-error" : ""}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Enter a valid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <span className="form-error">{errors.email.message}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Preferred Dates</label>
                    <DatePicker
                      defaultVal={dates}
                      onDateChange={handleDateChange}
                    />
                    <input
                      type="hidden"
                      {...register("dates", {
                        required:
                          "Both check-in and check-out dates are required",
                      })}
                    />
                    {errors.dates && (
                      <span className="form-error">{errors.dates.message}</span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    rows="4"
                    placeholder="Tell us about your dream vacation..."
                    className={errors.message ? "input-error" : ""}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? (
                    <span className="btn-spinner" />
                  ) : (
                    "Send Inquiry"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
