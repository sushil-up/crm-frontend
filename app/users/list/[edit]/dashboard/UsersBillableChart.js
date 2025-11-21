import { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { useRouter } from "next/navigation";

function UsersBillableChart({ totalHours, projectId, startDate, endDate,id }) {
  const router = useRouter();
  const chartRef = useRef(null);

  useEffect(() => {
    if (totalHours && totalHours.totalBillable && totalHours.totalNonBillable) {
      renderPieChart(totalHours);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [totalHours]);

  const renderPieChart = (apiResponse) => {
    const totalBillableHours =
      parseFloat(apiResponse.totalBillable.replace(":", ".")) || 0;
    const totalNonBillableHours =
      parseFloat(apiResponse.totalNonBillable.replace(":", ".")) || 0;

    const formattedTotalBillableHours = totalBillableHours.toFixed(2);
    const formattedTotalNonBillableHours = totalNonBillableHours.toFixed(2);

    const newChart = new Chart("myChart", {
      type: "pie",
      data: {
        labels: ["Billable", "Non Billable"],
        datasets: [
          {
            data: [formattedTotalBillableHours, formattedTotalNonBillableHours],
            backgroundColor: ["rgba(73, 204, 144, 1)", "rgba(249, 62, 62, 1)"],
            borderColor: ["rgba(73, 204, 144, 1)", "rgba(249, 62, 62, 1)"],
            borderWidth: 0,
            hoverRadius: 0,
          },
        ],
      },
      options: {
        legend: { display: true, position: "bottom" },

        title: {
          display: true,
          text: `Total Billable: ${apiResponse.totalBillable}, Total Nonbillable: ${apiResponse.totalNonBillable}`,
        },
        hover: {
          mode: null,
        },
        onClick: function (evt) {
          const activePoints = newChart.getElementsAtEventForMode(
            evt,
            "point",
            newChart.options
          );
          if (activePoints.length > 0) {
            const clickedElementIndex = activePoints[0]._index;

            router.push(
              `/graphrecord?startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&isBillable=${
                clickedElementIndex === 0 ? 1 : 0
              }&userId=${id}`
            );
          }
        },
      },
    });

    chartRef.current = newChart;
  };

  return (
    <>
      <div className="flex">
        <div className="border border-gray-400 pt-0 rounded-xl w-full h-fit shadow-xl pb-2">
          {totalHours &&
          totalHours.totalBillable &&
          totalHours.totalNonBillable ? (
            <canvas id="myChart"></canvas>
          ) : (
            <div className="text-red-500 text-center p-4">
              No data available for the pie chart.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UsersBillableChart;
