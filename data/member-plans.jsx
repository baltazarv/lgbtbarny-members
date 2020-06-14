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
