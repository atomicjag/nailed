const tableCustomers = document.getElementById("customers");
const divFilters = document.getElementById("filters");
let formFilters = createFilters();
divFilters.appendChild(formFilters);
const url = 'https://api.myjson.com/bins/1eyqeh';
let allData = null;
fetch(url)
.then((resp) => resp.json())
.then(function(data) {
  allData = data;
  fillTable(false);
}).catch(function(error) {
  console.log(error);
});

function createHeader(customer, showDiscount) {
  let tableHeader = document.createElement('tr');
  const { _id, eventID, index, guid, ...noIDs } = customer;
  for (const key of Object.keys(noIDs)) {
    let th = document.createElement('th');
    th.innerHTML = capitalizeWord(key);
    tableHeader.appendChild(th);
  }
  if (showDiscount) {
    let th = document.createElement('th');
    th.innerHTML = "Discount";
    tableHeader.appendChild(th);
  }

  return tableHeader;
}

function fillTable(showDiscount) {
  tableCustomers.innerHTML = "";
  let customers = applyFilter(allData);
  if (customers != null && customers.length > 0) {
    let totalBalance = 0;
    let spanCount = 0;
    let tableHeader = createHeader(customers[0], showDiscount);
    tableCustomers.appendChild(tableHeader);
    customers.map(customer => {
      const { _id, eventID, index, guid, ...noIDs } = customer;
      let tr = document.createElement('tr');
      spanCount = Object.keys(noIDs).length;
      for (const key of Object.keys(noIDs)) {
        let td = document.createElement('td');
        if (key === 'isActive') {
          if (noIDs[key]) {
            td.innerHTML = '&#10003';
          } else {
            td.innerHTML = 'x';
          }
        } else if (key === 'registered') {
          let date = new Date(noIDs[key].replace(' ', ''));
          td.innerHTML = date.toLocaleString();
        } else {
          td.innerHTML = noIDs[key];
        }
        tr.appendChild(td);
      }
      totalBalance = parseFloat(totalBalance) + parseFloat(noIDs['balance'].replace(',', ''));
      if (showDiscount) {
        let td = document.createElement('td');
        const discount = (parseFloat(noIDs['balance'].replace(',', '')) * parseFloat(0.1)).toFixed(2);
        td.innerHTML = discount;
        tr.appendChild(td);
      }
      tableCustomers.appendChild(tr);
    });
    let trTotal = document.createElement('tr');
    let tdBalance = document.createElement('td');
    tdBalance.setAttribute("colspan", spanCount);
    tdBalance.innerHTML = "TOTAL BALANCE: " + totalBalance.toLocaleString();
    trTotal.appendChild(tdBalance);
    tableCustomers.appendChild(trTotal);
  } else {
    let trEmpty = document.createElement('tr');
    let tdEmpty = document.createElement('td');
    tdEmpty.innerHTML = "No Customers";
    trEmpty.appendChild(tdEmpty);
    tableCustomers.appendChild(trEmpty);
  }
}

function createFilters() {
  let formFilters = document.createElement('form');

  let inputAll = document.createElement('input');
  let labelAll = document.createElement('label');
  let spanAll = document.createElement('span');
  spanAll.innerHTML = "All";
  inputAll.setAttribute("id", "filterAll");
  inputAll.setAttribute("type", "radio");
  inputAll.setAttribute("name", "filter");
  inputAll.setAttribute("value", "all");
  inputAll.setAttribute("checked", true);
  inputAll.setAttribute("onchange", "fillTable(false)");
  labelAll.appendChild(inputAll);
  labelAll.appendChild(spanAll);
  formFilters.appendChild(labelAll);

  let inputInsolvent = document.createElement('input');
  let labelInsolvent = document.createElement('label');
  let spanInsolvent = document.createElement('span');
  spanInsolvent.innerHTML = "Insolvent";
  inputInsolvent.setAttribute("id", "filterInsolvent");
  inputInsolvent.setAttribute("type", "radio");
  inputInsolvent.setAttribute("name", "filter");
  inputInsolvent.setAttribute("value", "insolvent");
  inputInsolvent.setAttribute("onchange", "fillTable(false)");
  labelInsolvent.appendChild(inputInsolvent);
  labelInsolvent.appendChild(spanInsolvent);
  formFilters.appendChild(labelInsolvent);

  let inputInactive = document.createElement('input');
  let labelInactive = document.createElement('label');
  let spanInactive = document.createElement('span');
  spanInactive.innerHTML = "Inactive";
  inputInactive.setAttribute("id", "filterInactive");
  inputInactive.setAttribute("type", "radio");
  inputInactive.setAttribute("name", "filter");
  inputInactive.setAttribute("value", "inactive");
  inputInactive.setAttribute("onchange", "fillTable(true)");
  labelInactive.appendChild(inputInactive);
  labelInactive.appendChild(spanInactive);
  formFilters.appendChild(labelInactive);

  return formFilters;
}

function applyFilter(data) {
  const customers = data;
  let filter = document.getElementById("filterAll");
  if (filter.checked) {
    return customers;
  } else {
    filter = document.getElementById("filterInsolvent");
    if (filter.checked) {
      return customers.filter(customer => parseFloat(customer['balance'].replace(',', '')) < 0);
    } else {
      filter = document.getElementById("filterInactive");
      if (filter.checked) {
        return customers.filter(customer => customer['isActive'] === false);
      }
    }
  }
}

function capitalizeWord(word) {
  return (word.charAt(0).toUpperCase() + word.substr(1));
}
