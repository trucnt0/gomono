import React, { useState, useEffect } from 'react'
import { Chart } from 'primereact/chart'
import Page from '../../components/page'

function Dashboard() {

    const [chartData, setChartData] = useState({})
    const [chartOptions, setChartOptions] = useState({})

    const [chartData2, setChartData2] = useState({})
    const [chartOptions2, setChartOptions2] = useState({})

    useEffect(() => {

    }, [])

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement)
        const data = {
            labels: ['Uyen', 'Truc', 'Davlid'],
            datasets: [
                {
                    data: [540, 325, 702],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--green-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--green-400')
                    ]
                }
            ]
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

        const textColor = documentStyle.getPropertyValue('--text-color')
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary')
        const data2 = {
            labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
            datasets: [
                {
                    label: 'My First dataset',
                    borderColor: documentStyle.getPropertyValue('--bluegray-400'),
                    pointBackgroundColor: documentStyle.getPropertyValue('--bluegray-400'),
                    pointBorderColor: documentStyle.getPropertyValue('--bluegray-400'),
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--bluegray-400'),
                    data: [65, 59, 90, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    borderColor: documentStyle.getPropertyValue('--pink-400'),
                    pointBackgroundColor: documentStyle.getPropertyValue('--pink-400'),
                    pointBorderColor: documentStyle.getPropertyValue('--pink-400'),
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--pink-400'),
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
        }
        const options2 = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: textColorSecondary
                    }
                }
            }
        }

        setChartData2(data2)
        setChartOptions2(options2)
    }, [])


    return (
        <Page title='Dashboard' subTitle='Project & task allocation tracking'>
            <div className='flex justify-content-around'>
                <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
                <Chart type="radar" data={chartData2} options={chartOptions2} className="w-full md:w-30rem" />
            </div>
        </Page>
    )
}

export default Dashboard