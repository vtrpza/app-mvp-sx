'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MapPin, 
  Star,
  Eye,
  EyeOff
} from 'lucide-react'
import { mockDatabase } from '@/lib/supabase'
import ImageUploader from '@/components/ImageUploader'

interface TouristSpot {
  id: string
  nome: string
  descricao: string
  categoria: string
  coordenadas: { lat: number, lng: number }
  imagem: string
  horarioFuncionamento: string
  taxaEntrada: number
  pontosCheckin: number
  rating: number
  website?: string
  ativo: boolean
  createdAt: string
}

export default function TouristSpotsAdmin() {
  const [spots, setSpots] = useState<TouristSpot[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingSpot, setEditingSpot] = useState<TouristSpot | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: 'parque',
    coordenadas: { lat: -23.5505, lng: -46.6333 },
    imagem: '',
    horarioFuncionamento: '09:00 - 18:00',
    taxaEntrada: 0,
    pontosCheckin: 50,
    rating: 5,
    website: '',
    ativo: true
  })

  useEffect(() => {
    loadSpots()
  }, [])

  const loadSpots = async () => {
    try {
      const spotsData = await mockDatabase.touristSpots.getAll()
      setSpots(spotsData)
    } catch (error) {
      console.error('Error loading spots:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingSpot) {
        // Update existing spot
        await mockDatabase.touristSpots.update(editingSpot.id, formData)
      } else {
        // Create new spot
        await mockDatabase.touristSpots.create(formData)
      }
      
      await loadSpots()
      resetForm()
      setShowForm(false)
    } catch (error) {
      console.error('Error saving spot:', error)
      alert('Erro ao salvar ponto turístico')
    }
  }

  const handleEdit = (spot: TouristSpot) => {
    setEditingSpot(spot)
    setFormData({
      nome: spot.nome,
      descricao: spot.descricao,
      categoria: spot.categoria,
      coordenadas: spot.coordenadas,
      imagem: spot.imagem,
      horarioFuncionamento: spot.horarioFuncionamento,
      taxaEntrada: spot.taxaEntrada,
      pontosCheckin: spot.pontosCheckin,
      rating: spot.rating,
      website: spot.website || '',
      ativo: spot.ativo
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este ponto turístico?')) {
      try {
        await mockDatabase.touristSpots.delete(id)
        await loadSpots()
      } catch (error) {
        console.error('Error deleting spot:', error)
        alert('Erro ao excluir ponto turístico')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      categoria: 'parque',
      coordenadas: { lat: -23.5505, lng: -46.6333 },
      imagem: '',
      horarioFuncionamento: '09:00 - 18:00',
      taxaEntrada: 0,
      pontosCheckin: 50,
      rating: 5,
      website: '',
      ativo: true
    })
    setEditingSpot(null)
  }

  const filteredSpots = spots.filter(spot =>
    spot.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spot.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categories = [
    { value: 'parque', label: 'Parque' },
    { value: 'museu', label: 'Museu' },
    { value: 'restaurante', label: 'Restaurante' },
    { value: 'praia', label: 'Praia' },
    { value: 'monumento', label: 'Monumento' },
    { value: 'outro', label: 'Outro' }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-gray-200 h-64 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pontos Turísticos</h1>
          <p className="text-gray-600">Gerencie os pontos turísticos do sistema</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Ponto
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar pontos turísticos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingSpot ? 'Editar Ponto Turístico' : 'Novo Ponto Turístico'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição *
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria *
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Coordenadas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coordenadas.lat}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      coordenadas: { ...prev.coordenadas, lat: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coordenadas.lng}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      coordenadas: { ...prev.coordenadas, lng: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              {/* Image Upload */}
              <ImageUploader
                onImageSelect={(imageData) => setFormData(prev => ({ ...prev, imagem: imageData }))}
                currentImage={formData.imagem}
              />

              {/* Horário de Funcionamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horário de Funcionamento
                </label>
                <input
                  type="text"
                  value={formData.horarioFuncionamento}
                  onChange={(e) => setFormData(prev => ({ ...prev, horarioFuncionamento: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="09:00 - 18:00"
                />
              </div>

              {/* Taxa de Entrada */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taxa de Entrada (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.taxaEntrada}
                    onChange={(e) => setFormData(prev => ({ ...prev, taxaEntrada: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pontos por Check-in
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.pontosCheckin}
                    onChange={(e) => setFormData(prev => ({ ...prev, pontosCheckin: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website (opcional)
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://..."
                />
              </div>

              {/* Ativo */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.ativo}
                    onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">Ponto ativo</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {editingSpot ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Spots List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredSpots.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Ponto Turístico</th>
                  <th className="text-left p-4 font-medium text-gray-900">Categoria</th>
                  <th className="text-left p-4 font-medium text-gray-900">Taxa</th>
                  <th className="text-left p-4 font-medium text-gray-900">Pontos</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredSpots.map((spot) => (
                  <tr key={spot.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {spot.imagem ? (
                          <img
                            src={spot.imagem}
                            alt={spot.nome}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <MapPin className="text-gray-400" size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{spot.nome}</p>
                          <p className="text-sm text-gray-500">{spot.descricao.substring(0, 50)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize text-gray-700">{spot.categoria}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-700">
                        {spot.taxaEntrada > 0 ? `R$ ${spot.taxaEntrada.toFixed(2)}` : 'Gratuito'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-500" size={16} />
                        <span className="text-gray-700">{spot.pontosCheckin}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        spot.ativo
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {spot.ativo ? <Eye size={12} /> : <EyeOff size={12} />}
                        {spot.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(spot)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(spot.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">Nenhum ponto turístico encontrado</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-primary hover:underline mt-2"
              >
                Limpar busca
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}