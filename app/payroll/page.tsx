"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PayrollEntry {
  id: number
  name: string
  title: string
  experience: number
  designation: string
  totalWages: string
  hourlyRate: string
  bonus: string
  dateStarted: string
  dateLeft?: string
}

const payrollData: PayrollEntry[] = [
  {
    id: 1,
    name: "John Doe",
    title: "Software Engineer",
    experience: 5,
    designation: "P.Eng",
    totalWages: "$120,000",
    hourlyRate: "$60",
    bonus: "$5,000",
    dateStarted: "15/01/2024",
  },
  {
    id: 2,
    name: "Jane Smith",
    title: "Project Manager",
    experience: 8,
    designation: "PMP",
    totalWages: "$135,000",
    hourlyRate: "$68",
    bonus: "$10,000",
    dateStarted: "01/03/2023",
  },
  {
    id: 3,
    name: "Mark Lee",
    title: "Data Analyst",
    experience: 3,
    designation: "B.Sc",
    totalWages: "$90,000",
    hourlyRate: "$45",
    bonus: "$3,000",
    dateStarted: "20/05/2023",
    dateLeft: "31/12/2023",
  },
]

export default function PayrollPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Years Exp.</TableHead>
              <TableHead>Designations / Qualifications</TableHead>
              <TableHead>Total T4 Salary</TableHead>
              <TableHead>Hourly Rate</TableHead>
              <TableHead>Bonus / Benefit</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrollData.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.name}</TableCell>
                <TableCell>{entry.title}</TableCell>
                <TableCell>{entry.experience}</TableCell>
                <TableCell>{entry.designation}</TableCell>
                <TableCell>{entry.totalWages}</TableCell>
                <TableCell>{entry.hourlyRate}</TableCell>
                <TableCell>{entry.bonus}</TableCell>
                <TableCell>{entry.dateStarted}</TableCell>
                <TableCell>{entry.dateLeft ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
