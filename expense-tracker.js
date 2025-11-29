const { Command } = require("commander");
const fs = require("fs");
const program = new Command();

const date = new Date();

program.name("expense-tracker").description("CLI of a simple expense tracker");

program
  .command("add")
  .requiredOption("--description <string>", "expense description")
  .requiredOption("--amount <number>", "expense value")
  .action((expense) => {
    fs.readFile("expenses.json", "utf8", (err, data) => {
      if (err) {
        const firstExpense = [
          {
            id: 1,
            description: expense.description,
            amount: expense.amount,
            date: date.toISOString().split("T")[0],
          },
        ];

        fs.writeFile("expenses.json", JSON.stringify(firstExpense), (err) => {
          if (err) throw err;
        });
        console.log("Expense added successfully (ID: 1)");
      } else {
        const expenseArray = JSON.parse(data);
        const lastExpense = expenseArray.at(-1);
        const currentId = lastExpense.id + 1;

        expenseArray.push({
          id: currentId,
          description: expense.description,
          amount: expense.amount,
          date: date.toISOString().split("T")[0],
        });

        fs.writeFile("expenses.json", JSON.stringify(expenseArray), (err) => {
          if (err) throw err;
        });
        console.log(`Expense added successfully (ID: ${currentId})`);
      }
    });
  });

program
  .command("update")
  .requiredOption("--id <int>", "id of the expense to be updated")
  .option("--description <string>", "new description")
  .option("--amount <number>", "new amount")
  .action((expense) => {
    fs.readFile("expenses.json", "utf8", (err, data) => {
      if (err) {
        console.log("No expense listed");
        return;
      }

      const expenseArray = JSON.parse(data);
      let expenseFound = false;
      for (let e of expenseArray) {
        if (e.id == expense.id) {
          expenseFound = true;
          if (expense.description == undefined && expense.amount == undefined) {
            console.log("Choose an option to update");
          } else if (expense.description == undefined) {
            e.amount = expense.amount;
          } else if (expense.amount == undefined) {
            e.description = expense.description;
          } else {
            e.description = expense.description;
            e.amount = expense.amount;
          }

          e.date = date.toISOString().split("T")[0];

          fs.writeFile("expenses.json", JSON.stringify(expenseArray), (err) => {
            if (err) throw err;
          });
          console.log("Expense updated successfully");
          break;
        }
      }
      if (!expenseFound) {
        console.log("Expense not found");
      }
    });
  });

program
  .command("delete")
  .requiredOption("--id <int>", "id of the expense to be deleted")
  .action((expense) => {
    fs.readFile("expenses.json", "utf8", (err, data) => {
      if (err) {
        console.log("No expense listed with this id");
        return;
      }
      const expenseArray = JSON.parse(data);

      let idFound = false;
      for (let e of expenseArray) {
        if (expense.id == e.id) {
          idFound = true;
          expenseArray.splice(expenseArray.indexOf(e), 1);
          fs.writeFile("expenses.json", JSON.stringify(expenseArray), (err) => {
            if (err) throw err;
          });
          console.log("Expense deleted successfully");
          break;
        }
      }
      if (expenseArray.length == 0) {
        fs.unlink("expenses.json", (err) => {
          if (err) throw err;
        });
      }
      if (!idFound) {
        console.log("Expense not found");
      }
    });
  });

program.command("list").action(() => {
  fs.readFile("expenses.json", "utf8", (err, data) => {
    if (err) {
      console.log("No expense listed");
      return;
    }

    const expenseArray = JSON.parse(data);
    console.log("ID\tDate\t\tDescription\tAmount");
    for (let e of expenseArray) {
      console.log(
        e.id + "\t" + e.date + "\t" + e.description + "\t\t$" + e.amount
      );
    }
  });
});

program
  .command("summary")
  .option("--month <number>", "number of month to be summarized")
  .action((summary) => {
    fs.readFile("expenses.json", "utf8", (err, data) => {
      if (err) {
        console.log("No expense listed");
        return;
      } else if (summary.month == undefined) {
        const expenseArray = JSON.parse(data);
        let amount = 0;
        for (let e of expenseArray) {
          amount += parseInt(e.amount);
        }
        console.log("Total expenses: $" + amount);
      } else {
        const expenseArray = JSON.parse(data);
        let amount = 0;
        for(let e of expenseArray) {
          if(summary.month == parseInt(e.date.split("-")[1])) {
            amount += parseInt(e.amount);
          }
        }
        console.log(`Total expenses for month ${summary.month}: ${amount}`);
      }
    });
  });

program.parse();
