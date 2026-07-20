import React, { useState, useEffect } from 'react';
import { userService } from '../services/certificateService';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao carregar usuários", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.create(formData);
      setFormData({ name: '', email: '', password: '', role: 'USER' });
      loadUsers();
    } catch (error) {
      console.error("Erro ao criar usuário", error);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Formulário Novo Usuário */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Adicionar Novo Operador</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Nome</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Senha</label>
            <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Função</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500">
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <button type="submit" className="w-1/2 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
              Adicionar
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Usuários */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50/70 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-sm">Usuários Cadastrados</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {users.map(user => (
            <div key={user.id} className="p-4 flex justify-between items-center hover:bg-gray-50/40">
              <div>
                <span className="font-semibold text-gray-900 text-sm">{user.name}</span>
                <span className="ml-2 text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{user.role}</span>
                <div className="text-xs text-gray-400 mt-0.5">{user.email}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}