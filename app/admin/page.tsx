import StatCard from '@/components/StatCard'
import { getRecentAppointmentsList } from '@/lib/actions/appointment.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const AdminPage = async () => {
    const appointments = await getRecentAppointmentsList()
  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
        <header className='admin-header'>
            <Link href='cursor-pointer'>
            <div className="flex items-start">
            <Image
              src="/assets/icons/Logomark.svg"
              height={32}
              width={162}
              alt="logo"
              className="h-8 w-fit"
            ></Image>
            <p className="text-2xl">CarePlus+</p>
          </div></Link>

          <p className='text-16-semibold'>Admin Dashboard</p>
        </header>
        <div className="admin-main">
            <section className='w-full space-y-4'>
                <h1 className='header'>Welcome...</h1>
                <p className='text-dark-700'>Start the day by managing new appointments</p>
            </section>
            <section className='admin-stat'>
                <StatCard type="appointments" count={appointments.scheduledCount} label="Schedule Appointmetns" icon='/assets/icons/appointments.svg' />
                <StatCard type="pending" count={appointments.pendingCount} label="Pending Appointmetns" icon='/assets/icons/pending.svg' />
                <StatCard type="cancelled" count={appointments.cancelledCount} label="Cancelled Appointmetns" icon='/assets/icons/cancelled.svg' />
            </section>
        </div>
    </div>
  )
}

export default AdminPage