export default function ShippingForm({ email, onEmailChange, shipping, onShippingChange }) {
  function field(key) {
    return {
      value: shipping[key],
      onChange: (e) => onShippingChange({ ...shipping, [key]: e.target.value }),
    }
  }

  return (
    <div className="shipping-form-fields">
      <label>Email address<input type="email" autoComplete="email" value={email} onChange={(e) => onEmailChange(e.target.value)} required /></label>
      <label>Full name<input autoComplete="name" {...field('name')} required /></label>
      <label className="wide-field">Address line 1<input autoComplete="address-line1" {...field('line1')} required /></label>
      <label className="wide-field">Address line 2 <span>Optional</span><input autoComplete="address-line2" {...field('line2')} /></label>
      <div className="shipping-form-row">
        <label>City<input autoComplete="address-level2" {...field('city')} required /></label>
        <label>Province / State<input autoComplete="address-level1" {...field('state')} required /></label>
        <label>Postal / ZIP code<input autoComplete="postal-code" {...field('zip')} required /></label>
      </div>
      <label>Country<input autoComplete="country-name" {...field('country')} required /></label>
    </div>
  )
}
