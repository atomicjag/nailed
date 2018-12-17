# nailed
I choose the table element to present the data. It is dynamically created in .js file. Header of the table is also dynamically created to show all properties of the customer object, except the ids  (_id, eventID, index, guid). This will enable the showing of some additional properties, in case they are being added to the 
customer object. Of course, in case the new property is of type Date, or float, some additional formating might have to take place.
Filters on the top of the table control which data is being shown, current options are:
- All customers
- Insolvent customers (customers with negative balance)
- Inactive customers

Total balance is calculated for the filtered data. So, if the table shows inactive customers, total balance of inactive customers is being shown, etc.
When inactive customers are shown, additional field appears at the end of the row - Discount.
The colour of the customer's row also indicates it's status, it's green for the customer who is active and his balance is positive, it is gray for the customer 
who is inactive, and it is red for the customer who has negative balance.
I have left the fetching of data to be executed once, not every time the filter changes, to minimize the calls to API.
Perhaps redux could be introduced to store the data, and react as the view library.
Also, a search field can be added to search for specific customers, by name, email, company, balance, etc.
Ordering of the customers in the table can be added, as well as some additional filters (above/below certain amount of balance).
Pagination should be introduced as well.
