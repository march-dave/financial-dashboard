"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock } from "lucide-react"

interface TimesheetEntry {
  id: number
  employee: string
  project: string
  totalHours: number
  projectHours: number
  sredHours: number
  t4Salary: number
  dailyHours: number
  weeklyDescription: string
  employeeDescription: string
}

export default function TimesheetPage() {
  const [timesheetData, setTimesheetData] = useState<TimesheetEntry[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("timesheets").select("*")
      if (data) {
        setTimesheetData(data as TimesheetEntry[])
      }
    }
    fetchData()
  }, [])

  const calculatePercentage = (entry: TimesheetEntry) => {
    return entry.totalHours ? (entry.sredHours / entry.totalHours) * 100 : 0
  }

  const calculateSredAmount = (entry: TimesheetEntry) => {
    return (calculatePercentage(entry) / 100) * entry.t4Salary
  }

  const totalSredAmount = timesheetData.reduce(
    (sum, entry) => sum + calculateSredAmount(entry),
    0,
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
        <Clock className="h-6 w-6" /> Timesheet Per Employee
      </h1>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Total Hours Work</TableHead>
              <TableHead>Hours Work / Project</TableHead>
              <TableHead>Total SR&amp;ED Hours</TableHead>
              <TableHead>% per Project</TableHead>
              <TableHead>SR&amp;ED Amount / Project</TableHead>
              <TableHead>Daily Hours</TableHead>
              <TableHead>Weekly Work Description</TableHead>
              <TableHead>Employee Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timesheetData.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.employee}</TableCell>
                <TableCell>{entry.project}</TableCell>
                <TableCell>{entry.totalHours}</TableCell>
                <TableCell>{entry.projectHours}</TableCell>
                <TableCell>{entry.sredHours}</TableCell>
                <TableCell>{calculatePercentage(entry).toFixed(2)}%</TableCell>
                <TableCell>
                  {calculateSredAmount(entry).toLocaleString(undefined, {
                    style: "currency",
                    currency: "USD",
                  })}
                </TableCell>
                <TableCell>{entry.dailyHours}</TableCell>
                <TableCell>{entry.weeklyDescription}</TableCell>
                <TableCell>{entry.employeeDescription}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={6} className="text-right font-medium">
                Total SR&amp;ED Amount
              </TableCell>
              <TableCell colSpan={4} className="font-medium">
                {totalSredAmount.toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
