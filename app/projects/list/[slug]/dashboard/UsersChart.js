"use client";
import { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { useRouter } from "next/navigation";

function UserChart({ userData, projectId, startDate, endDate }) {
  const router = useRouter();

  const chartRef = useRef(null);

  useEffect(() => {
    if (userData?.length > 0) {
      // Destroy the existing chart if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      // Render the new pie chart
      chartRef.current = renderPieChart(userData);
    }
  }, [userData]);

  const renderPieChart = (users) => {
    const labels = users.map((user) => user.full_name);

    const totalHours = users.map((user) => {
      const billable = parseFloat(user.billableHours.replace(":", ".")) || 0;

      const nonBillable =
        parseFloat(user.nonBillableHours.replace(":", ".")) || 0;

      return billable + nonBillable;
    });

    const brightColors = [
      "rgba(255, 99, 132, 0.7)",
      "rgba(255, 205, 86, 0.7)",
      "rgba(75, 192, 192, 0.7)",
      "rgba(255, 159, 64, 0.7)",
      "rgba(25, 1579, 94, 0.7)",
      "rgba(256, 189, 124, 0.7)",
      "rgba(200, 234, 70, 0.7)",
      "rgba(153, 102, 255, 0.7)",
      "rgba(255, 99, 255, 0.7)",
      "rgba(75, 192, 192, 0.7)",
      "rgba(255, 205, 86, 0.7)",
      "rgba(255, 159, 64, 0.7)",
      "rgba(25, 1579, 94, 0.7)",
      "rgba(256, 189, 124, 0.7)",
      "rgba(200, 234, 70, 0.7)",
    ];

    const radiusValues = totalHours.map((hours) => {
      return hours > 50 ? 50 : 30;
    });

    const chartOptions = {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: totalHours,
            backgroundColor: brightColors,
            hoverRadius: 0,
            borderColor: brightColors.map(
              (color) => `${color.substring(0, color.length - 4)}1)`
            ),
            borderWidth: 0,
            hoverBackgroundColor: brightColors.map(
              (color) => `${color.substring(0, color.length - 4)}9)`
            ),
            radius: radiusValues,
          },
        ],
      },
      options: {
        scales: { xAxes: [{ display: false }], yAxes: [{ display: false }] },
        tooltips: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: (tooltipItem, data) => {
              const datasetLabel = data.labels[tooltipItem.index];
              const value = data.datasets[0].data[tooltipItem.index];
              const user = users[tooltipItem.index];
              const totalHours = value.toFixed(2);

              return [`${datasetLabel}: ${totalHours} hours`].join("\n");
            },
          },
        },
        onClick: function (evt) {
          const activePoint = chartRef.current.getElementsAtEventForMode(
            evt,
            "point",
            chartRef.current.options
          );
          if (activePoint.length > 0) {
            const clickedIndex = activePoint[0]._index;
            const clickedUser = users[clickedIndex];
            router.push(`/graphrecord/?startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&userId=${clickedUser.id}`);
          }
        },
      },
    };

    // Create the new chart instance
    return new Chart("myChart2", chartOptions);
  };

  return (
    <div className=" flex">
      <div className="border border-gray-400 pt-0 rounded-xl w-full h-fit shadow-xl pb-2">
        {userData && userData.length > 0 ? (
          <canvas id="myChart2"></canvas>
        ) : (
          <div className="text-red-500 text-center p-4">
            No data available for the pie chart.
          </div>
        )}
      </div>
    </div>
  );
}

export default UserChart;
