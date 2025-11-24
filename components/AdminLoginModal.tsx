import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { PASSWORD } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  title?: string;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess, title = "管理員登入" }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      onLoginSuccess();
      setInput('');
      setError(false);
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-sanyu-black-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-sanyu-dark border border-sanyu-gray rounded-xl shadow-2xl p-6 w-full max-w-sm relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center mb-6">
          <div className="bg-sanyu-red-10 p-3 rounded-full mb-3">
            <Lock className="text-sanyu-red" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-sm text-gray-400 mt-1">請輸入密碼以進行編輯。</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="password" 
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(false);
              }}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sanyu-red transition-colors text-center tracking-widest"
              placeholder="••••••••"
              autoFocus
            />
            {error && <p className="text-sanyu-red text-xs mt-2 text-center">密碼錯誤。</p>}
          </div>
          <button 
            type="submit"
            className="w-full bg-sanyu-red hover:bg-sanyu-red-80 text-white font-bold py-2 rounded-lg transition-colors"
          >
            驗證
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;