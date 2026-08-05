import React, { useState, useEffect } from 'react';
import { certificateService, userService } from '../services/certificateService';

export default function CertificateForm({ certificateToEdit, onSave }) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const initialFormState = {
    cnpj: '',
    companyName: '',
    validFrom: '',
    validUntil: '',
    contactName: '',
    contactPhone: '',
    issuer: '',
    issuedByUs: true,
    renewalValue: 0,
    createdByUserId: '',
    updatedByUserId: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  // 1. Carrega os usuários da API assim que a tela abre
  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await userService.getAll();
        setUsers(response.data);
        
        // Se houver usuários e for um cadastro novo, seleciona o primeiro por padrão
        if (response.data.length > 0 && !certificateToEdit) {
          setFormData(prev => ({
            ...prev,
            createdByUserId: response.data[0].id,
            updatedByUserId: response.data[0].id
          }));
        }
      } catch (error) {
        console.error("Erro ao carregar lista de usuários", error);
      } finally {
        setLoadingUsers(false);
      }
    }

    loadUsers();
  }, [certificateToEdit]);

  // 2. Preenche o formulário caso seja Edição
  useEffect(() => {
    if (certificateToEdit) {
      setFormData({
        ...initialFormState,
        ...certificateToEdit,
        validFrom: certificateToEdit.validFrom ? certificateToEdit.validFrom.split('T')[0] : '',
        validUntil: certificateToEdit.validUntil ? certificateToEdit.validUntil.split('T')[0] : '',
        createdByUserId: certificateToEdit.createdBy?.id || '',
        updatedByUserId: certificateToEdit.createdBy?.id || ''
      });
    }
  }, [certificateToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.createdByUserId) {
      alert("Por favor, selecione um usuário responsável.");
      return;
    }

    try {
      if (certificateToEdit) {
        await certificateService.update(certificateToEdit.id, formData);
      } else {
        await certificateService.create(formData);
      }
      onSave();
    } catch (error) {
      console.error("Erro ao salvar certificado", error);
      alert("Erro ao salvar certificado. Verifique os dados.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {certificateToEdit ? 'Editar Certificado' : 'Novo Certificado'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Razão Social / Empresa</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">CNPJ</label>
            <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Emitido Em</label>
            <input type="date" name="validFrom" value={formData.validFrom} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Vence Em</label>
            <input type="date" name="validUntil" value={formData.validUntil} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Nome do Contato</label>
            <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Telefone do Contato</label>
            <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Autoridade Certificadora</label>
            <input type="text" name="issuer" value={formData.issuer} onChange={handleChange} placeholder="Ex: Certisign, Serasa" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Valor de Renovação (R$)</label>
            <input type="number" name="renewalValue" value={formData.renewalValue} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm" />
          </div>
        </div>

        {/* CAMPO DE SELEÇÃO DE USUÁRIO DINÂMICO */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Usuário Responsável</label>
          <select 
            name="createdByUserId" 
            value={formData.createdByUserId} 
            onChange={(e) => {
              handleChange(e);
              setFormData(prev => ({ ...prev, updatedByUserId: e.target.value }));
            }} 
            required 
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm bg-white"
          >
            {loadingUsers ? (
              <option value="">Carregando usuários...</option>
            ) : users.length === 0 ? (
              <option value="">Nenhum usuário cadastrado</option>
            ) : (
              users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email}) - ID: {u.id}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="flex items-center space-x-2 py-2">
          <input type="checkbox" id="issuedByUs" name="issuedByUs" checked={formData.issuedByUs} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
          <label htmlFor="issuedByUs" className="text-sm font-medium text-gray-700">Emitido por nossa equipe/empresa</label>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
            {certificateToEdit ? 'Salvar Alterações' : 'Cadastrar Certificado'}
          </button>
        </div>
      </form>
    </div>
  );
}