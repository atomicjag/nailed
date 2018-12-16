const tableCustomers = document.getElementById("customers");
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
    th.innerHTML = createTitle(key);
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
      let style = "background-color: #c2f263";
      spanCount = Object.keys(noIDs).length;
      for (const key of Object.keys(noIDs)) {
        let td = document.createElement('td');
        if (key === 'isActive') {
          if (noIDs[key]) {
            td.innerHTML = '&#10003';
          } else {
            style = "background-color: #b3c0d3";
            td.innerHTML = 'x';
          }
        } else if (key === 'registered') {
          let date = new Date(noIDs[key].replace(' ', ''));
          td.innerHTML = date.toLocaleString();
        } else if (key === 'balance' && (parseFloat(customer['balance'].replace(',', '')) < 0)) {
          style = "background-color: #ed3434";
          td.innerHTML = noIDs[key];
        } else {
          td.innerHTML = noIDs[key];
        }
        tr.setAttribute("style", style);
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
    tdBalance.setAttribute("style", "font-weight: 700");
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

function applyFilter(data) {
  const customers = data;
  let filter = document.getElementById("filterAll");
  if (filter.checked || customers == null) {
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

function createTitle(text) {
  return text.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, function(str){ return str.toUpperCase(); });
}
