import React from "react";

function Input({ type, name, value, setValue, placeholder, Title }) {
  return (
    <div className="input-container">
      <label htmlFor={name}>{name}*</label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder={placeholder}
        required
      />
    </div>
  );
}

export default Input;
