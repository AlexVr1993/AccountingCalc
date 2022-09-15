class Table {
  getData(row, column) {
    const tableRowData = this.tableRows.get(row);
    const tableColumnData = this.tableColumns.get(column);
  
    return tableRowData[tableColumnData];
  }
}
class Table1 extends Table {
  tableColumns = new Map([
    ['until5', 0],
    ['until10', 1],
    ['until15', 2],
    ['until20', 3],
    ['until30', 4],
    ['until40', 5],
    ['until50', 6],
    ['until60', 7],
    ['until70', 8],
    ['until80', 9],
    ['until90', 10],
    ['until100', 11]
  ]);

  tableRows = new Map([
    ['osno', [2610, 3930, 6130, 8330, 11630, 16030, 20430, 24830, 29230, 33630, 38030, 42430]],
    ['usn15', [2060, 3050, 4700, 6350, 8825, 12125, 15425, 18725, 22025, 25325, 28625, 31925]],
    ['usn6', [1800, 2630, 4015, 5403, 7483, 10253, 13025, 15798, 18568, 21343, 24113, 26885]],
    ['patent', [1510, 2170, 3270, 4370, 6020, 8220, 10420, 12620, 14820, 17020, 19220, 21420]],
    ['usnPatent', [2390, 3580, 5560, 7540, 10510, 14470, 18430, 22390, 26350, 30310, 34270, 38230]],
    ['osnoPatent',[2720, 4108, 6418, 8728, 12193, 16813, 21433, 26053, 30673, 35293, 39913, 44533]]
  ]);
}

class Form {
  formValue = {
    firstTimeTypingControlValue: true,
    manualyOperationCountControlValue: 1,
    employeesCountControlValue: 1
  };

  constructor() {
    this.taxationControl = document.getElementById('taxationControl');
    this.operationCountControl = document.getElementById('operationCountControl');
    this.employeesCountControl = document.getElementById('employeesCountControl');
    this.firstTimeTypingControl = document.getElementById('firstTimeTypingControl');
    this.manualyOperationCountControl = document.getElementById('manualyOperationCountControl')
  }

  initChangeListener(callback) {
    this.taxationControl.addEventListener('change', event => {
      const taxationControlValue = event.target.value;
      this.updateFormValue({ taxationControlValue })
      callback();
    });

    this.operationCountControl.addEventListener('change', event => {
      const operationCountControlValue = event.target.value;
      this.updateFormValue({ operationCountControlValue })
      callback();
    });

    this.employeesCountControl.addEventListener('change', event => {
      const employeesCountControlValue = event.target.value;
      this.updateFormValue({ employeesCountControlValue })
      callback();
    });

    this.manualyOperationCountControl.addEventListener('keyup', event => {
      let manualyOperationCountControlValue;

      if (event.target.value > 100) {
        this.manualyOperationCountControl.value = 100;
        manualyOperationCountControlValue = 100;
      } else {
        manualyOperationCountControlValue = event.target.value;
      }

      this.updateFormValue({ manualyOperationCountControlValue })
      callback();
    }, false);

    this.manualyOperationCountControl.addEventListener('change', event => {
      let manualyOperationCountControlValue;

      if (event.target.value > 100) {
        this.manualyOperationCountControl.value = 100;
        manualyOperationCountControlValue = 100;
      } else {
        manualyOperationCountControlValue = event.target.value;
      }

      this.updateFormValue({ manualyOperationCountControlValue })
      callback();
    }, false);

    this.firstTimeTypingControl.addEventListener('change', event => {
      const firstTimeTypingControlValue = event.target.checked;

      if (firstTimeTypingControlValue) {
        this.hideControl(this.operationCountControl);
        this.showControl(this.manualyOperationCountControl);
        
        this.updateFormValue({ operationCountControlValue: 1 });
        this.operationCountControl.value = 'default';

      } else {
        this.hideControl(this.manualyOperationCountControl);
        this.showControl(this.operationCountControl);
        
        this.updateFormValue({ manualyOperationCountControlValue: 1 });
        this.manualyOperationCountControl.value = 1;
      }

      this.updateFormValue({ firstTimeTypingControlValue })
      callback();
    });
  }

  updateFormValue(value) {
    this.formValue = { ...this.formValue, ...value };
  }

  getFormValue() {
    return this.formValue;
  }

  showControl(control) {
    control.classList.remove("hidden");
  }

  hideControl(control) {
    control.classList.add("hidden");
  }
}

class Calc {
  operationCost = 150;
  taxMultiplierMap = new Map([
    ['osno', 1],
    ['usn15', 0.75],
    ['usn6', 0.63],
    ['patent', 0.5],
    ['usnPatent', 0.9],
    ['osnoPatent', 1.05]
  ]);

  constructor() {
    this.totalView = document.getElementById('totalView');
    this.table1 = new Table1();
    this.form = new Form();
  }

  initFormChangeListener() {
    this.form.initChangeListener(this.calc.bind(this));
  }

  getTableData(row, column) {
    return this.table1.getData(row, column);
  }

  getTaxMultiplier(taxation) {
    return this.taxMultiplierMap.get(taxation);
  }

  calc() {
    let result = 0;
    const {
      taxationControlValue,
      operationCountControlValue,
      employeesCountControlValue,
      firstTimeTypingControlValue,
      manualyOperationCountControlValue
    } = this.form.formValue;

    if (taxationControlValue) {
      if (firstTimeTypingControlValue) {
        const taxMultiplier = this.getTaxMultiplier(taxationControlValue);
        result = (manualyOperationCountControlValue * this.operationCost * taxMultiplier) + employeesCountControlValue * 350;
      } else if (manualyOperationCountControlValue) {
        result = this.getTableData(taxationControlValue, operationCountControlValue) + employeesCountControlValue * 410;
      }

      this.display(result || '');
    }
  }

  display(value) {
    this.totalView.textContent = value;
  }
}

const calc = new Calc();

calc.initFormChangeListener();
