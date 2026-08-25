import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { Save, User, Mail, Shield, Check } from 'lucide-react';

export default function MyAccount() {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsSaving(true);
    setMessage('');
    try {
      await updateProfile(currentUser, {
        displayName: displayName.trim() || null,
        photoURL: photoURL.trim() || null
      });
      setMessage('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage('Erro ao atualizar perfil: ' + error.message);
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Minha Conta</h1>
      
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-8">
          {currentUser?.photoURL || photoURL ? (
            <img 
              src={photoURL || currentUser?.photoURL || ''} 
              alt="Avatar" 
              className="w-16 h-16 rounded-full border-2 border-violet-100 dark:border-violet-900/30 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + (displayName || 'User') + '&background=8b5cf6&color=fff';
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center text-2xl font-bold">
              {(displayName || currentUser?.email || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {currentUser?.displayName || 'Usuário Sem Nome'}
            </h2>
            <p className="text-sm text-zinc-500 flex items-center mt-1">
              <Shield className="w-4 h-4 mr-1 text-green-500" /> Conta Verificada
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center">
              <User className="w-4 h-4 mr-2" /> Nome de Exibição
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent text-zinc-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
              placeholder="Como quer ser chamado?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center">
              <Mail className="w-4 h-4 mr-2" /> E-mail (Não pode ser alterado)
            </label>
            <input
              type="email"
              disabled
              value={currentUser?.email || ''}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              URL da Foto de Perfil (Opcional)
            </label>
            <input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent text-zinc-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
              placeholder="https://..."
            />
          </div>

          <div className="pt-4 flex items-center justify-between">
            {message ? (
              <span className={`text-sm flex items-center ${message.includes('Erro') ? 'text-red-500' : 'text-green-500'}`}>
                {message.includes('Erro') ? null : <Check className="w-4 h-4 mr-1" />}
                {message}
              </span>
            ) : <span />}
            
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
