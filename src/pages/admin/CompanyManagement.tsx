import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Company } from '../../types';
import { StorageService } from '../../services/storage';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal } from '../../components/common/Modal';

export const CompanyManagement: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(() => StorageService.getCompanies());
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    website: '',
    description: '',
    packageRange: '',
    minCgpa: 7.0,
    requiredSkillsStr: '',
  });

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      industry: 'Product Technology',
      location: 'Bengaluru / Pan-India',
      website: 'https://',
      description: '',
      packageRange: '₹8 - ₹12 LPA',
      minCgpa: 7.5,
      requiredSkillsStr: 'Java, SQL, Data Structures',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (comp: Company) => {
    setEditingCompany(comp);
    setFormData({
      name: comp.name,
      industry: comp.industry,
      location: comp.location,
      website: comp.website,
      description: comp.description,
      packageRange: comp.packageRange,
      minCgpa: comp.minCgpa,
      requiredSkillsStr: comp.requiredSkills.join(', '),
    });
    setModalOpen(true);
  };

  const handleDelete = (comp: Company) => {
    if (window.confirm(`Are you sure you want to delete ${comp.name}?`)) {
      StorageService.deleteCompany(comp.id);
      setCompanies(StorageService.getCompanies());
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = formData.requiredSkillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const compData: Company = {
      id: editingCompany ? editingCompany.id : `comp-${Date.now()}`,
      name: formData.name,
      industry: formData.industry,
      location: formData.location,
      website: formData.website,
      description: formData.description,
      packageRange: formData.packageRange,
      minCgpa: formData.minCgpa,
      requiredSkills: skillsArray,
      activeJobsCount: editingCompany ? editingCompany.activeJobsCount : 1,
      logoColor: 'from-indigo-600 to-blue-600',
    };

    StorageService.saveCompany(compData);
    setCompanies(StorageService.getCompanies());
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Company Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Maintain recruiting corporate partners, criteria standards, and tier allocations
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Corporate Partner</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search corporate partners by name, industry, or location..."
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompanies.map((comp) => (
          <div
            key={comp.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {comp.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight">{comp.name}</h3>
                    <p className="text-xs text-slate-500">{comp.industry}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(comp)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit company"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(comp)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete company"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                {comp.description}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Package Range
                  </span>
                  <span className="font-bold text-slate-900">{comp.packageRange}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Min CGPA Cutoff
                  </span>
                  <span className="font-bold text-indigo-700">{comp.minCgpa.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Key Skill Demands:
                </span>
                <div className="flex flex-wrap gap-1">
                  {comp.requiredSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {comp.location}
              </span>
              <a
                href={comp.website}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Career Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingCompany ? `Edit Partner: ${editingCompany.name}` : 'Register New Corporate Partner'}
          subtitle="Define eligibility baselines, package ranges, and required competencies"
          maxWidth="xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Industry Sector *</label>
                <input
                  type="text"
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location / Hubs *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Website URL</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Package Range *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹12 - ₹16 LPA"
                  value={formData.packageRange}
                  onChange={(e) => setFormData({ ...formData, packageRange: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Minimum Baseline CGPA *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={10}
                  required
                  value={formData.minCgpa}
                  onChange={(e) =>
                    setFormData({ ...formData, minCgpa: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Required Core Skills (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Java, Python, SQL, Data Structures"
                  value={formData.requiredSkillsStr}
                  onChange={(e) => setFormData({ ...formData, requiredSkillsStr: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Company Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                {editingCompany ? 'Save Changes' : 'Create Partner Record'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
