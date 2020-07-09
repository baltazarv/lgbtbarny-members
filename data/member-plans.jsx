import { Select } from 'antd';

const { Option } = Select;

export const getStripePlan = (salaryKey) => {
  return 'xxx';
};

export const STRIPE_MEMBERSHIP_ID = 'prod_HP8GWNCnMR7Qoy';

export const SALARIES = {
  upTo30K: { label: 'Income Up to $30,000', fee: 40, stripePriceId: 'price_1GqJzwBBKyYy0mbAvT6qs7mY' },
  upTo50K: { label: 'Income Up to $50,000', fee: 55, stripePriceId: 'price_1GqJzwBBKyYy0mbAUlL1DuWm' },
  upTo75K: { label: 'Income Up to $75,000', fee: 80, stripePriceId: 'price_1GqJzwBBKyYy0mbAhROb7ah3' },
  upTo100K: { label: 'Income Up to $100,000', fee: 120, stripePriceId: 'price_1GqJzwBBKyYy0mbAwR6uJDrV' },
  upTo150K: { label: 'Income Up to $150,000', fee: 150, stripePriceId: 'price_1GqJzwBBKyYy0mbAjq7sICqI' },
  over150K: { label: 'Income Over $150,000', fee: 175, stripePriceId: 'price_1GqJzxBBKyYy0mbAq3nGVGIi' },
}

export const salaryOptions = () => {
  let options = [];
  for (const key in SALARIES) {
    const newObject = Object.assign({}, SALARIES[key], {key});
    options.push(<Option
        key={key}
        value={key}
      >
        {SALARIES[key].label}
      </Option>)
  }
  return options;
}

export const PRACTICE_SETTINGS = {
  solo: { label: 'Solo Practitioner' },
  firmTo10: { label: 'Law Firm (2-10 Attorneys)' },
  firmTo25: { label: 'Law Firm (11-25 Attorneys)' },
  firmTo50: { label: 'Law Firm (26-50 Attorneys)' },
  firmTo100: { label: 'Law Firm (51-100 Attorneys)' },
  firm100up: { label: 'Law Firm (100+ Attorneys)' },
  corp: { label: 'Company/Corporation' },
  nonprofit: { label: 'Nonprofit' },
  court: { label: 'Court' },
  gov: { label: 'Government' },
  academia: { label: 'Academia' },
  other: { label: 'Other/Not Applicable' },
};

export const practiceOptions = () => {
  let options = [];
  // const settings = {...PRACTICE_SETTINGS};
  for (const key in {...PRACTICE_SETTINGS}) {
    options.push(<Option
      key={key}
      value={key}
    >
      {PRACTICE_SETTINGS[key].label}
    </Option>)
  }
  return options;
}

export const gradYearOptions = () => {
  const thisYear = new Date().getFullYear();
  let years = [];
  for (let i = thisYear; i <= thisYear + 4; i++) {
    years.push(i);
  }
  const options = years.map((year) => <Option
      key={year}
      value={year}
    >
      {year}
    </Option>);
  return options;
};
