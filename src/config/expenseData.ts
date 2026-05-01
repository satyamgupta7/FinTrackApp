export type MonthRow = {
  month: string;
  paycheck: number;
  emi: number;
  invest: number;
  rent: number;
  insurance: number;
  medicine: number;
  personal: number;
  credit: number;
  familyCash: number;
  totalSpend: number;
  saving: number | null;
};

export type YearData = { year: string; months: MonthRow[] };

export const EXPENSE_DATA: YearData[] = [
  {
    year: '2024',
    months: [
      { month: 'Jan-24', paycheck: 94071,  emi: 26896, invest: 5000, rent: 5000, insurance: 0,     medicine: 0,     personal: 5000,  credit: 5000,  familyCash: 0,     totalSpend: 48000,  saving: null },
      { month: 'Feb-24', paycheck: 99500,  emi: 42978, invest: 5000, rent: 5000, insurance: 0,     medicine: 0,     personal: 5000,  credit: 25000, familyCash: 0,     totalSpend: 84000,  saving: null },
      { month: 'Mar-24', paycheck: 107000, emi: 42978, invest: 5000, rent: 5000, insurance: 0,     medicine: 11000, personal: 5000,  credit: 50000, familyCash: 10000, totalSpend: 130000, saving: null },
      { month: 'Apr-24', paycheck: 72000,  emi: 21581, invest: 5000, rent: 5000, insurance: 2000,  medicine: 0,     personal: 5000,  credit: 15394, familyCash: 0,     totalSpend: 76000,  saving: null },
      { month: 'May-24', paycheck: 72000,  emi: 21581, invest: 5000, rent: 5000, insurance: 2000,  medicine: 0,     personal: 5000,  credit: 21500, familyCash: 0,     totalSpend: 82000,  saving: null },
      { month: 'Jun-24', paycheck: 72000,  emi: 42978, invest: 5000, rent: 5000, insurance: 2000,  medicine: 0,     personal: 5000,  credit: 18000, familyCash: 19000, totalSpend: 98000,  saving: null },
      { month: 'Jul-24', paycheck: 72000,  emi: 45780, invest: 5000, rent: 5000, insurance: 2000,  medicine: 0,     personal: 5000,  credit: 20500, familyCash: 0,     totalSpend: 85000,  saving: null },
      { month: 'Aug-24', paycheck: 72000,  emi: 45780, invest: 5000, rent: 5000, insurance: 2000,  medicine: 0,     personal: 5000,  credit: 18500, familyCash: 23000, totalSpend: 105000, saving: null },
      { month: 'Sep-24', paycheck: 72000,  emi: 45780, invest: 5000, rent: 5000, insurance: 2000,  medicine: 4000,  personal: 5000,  credit: 16000, familyCash: 10000, totalSpend: 94000,  saving: null },
      { month: 'Oct-24', paycheck: 72000,  emi: 45780, invest: 5000, rent: 5000, insurance: 2000,  medicine: 0,     personal: 8000,  credit: 11000, familyCash: 0,     totalSpend: 78000,  saving: null },
      { month: 'Nov-24', paycheck: 72000,  emi: 45780, invest: 5000, rent: 5000, insurance: 2000,  medicine: 0,     personal: 5000,  credit: 5000,  familyCash: 7500,  totalSpend: 77000,  saving: 0 },
      { month: 'Dec-24', paycheck: 72000,  emi: 45780, invest: 5000, rent: 5000, insurance: 2000,  medicine: 5000,  personal: 10000, credit: 32000, familyCash: 19000, totalSpend: 125000, saving: 0 },
    ],
  },
  {
    year: '2025',
    months: [
      { month: 'Jan-25', paycheck: 131204, emi: 45780, invest: 10000, rent: 6000, insurance: 13160, medicine: 4000,  personal: 2500,  credit: 38000, familyCash: 31500, totalSpend: 150940, saving: -19736 },
      { month: 'Feb-25', paycheck: 131204, emi: 45780, invest: 10000, rent: 6000, insurance: 2000,  medicine: 3000,  personal: 10000, credit: 0,     familyCash: 26500, totalSpend: 103280, saving: 27924 },
      { month: 'Mar-25', paycheck: 131203, emi: 45780, invest: 10000, rent: 6000, insurance: 2000,  medicine: 6000,  personal: 9000,  credit: 0,     familyCash: 0,     totalSpend: 78780,  saving: null },
      { month: 'Apr-25', paycheck: 131203, emi: 45780, invest: 10000, rent: 6000, insurance: 2000,  medicine: 3600,  personal: 2000,  credit: 27925, familyCash: 0,     totalSpend: 97305,  saving: null },
      { month: 'May-25', paycheck: 129000, emi: 45780, invest: 10000, rent: 6000, insurance: 2000,  medicine: 4000,  personal: 6000,  credit: 20755, familyCash: 12250, totalSpend: 106785, saving: null },
      { month: 'Jun-25', paycheck: 132000, emi: 45780, invest: 10000, rent: 6000, insurance: 2000,  medicine: 9000,  personal: 2000,  credit: 24000, familyCash: 0,     totalSpend: 98780,  saving: null },
      { month: 'Jul-25', paycheck: 113500, emi: 45780, invest: 10000, rent: 6000, insurance: 2000,  medicine: 12000, personal: 3000,  credit: 12500, familyCash: 20000, totalSpend: 111280, saving: null },
      { month: 'Aug-25', paycheck: 116250, emi: 45780, invest: 10000, rent: 6000, insurance: 2000,  medicine: 5000,  personal: 3500,  credit: 12000, familyCash: 7000,  totalSpend: 92000,  saving: null },
      { month: 'Sep-25', paycheck: 116250, emi: 45780, invest: 10000, rent: 6000, insurance: 2500,  medicine: 10000, personal: 6000,  credit: 1127,  familyCash: 40000, totalSpend: 121407, saving: null },
      { month: 'Oct-25', paycheck: 114660, emi: 45780, invest: 10000, rent: 6000, insurance: 2000,  medicine: 8300,  personal: 10000, credit: 11779, familyCash: 10500, totalSpend: 104359, saving: null },
      { month: 'Nov-25', paycheck: 117550, emi: 45780, invest: 10000, rent: 7000, insurance: 2000,  medicine: 10000, personal: 0,     credit: 23156, familyCash: 13000, totalSpend: 110936, saving: null },
      { month: 'Dec-25', paycheck: 115899, emi: 45780, invest: 8000,  rent: 7000, insurance: 1800,  medicine: 15000, personal: 5000,  credit: 16115, familyCash: 0,     totalSpend: 98695,  saving: null },
    ],
  },
  {
    year: '2026',
    months: [
      { month: 'Jan-26', paycheck: 116036, emi: 45780, invest: 8000, rent: 7000, insurance: 1800, medicine: 10000, personal: 7000,  credit: 19000, familyCash: 15000, totalSpend: 113580, saving: 3000   },
      { month: 'Feb-26', paycheck: 111207, emi: 45780, invest: 8000, rent: 7000, insurance: 1800, medicine: 10000, personal: 12000, credit: 23067, familyCash: 76000, totalSpend: 183647, saving: 17204  },
      { month: 'Mar-26', paycheck: 110361, emi: 44000, invest: 8000, rent: 7000, insurance: 1800, medicine: 12000, personal: 8000,  credit: 11920, familyCash: 15000, totalSpend: 107720, saving: 2456   },
      { month: 'Apr-26', paycheck: 110948, emi: 45780, invest: 8000, rent: 7000, insurance: 1800, medicine: 10000, personal: 14000, credit: 7174,  familyCash: 0,     totalSpend: 93754,  saving: -72440 },
      { month: 'May-26', paycheck: 110000, emi: 29698, invest: 8000, rent: 7000, insurance: 1800, medicine: 10000, personal: 0,     credit: 3000,  familyCash: 10000, totalSpend: 69498,  saving: 2641   },
      { month: 'Jun-26', paycheck: 110000, emi: 29698, invest: 8000, rent: 7000, insurance: 1800, medicine: 10000, personal: 0,     credit: 0,     familyCash: 8000,  totalSpend: 64498,  saving: 17194  },
      { month: 'Jul-26', paycheck: 110000, emi: 29698, invest: 8000, rent: 7000, insurance: 1800, medicine: 10000, personal: 0,     credit: 0,     familyCash: 0,     totalSpend: 56498,  saving: 40502  },
      { month: 'Aug-26', paycheck: 110000, emi: 29698, invest: 8000, rent: 7000, insurance: 1800, medicine: 10000, personal: 0,     credit: 0,     familyCash: 0,     totalSpend: 56498,  saving: 45502  },
      { month: 'Sep-26', paycheck: 110000, emi: 29698, invest: 8000, rent: 7000, insurance: 1800, medicine: 10000, personal: 0,     credit: 0,     familyCash: 0,     totalSpend: 56498,  saving: 53502  },
      { month: 'Oct-26', paycheck: 110000, emi: 29698, invest: 8000, rent: 7000, insurance: 1800, medicine: 10000, personal: 0,     credit: 0,     familyCash: 0,     totalSpend: 56498,  saving: 53502  },
      { month: 'Dec-26', paycheck: 100000, emi: 0,     invest: 0,    rent: 7000, insurance: 1800, medicine: 10000, personal: 0,     credit: 0,     familyCash: 0,     totalSpend: 18800,  saving: 81200  },
    ],
  },
];
