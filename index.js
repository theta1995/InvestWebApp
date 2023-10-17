
var myChart = new Chart($("#myChart"), {
  type: 'doughnut',
  data: {
    labels: [],
    datasets: [{
      label: 'Invested ($)',
      data: [],
      borderWidth: 1
    }]
  }
});

const tickers = [];
const amounts = [];

$("#insertNewBtn").on('click', function () {

  const ticker = $("#tickerInput").val().toUpperCase();
  const name = $("#nameInput").val().toUpperCase();
  const amount = $("#amountInput").val();
  const valid = ticker != "" && name != "" && amount != "";
  const unique = tickers.indexOf(ticker) < 0;

  if (valid && unique) {

    tickers.push(ticker);
    amounts.push(Number.parseFloat(amount));
    const allocation = getAllocations();
    const yahooLink = `https://finance.yahoo.com/quote/${ticker}`

    var newRow = $(`<tr></tr>`).append(
      $("<td></td>").append($(`<a target="_blank" href="${yahooLink}">${ticker}</a>`)),
      $("<td></td>").text(name),
      $(`<td class="amountColumn"></td>`).text(convertToCurrency(amount)),
      $(`<td class="allocationColumn" data-ticker="${ticker}" style="max-width: 30px"></td>`),
      $(`<td></td>`).append(
        $(`<button onclick="removeData(this)" data-ticker="${ticker}" title="Remove Investment."><i class="bi bi-trash"></i></button>`)
          .addClass("btn"))
    );

    $("#companyTableBody").prepend(newRow);

    // Clear inputs
    $("#tickerInput").val("");
    $("#nameInput").val("");
    $("#amountInput").val("");
      
    refreshAllocation(allocation);
    recreateChart();

  } else if (!unique) {
    alert("Duplicated ticker");
  } else {
    alert("Missing data");
  }
  
})

function convertToCurrency(number) {
  return parseFloat(number).toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  })
}

$("#insertNewBtn").on()

function recreateChart() {
  myChart.destroy();
  myChart = new Chart($("#myChart"), {
    type: 'doughnut',
    data: {
      labels: tickers,
      datasets: [{
        label: 'Invested ($)',
        data: amounts,
        borderWidth: 1
      }]
    }
  });
}

function removeData(e) {
  const index = tickers.indexOf($(e).attr("data-ticker"));
  tickers.splice(index, 1);
  amounts.splice(index, 1);
  recreateChart();
  $(e).closest("tr").remove();
  refreshAllocation(getAllocations());
}

function getAllocations(){
  let sum = 0;
  let i = 0;
  const allocations = {};

  if (amounts.length == 1) {
    sum = amounts[0];
  }
  else {
    amounts.forEach(number => {
      sum += number;
    });
  }

  tickers.forEach(ticker => {
    allocations[ticker] = (amounts[i] / sum * 100).toFixed(2);
    i++;
  });

  return allocations;
}

function refreshAllocation(allocation){
  $(".allocationColumn").each(function(){
    const ticker = $(this).attr("data-ticker");
    $(this).text(allocation[ticker] + "%");
  })
}