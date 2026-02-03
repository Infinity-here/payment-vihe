import { useState } from "react";
import { createPayment } from "../services/api";

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    if (!formData.name) return "Name is required";
    if (!formData.email) return "Email is required";
    if (!formData.phone) return "Contact number is required";
    if (!formData.amount || Number(formData.amount) <= 0)
      return "Amount must be greater than 0";
    return "";
  };

  const handleSubmit = async (e:any) => {
    console.log(formData)
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const res = await createPayment(formData);
      const payuData = res.data.payuData;
      console.log("PayU Data:", payuData);
      // Create auto submit form for PayU
      const form = document.createElement("form");
      form.method = "POST";
      // form.action = "https://secure.payu.in/_payment";
      form.action="https://test.payu.in/_payment";

      Object.keys(payuData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = payuData[key];
        form.appendChild(input);
      });
      console.log("Submitting to PayU:", payuData);
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <main>
    <div className="payment-container">
      <div className="payment-header">
        <h1 className="payment-title">Sacred Offering</h1>
        <p className="payment-subtitle">
          Complete your contribution with devotion
        </p>
        <div className="divider">
          <span>🪷</span>
        </div>
      </div>

      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-group">
          <label>Full Name *</label>
          <div className="input-wrapper">
            {/* <i className="fas fa-user input-icon"></i> */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email Address *</label>
          <div className="input-wrapper">
            {/* <i className="fas fa-envelope input-icon"></i> */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="form-group">
          <label>Contact Number *</label>
          <div className="input-wrapper">
            {/* <i className="fas fa-phone input-icon"></i> */}
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 **210"
            />
          </div>
        </div>

        {/* Amount */}
        <div className="form-group amount-group">
          <label>Contribution Amount *</label>
          <div className="amount-wrapper">
            {/* <i className="fas fa-rupee-sign input-icon"></i> */}
            <input
              type="number"
              name="amount"
              min="1"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
          <div className="help-text">
            <i className="fas fa-heart"></i>
            <span>
              Your contribution supports spiritual education and ancient wisdom
            </span>
          </div>
        </div>

        {/* Submit */}
        <button className="submit-btn" disabled={loading}>
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Processing...
            </>
          ) : (
            <>
              Proceed to Secure Payment <i className="fas fa-arrow-right"></i>
            </>
          )}
        </button>
      </form>
    </div>

  );
};

export default PaymentForm;
