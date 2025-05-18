"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Edit2, Trash2, Plus } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"

interface TimesheetEntry {
  id: number
  employee_id: string
  project: string
  total_hours_work: number
  project_hours: number
  sred_hours: number
  t4_salary: number
  daily_hours: number
  weekly_description: string
  employee_description: string
  work_date: string
}

interface Employee {
  id: string
  name: string
}

const initialForm: Omit<TimesheetEntry, "id"> = {
  employee_id: "",
  project: "",
  total_hours_work: 0,
  project_hours: 0,
  sred_hours: 0,
  t4_salary: 0,
  daily_hours: 0,
  weekly_description: "",
  employee_description: "",
  work_date: "",
}

export default function TimesheetPage() {
  const [timesheetData, setTimesheetData] = useState<TimesheetEntry[]>([])
  const [form, setForm] = useState<Omit<TimesheetEntry, "id">>(initialForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [showForm, setShowForm] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const { data } = await supabase.from("timesheet_per_employee").select("*").order("id", { ascending: false })
    if (data) setTimesheetData(data as TimesheetEntry[])
    setLoading(false)
  }

  const fetchEmployees = async () => {
    const { data } = await supabase.from("employees").select("id, name")
    if (data) setEmployees(data as Employee[])
  }

  useEffect(() => {
    fetchData()
    fetchEmployees()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name.includes("hours") || name === "t4_salary" || name === "total_hours_work" ? Number(value) : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (editingId) {
      await supabase.from("timesheet_per_employee").update(form).eq("id", editingId)
      setEditingId(null)
    } else {
      await supabase.from("timesheet_per_employee").insert([form])
    }
    setForm(initialForm)
    fetchData()
    setLoading(false)
  }

  const handleEdit = (entry: TimesheetEntry) => {
    setForm({ ...entry })
    setEditingId(entry.id)
  }

  const handleDelete = async (id: number) => {
    setLoading(true)
    await supabase.from("timesheet_per_employee").delete().eq("id", id)
    fetchData()
    setLoading(false)
  }

  // 계산 함수
  const calcPercentage = (entry: TimesheetEntry) => entry.total_hours_work ? (entry.sred_hours / entry.total_hours_work) * 100 : 0
  const calcSredAmount = (entry: TimesheetEntry) => (calcPercentage(entry) / 100) * entry.t4_salary
  const totalSredAmount = timesheetData.reduce((sum, entry) => sum + calcSredAmount(entry), 0)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
        Timesheet Per Employee
        <button
          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
          onClick={() => setShowForm((prev) => !prev)}
          title={showForm ? "Close form" : "Add new entry"}
        >
          <Plus className="w-5 h-5" />
        </button>
      </h1>
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-2 border p-4 rounded-md bg-gray-50">
          <div className="flex gap-2 flex-wrap">
            <select
              name="employee_id"
              value={form.employee_id}
              onChange={handleChange}
              className="border rounded px-2 py-1"
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
            <input name="project" value={form.project} onChange={handleChange} placeholder="Project" className="border rounded px-2 py-1" required />
            <input name="total_hours_work" type="number" step="0.01" value={form.total_hours_work} onChange={handleChange} placeholder="Total Hours Work" className="border rounded px-2 py-1" required />
            <input name="project_hours" type="number" step="0.01" value={form.project_hours} onChange={handleChange} placeholder="Hours Work / Project" className="border rounded px-2 py-1" required />
            <input name="sred_hours" type="number" step="0.01" value={form.sred_hours} onChange={handleChange} placeholder="Total SR&ED Hours" className="border rounded px-2 py-1" required />
            <input name="t4_salary" type="number" step="0.01" value={form.t4_salary} onChange={handleChange} placeholder="Total T4 Salary" className="border rounded px-2 py-1" required />
            <input name="daily_hours" type="number" step="0.01" value={form.daily_hours} onChange={handleChange} placeholder="Daily Hours" className="border rounded px-2 py-1" />
            <input name="work_date" type="date" value={form.work_date} onChange={handleChange} className="border rounded px-2 py-1" required />
            <textarea name="weekly_description" value={form.weekly_description} onChange={handleChange} placeholder="Weekly Work Description" className="border rounded px-2 py-1" />
            <textarea name="employee_description" value={form.employee_description} onChange={handleChange} placeholder="Employee Work Description" className="border rounded px-2 py-1" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50" disabled={loading}>{editingId ? "Update" : "Add"}</button>
            {editingId && (
              <button type="button" className="bg-gray-400 text-white px-4 py-1 rounded" onClick={() => { setForm(initialForm); setEditingId(null) }}>Cancel</button>
            )}
          </div>
        </form>
      )}
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Total Hours Work</TableHead>
              <TableHead>Hours Work / Project</TableHead>
              <TableHead>Total SR&ED Hours</TableHead>
              <TableHead>% per Project</TableHead>
              <TableHead>SR&ED Amount / Project</TableHead>
              <TableHead>Daily Hours</TableHead>
              <TableHead>Weekly Work Description</TableHead>
              <TableHead>Employee Work Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timesheetData.map((entry) => {
              const emp = employees.find(e => e.id === entry.employee_id)
              return (
                <TableRow key={entry.id}>
                  <TableCell>{entry.id}</TableCell>
                  <TableCell>{emp ? emp.name : entry.employee_id}</TableCell>
                  <TableCell>{entry.project}</TableCell>
                  <TableCell>{entry.total_hours_work}</TableCell>
                  <TableCell>{entry.project_hours}</TableCell>
                  <TableCell>{entry.sred_hours}</TableCell>
                  <TableCell>{calcPercentage(entry).toFixed(2)}%</TableCell>
                  <TableCell>{calcSredAmount(entry).toLocaleString(undefined, { style: "currency", currency: "USD" })}</TableCell>
                  <TableCell>{entry.daily_hours}</TableCell>
                  <TableCell>{entry.weekly_description}</TableCell>
                  <TableCell>{entry.employee_description}</TableCell>
                  <TableCell>{entry.work_date}</TableCell>
                  <TableCell className="space-x-2 flex">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full"
                      onClick={() => handleEdit(entry)}
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                      onClick={() => handleDelete(entry.id)}
                      disabled={loading}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              )
            })}
            <TableRow>
              <TableCell colSpan={7} className="text-right font-medium">Total SR&ED Amount</TableCell>
              <TableCell colSpan={6} className="font-medium">{totalSredAmount.toLocaleString(undefined, { style: "currency", currency: "USD" })}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
