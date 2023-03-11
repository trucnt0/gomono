import React, { useState, useEffect } from 'react'
import { Chart } from 'primereact/chart'
import Page from '@/components/page'
import { IoBarChart } from 'react-icons/io5'
import httpClient from '@/utils/httpClient'
import { ProjectByLead } from './projectByLead'

function Dashboard() {
    const [chartData, setChartData] = useState({})
    const [chartOptions, setChartOptions] = useState({})

    useEffect(() => {
        loadProjectCountByLead()
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


    return (
        <Page icon={<IoBarChart />} title='Dashboard' subTitle='Project & task allocation tracking'>
            <div className='flex flex-column gap-3'>
                <div className="grid">
                    <div className="col-12 md:col-6 lg:col-3">
                        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">Orders</span>
                                    <div className="text-900 font-medium text-xl">152</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-shopping-cart text-blue-500 text-xl"></i>
                                </div>
                            </div>
                            <span className="text-green-500 font-medium">24 new </span>
                            <span className="text-500">since last visit</span>
                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">
                        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">Revenue</span>
                                    <div className="text-900 font-medium text-xl">$2.100</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-map-marker text-orange-500 text-xl"></i>
                                </div>
                            </div>
                            <span className="text-green-500 font-medium">%52+ </span>
                            <span className="text-500">since last week</span>
                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">
                        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">Customers</span>
                                    <div className="text-900 font-medium text-xl">28441</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-inbox text-cyan-500 text-xl"></i>
                                </div>
                            </div>
                            <span className="text-green-500 font-medium">520  </span>
                            <span className="text-500">newly registered</span>
                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">
                        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">Comments</span>
                                    <div className="text-900 font-medium text-xl">152 Unread</div>
                                </div>
                                <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                    <i className="pi pi-comment text-purple-500 text-xl"></i>
                                </div>
                            </div>
                            <span className="text-green-500 font-medium">85 </span>
                            <span className="text-500">responded</span>
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