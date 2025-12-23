# Expense Tracker CLI
[Beginner project from roadmap.sh](https://roadmap.sh/projects/expense-tracker)
## Requirements
This project requires **Node.js** to run. If you don't have Node, you can download it [here](https://nodejs.org/)
## Installing
Run the following commands to install the project and its dependencies:
```
git clone https://github.com/carolinanoda/expense-tracker.git
cd expense-tracker
npm install
```
## Usage
```
# Adding a new expense
node expense-tracker add --description "Lunch" --amount 20

# Listing expenses
node expense-tracker list

# Summary of expenses
node expense-tracker summary

# Summary of expenses by month
node expense-tracker summary --month 8

# Deleting expense
node expense-tracker delete --id 2

```
