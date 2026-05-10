
import React from 'react';

// Use AllHTMLAttributes to support props like 'rows' and shared attributes across input, textarea, and select.
interface InputProps extends React.AllHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label: string;
  error?: string;
  options?: string[];
  fileName?: string;
  isProcessing?: boolean;
}

export const FormInput: React.FC<InputProps> = ({ label, error, ...props }) => {
  const isTextArea = props.type === 'textarea';
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      {isTextArea ? (
        <textarea
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white text-slate-900 ${error ? 'border-red-500' : 'border-slate-300'}`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white text-slate-900 ${error ? 'border-red-500' : 'border-slate-300'}`}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export const FormSelect: React.FC<InputProps> = ({ label, options = [], error, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <select
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900 transition ${error ? 'border-red-500' : 'border-slate-300'}`}
        {...props}
      >
        <option value="">Pilih {label}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export const FormFile: React.FC<InputProps> = ({ label, error, fileName, isProcessing, ...props }) => {
  const inputId = props.id || `file-input-${props.name || label.replace(/\s+/g, '-').toLowerCase()}`;
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex flex-col items-center justify-center w-full">
        <label 
          htmlFor={inputId}
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition relative ${fileName ? 'border-green-500 bg-green-50' : error ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'}`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
            {isProcessing ? (
              <>
                <svg className="animate-spin h-8 w-8 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-sm text-blue-600 font-medium">Membaca file...</p>
              </>
            ) : fileName ? (
              <>
                <svg className="w-8 h-8 mb-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-green-700 font-medium truncate max-w-xs">{fileName}</p>
                <p className="text-xs text-green-600 mt-1 uppercase font-bold">File Terpilih</p>
              </>
            ) : (
              <>
                <svg className="w-8 h-8 mb-4 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-slate-500 font-semibold">Klik untuk pilih berkas</p>
                <p className="text-xs text-slate-400">PDF atau Gambar (Maks. 2MB)</p>
              </>
            )}
          </div>
          <input 
            {...props}
            id={inputId}
            type="file" 
            className="hidden" 
            accept="image/*,.pdf" 
            disabled={isProcessing}
          />
        </label>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
