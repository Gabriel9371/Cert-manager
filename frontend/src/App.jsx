import React, { useState } from 'react';
import CertificateList from './pages/CertificateList';
import CertificateForm from './pages/CertificateForm';
import UserManagement from './pages/UserManagement';

export default function App() {
  const [currentPage, setCurrentPage] = useState('list'); 
  const [certificateToEdit, setCertificateToEdit] = useState(null);

  const handleEditClick = (certificate) => {
    setCertificateToEdit(certificate);
    setCurrentPage('form');
  };

  const handleSaveSuccess = () => {
    setCertificateToEdit(null);
    setCurrentPage('list');
  };

  const handleNewCertificateClick = () => {
    setCertificateToEdit(null);
    setCurrentPage('form');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      {/* Barra de Navegação Superior */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('list')}>
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">✓</div>
            <span className="font-bold text-gray-900 tracking-tight">CertiManager</span>
          </div>
          
          <nav className="flex space-x-1">
            <button 
              onClick={() => { setCurrentPage('list'); setCertificateToEdit(null); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Certificados
            </button>
            <button 
              onClick={handleNewCertificateClick}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 'form' && !certificateToEdit ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Novo Certificado
            </button>
            <button 
              onClick={() => setCurrentPage('users')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 'users' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Usuários
            </button>
          </nav>
        </div>
      </header>

      {/* Container de Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6">
        {currentPage === 'list' && (
          <CertificateList onEdit={handleEditClick} />
        )}
        {currentPage === 'form' && (
          <CertificateForm certificateToEdit={certificateToEdit} onSave={handleSaveSuccess} />
        )}
        {currentPage === 'users' && (
          <UserManagement />
        )}
      </main>
    </div>
  );
}