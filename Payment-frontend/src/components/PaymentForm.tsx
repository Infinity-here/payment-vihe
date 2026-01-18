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
      form.action = "https://secure.payu.in/_payment";
      // form.action="https://test.payu.in/_payment";

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
    <div className="payment-card">
      <h1 className="title">Payment</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>

        <div className="input-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        <div className="input-group">
          <label>Contact Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter contact number"
          />
        </div>

        <div className="input-group">
          <label>Amount *</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0"
          />
        </div>

        <button className="submit-btn" disabled={loading}>
          {loading ? "Processing..." : "CHECK DETAILS"}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
