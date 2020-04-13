
const form = document.querySelector('.form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const inputData = {
    region: {
      name: document.querySelector('input[data-region-name]').value,
      avgAge: Number(document.querySelector('input[data-region-avgAge]').value),
      avgDailyIncomeInUSD: Number(document.querySelector('input[data-region-avgDailyIncomeInUSD]').value),
      avgDailyIncomePopulation: Number(document.querySelector('input[data-region-avgDailyIncomePopulation]').value)
    },
    periodType: document.querySelector('select[data-period-type]').value,
    timeToElapse: document.querySelector('input[data-time-to-elapse]').value,
    reportedCases: document.querySelector('input[data-reported-cases]').value,
    population: document.querySelector('input[data-population]').value,
    totalHospitalBeds: document.querySelector('input[data-total-hospital-beds]').value
  };

  const response = await fetch('https://my-covid19estimator.herokuapp.com/api/v1/on-covid-19', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(inputData)
  });

  const data = await response.json();

  const resultElement = document.querySelector('.result');
  const resultElementH1 = document.createElement('h2');
  resultElementH1.innerHTML = 'Result';
  resultElement.append(resultElementH1);


  const impactElement = document.createElement('article');
  const impactElementH1 = document.createElement('h3');
  impactElementH1.innerHTML = 'Impact';

  impactElement.append(impactElementH1);

  Object.keys(data.impact).forEach((key) => {
    const dataElement = document.createElement('p');
    dataElement.innerHTML = `<strong>${key}:</strong> ${data.impact[key]}`;
    impactElement.append(dataElement);
  });

  resultElement.append(impactElement);

  resultElement.focus();
});
