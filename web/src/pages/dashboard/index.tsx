import React, { useState, useEffect } from 'react'
import { Chart } from 'primereact/chart'
import Page from '@/components/page'
import { IoBarChart } from 'react-icons/io5'
import httpClient from '@/utils/httpClient'
import { ProjectByLead } from './projectByLead'
import { Stats } from './stats'

function Dashboard() {
    const [chartData, setChartData] = useState({})
    const [chartOptions, setChartOptions] = useState({})
    const [stats, setStats] = useState<Stats>()

    useEffect(() => {
        loadProjectCountByLead()
        loadStats()
    }, [])

    const loadProjectCountByLead = async () => {
        const result = await httpClient.get<ProjectByLead[]>("api/reports/project-count-by-lead")
        const data = {
            labels: result.map(r => r.fullName),
            datasets: [{ data: result.map(r => r.count) }]
        }
        const options = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                }
            }
        }

        setChartData(data)
        setChartOptions(options)
    }

    const loadStats = async () => {
        const result = await httpClient.get<Stats>("api/reports/stats")
        setStats(result)
    }

    return (
        <Page icon={<IoBarChart />} title='Dashboard' subTitle='Project & task allocation tracking'>
            <div className='flex flex-column gap-3'>
                <div className="grid">
                    <div className="col-12 md:col-6 lg:col-4">
                        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">Projects</span>
                                    <div className="text-900 font-medium text-xl">{stats?.projectCount}</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-shopping-cart text-blue-500 text-xl"></i>
                                </div>
                            </div>
                            <span className="text-green-500 font-medium">{stats?.todayProjectCount} </span>
                            <span className="text-500">created today</span>
                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-4">
                        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">Active Projects</span>
                                    <div className="text-900 font-medium text-xl">{stats?.activeProjectCount}</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-map-marker text-orange-500 text-xl"></i>
                                </div>
                            </div>
                            <span className="text-green-500 font-medium">{stats?.inactiveProjectCount} </span>
                            <span className="text-500">stale projects</span>
                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-4">
                        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">Users</span>
                                    <div className="text-900 font-medium text-xl">{stats?.userCount}</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-inbox text-cyan-500 text-xl"></i>
                                </div>
                            </div>
                            <span className="text-green-500 font-medium">{stats?.todayUserCount} </span>
                            <span className="text-500">newly registered</span>
                        </div>
                    </div>
                </div>

                <div className='flex gap-3'>
                    <div className='surface-0 shadow-2 p-3 border-1 border-50 border-round'>
                        <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
                    </div>
                </div>
            </div>
        </Page>
    )
}

export default Dashboard