import React, { useEffect, useState } from 'react';
import { certificateService } from '../services/certificateService';

export default function CertificateList({ onEdit }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const response = await certificateService.getAll();
      setCertificates(response.data);
    } catch (error) {
      console.error("Erro ao buscar certificados", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este certificado?")) {
      try {
        await certificateService.delete(id);
        loadCertificates();
      } catch (error) {
        console.error("Erro ao deletar certificado", error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800 border-green-200',
      TO_RENEW: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      RENEWING: 'bg-blue-100 text-blue-800 border-blue-200',
      EXPIRED: 'bg-red-100 text-red-800 border-red-200',
      RENEWED: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold border rounded-full ${styles[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  if (loading) return <div className="p-6 text-gray-600">Carregando certificados...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Certificados Digitais</h2>
          <p className="text-sm text-gray-500 mt-0.5">Gerenciamento e controle de validades</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold tracking-wider border-b border-gray-100">
              <th className="p-4">Empresa / CNPJ</th>
              <th className="p-4">Vencimento</th>
              <th className="p-4">Status</th>
              <th className="p-4">Contato</th>
              <th className="p-4">Emissor</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
            {certificates.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">Nenhum certificado encontrado.</td>
              </tr>
            ) : (
              certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">{cert.companyName}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{cert.cnpj}</div>
                  </td>
                  <td className="p-4 font-medium">
                    {new Date(cert.validUntil).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4">{getStatusBadge(cert.status)}</td>
                  <td className="p-4">
                    <div>{cert.contactName}</div>
                    <div className="text-xs text-gray-400">{cert.contactPhone}</div>
                  </td>
                  <td className="p-4 text-gray-500">{cert.issuer}</td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button 
                      onClick={() => onEdit(cert)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium text-xs px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(cert.id)}
                      className="text-red-600 hover:text-red-900 font-medium text-xs px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}