document.addEventListener("DOMContentLoaded", () => {
  const myChart = document.querySelector(".my-chart");
  const ul = document.querySelector(".programming-stats .details ul");

  // Debugging: Check if chartData is defined and log it to the console
  console.log("Chart Data:", chartData);

  // Create the chart using Chart.js
  new Chart(myChart, {
      type: "doughnut",
      data: {
          labels: chartData.labels,
          datasets: [
              {
                  label: "User Categories",
                  data: chartData.data,
                  backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"], // Add colors if missing
              },
          ],
      },
      options: {
          borderWidth: 10,
          borderRadius: 2,
          hoverBorderWidth: 0,
          plugins: {
              legend: {
                  display: false,
              },
          },
      },
  });

  const populateUl = () => {
      chartData.labels.forEach((label, i) => {
          let li = document.createElement("li");
          li.innerHTML = `${label}: <span class='percentage'>${chartData.data[i]} users</span>`;
          ul.appendChild(li);
      });
  };

  populateUl();
});
