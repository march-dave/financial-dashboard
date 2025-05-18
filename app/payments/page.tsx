"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface Payment {
  id: number
  user_id: string
  amount: number
  payment_date: string
  description: string | null
  created_at: string
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    const fetchPayments = async () => {
      const { data } = await supabase.from("payments").select("*")
      if (data) setPayments(data as Payment[])
    }
    fetchPayments()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
      <div className="border rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap">{payment.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.user_id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(payment.payment_date).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 