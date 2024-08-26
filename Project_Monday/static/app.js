function plotChart() {
    const jobTitle = document.getElementById('jobTitle').value;

    fetch(`/data?jobTitle=${jobTitle}`)
        .then(response => response.json())
        .then(data => {
            const yearsExperience = data.years_experience;
            const salary = data.salary;

            const ctx = document.getElementById('myChart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: `Salary vs Years of Experience (${jobTitle})`,
                        data: yearsExperience.map((value, index) => ({ x: value, y: salary[index] })),
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Years of Experience',
                            }
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Salary'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}