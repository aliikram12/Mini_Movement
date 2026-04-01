import { useState } from 'react';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const InputField = ({ label, type = 'text', name, value, onChange, placeholder, error, required, icon, className = '', ...props }) => {
  const [show, setShow] = useState(false);
  const isPw = type === 'password';
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label htmlFor={name} className="block text-sm font-medium text-brand-medium mb-1.5">{label}{required && <span className="text-brand-warm ml-1">*</span>}</label>}
      <div className="relative">
        {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted">{icon}</span>}
        <input id={name} name={name} type={isPw && show ? 'text' : type} value={value} onChange={onChange} placeholder={placeholder} required={required}
          className={`input-field ${icon ? 'pl-11' : ''} ${isPw ? 'pr-11' : ''} ${error ? '!border-red-300 !ring-red-100' : ''}`} {...props} />
        {isPw && <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-medium transition-colors">
          {show ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
        </button>}
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default InputField;
