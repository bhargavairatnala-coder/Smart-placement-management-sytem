import React, { useState, useMemo } from 'react';
import {
  Eye,
  FileText,
} from 'lucide-react';
import { Student, PlacementStatus } from '../../types';
import { StorageService } from '../../services/storage';
import { SearchBar } from '../../components/common/SearchBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(() => StorageService.getStudents());
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const departments = useMemo(() => {
    const set = new Set(students.map((s) => s.department).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.department && s.department.toLowerCase().includes(q)) ||
        (s.skills && s.skills.some((sk) => sk.toLowerCase().includes(q)));

      const matchesDept = departmentFilter === 'All' || s.department === departmentFilter;
      const matchesStatus = statusFilter === 'All' || s.placementStatus === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [students, search, departmentFilter, statusFilter]);

  const handleUpdatePlacementStatus = (newStatus: PlacementStatus) => {
    if (!selectedStudent) return;
    const updated: Student = {
      ...selectedStudent,
      placementStatus: newStatus,
    };
    StorageService.saveStudent(updated);
    setStudents(StorageService.getStudents());
    setSelectedStudent(updated);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Student Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Directory of registered candidates, academic CGPAs, and verified placement statuses
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
          Total Candidates: {students.length}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs grid sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by student name, department, or skill (e.g. Java, Python)..."
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-indigo-600"
          >
            <option value="All">All Departments</option>
            {departments.filter((d) => d !== 'All').map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-indigo-600"
          >
            <option value="All">All Placement Statuses</option>
            <option value="Placed">Placed</option>
            <option value="In Process">In Process</option>
            <option value="Not Placed">Not Placed</option>
            <option value="Multiple Offers">Multiple Offers</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-5">Student Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Graduation</th>
                <th className="py-3 px-4">Skills</th>
                <th className="py-3 px-4">Placement Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5">
                    <span className="font-bold text-slate-900 block">{s.fullName}</span>
                    <span className="text-[11px] text-slate-400">{s.email}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{s.department}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <span
                      className={`px-2 py-0.5 rounded-md ${
                        s.cgpa >= 8.5
                          ? 'bg-emerald-50 text-emerald-700 font-bold'
                          : s.cgpa >= 7.5
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {s.cgpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{s.graduationYear}</td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {s.skills?.slice(0, 3).map((sk) => (
                        <span
                          key={sk}
                          className="px-1.5 py-0.5 text-[10px] rounded-md bg-slate-100 text-slate-700"
                        >
                          {sk}
                        </span>
                      ))}
                      {(s.skills?.length || 0) > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{s.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={s.placementStatus} size="sm" />
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => setSelectedStudent(s)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Profile</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Candidate Profile: ${selectedStudent.fullName}`}
          subtitle={`${selectedStudent.department} • CGPA: ${selectedStudent.cgpa.toFixed(2)}`}
          maxWidth="2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Update Status:</span>
                <select
                  value={selectedStudent.placementStatus}
                  onChange={(e) =>
                    handleUpdatePlacementStatus(e.target.value as PlacementStatus)
                  }
                  className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-800"
                >
                  <option value="Not Placed">Not Placed</option>
                  <option value="In Process">In Process</option>
                  <option value="Placed">Placed</option>
                  <option value="Multiple Offers">Multiple Offers</option>
                </select>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400">Institutional Email:</span>
                <p className="font-semibold text-slate-800">{selectedStudent.email}</p>
              </div>
              <div>
                <span className="text-slate-400">Phone Number:</span>
                <p className="font-semibold text-slate-800">{selectedStudent.phone}</p>
              </div>
              <div>
                <span className="text-slate-400">College / Institution:</span>
                <p className="font-semibold text-slate-800">{selectedStudent.collegeName}</p>
              </div>
              <div>
                <span className="text-slate-400">Location:</span>
                <p className="font-semibold text-slate-800">{selectedStudent.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100 text-center">
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Aggregate CGPA</span>
                <p className="text-base font-extrabold text-indigo-700">
                  {selectedStudent.cgpa.toFixed(2)}
                </p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Graduation Year</span>
                <p className="text-base font-extrabold text-slate-800">
                  {selectedStudent.graduationYear}
                </p>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Current Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedStudent.placementStatus} size="sm" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                Verified Technical Skills
              </h4>
              <div className="flex flex-wrap gap-1.5 p-3 bg-white border border-slate-200 rounded-xl">
                {selectedStudent.skills?.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md border border-slate-200"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold text-slate-800">{selectedStudent.resumeName}</span>
              </div>
              <span className="text-emerald-700 font-bold">Verified on Portal</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
