export const dbFields = {
  members: {
    emails: 'emails',

    // // calculating on this app instead
    // type: '_payment_last_type',
    // paymentLast: '_payment_last_date',
    // status: '_status', // _status on Airtable needs to be modified to return 'student' and 'attorney' instead of 'active'

    firstName: 'first_name',
    lastName: 'last_name',
    certify: 'certify',
    salary: 'salary',
    employer: 'employer',
    practiceSetting: 'practice_setting',
    practiceAreas: 'practice_areas',
    gradYear: 'grad_year',
    lawSchool: 'law_school',
    payments: 'payments',
    ageRange: 'age_range',
    race: 'race_ethnicity',
    sexGender: 'sex_gender',
    specialAccom: 'special_accom',
    howFound: 'how_found',
    valueLists: {
      // salaries: [],
      // certify: [],
      practiceSettings: [
        'Academia',
        'Company/Corporation',
        'Court',
        'Government',
        'Law Firm (2-10 Attorneys)',
        'Law Firm (11-25 Attorneys)',
        'Law Firm (26-50 Attorneys)',
        'Law Firm (51-100 Attorneys)',
        'Law Firm (100+ Attorneys)',
        'Nonprofit',
        'Solo Practitioner',
        'Other/Not Applicable',
      ],
      ageRanges: [
        '20-29',
        '30-39',
        '40-49',
        '50-59',
        '60-69',
        '70-79',
        '80+',
      ],
      sexGenders: [
        'asexual',
        'bisexual',
        'cisgender',
        'female',
        'gay',
        'lesbian',
        'male',
        'non-binary',
        'non-conforming',
        'pansexual',
        'queer',
        'straight',
        'transgender',
      ],
    }
  },
  emails: {
    email: 'email',
    verified: 'verified',
    newsletter: 'newsletter',
  },
  payments: {
    date: 'date',
    plans: 'plans',
    total: 'total',
  },
  plans: {
    type: 'type',
    termYears: 'term_years'
  }
};