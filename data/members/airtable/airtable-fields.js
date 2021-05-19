// Airtable bases with table fields
exports.dbFields = {
  /** `members` base */
  // members base: members table
  members: {
    // // calculating on this app instead
    // type: '_payment_last_type',
    // paymentLast: '_payment_last_date',
    // status: '_status', // _status on Airtable needs to be modified to return 'student' and 'attorney' instead of 'active'

    firstName: 'first_name',
    lastName: 'last_name',
    emails: 'emails',
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
    stripeId: 'stripe_id',
    listsUnsubscribed: 'lists_unsubscribed',
    mailingLists: 'mailing_lists',
    lastLoggedIn: '_last_logged_in',

    // calc
    status: "_status",
    expDate: "_exp_date",
    gradDate: "_grad_date",
    
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
  // members base: emails table
  emails: {
    address: 'address',
    verified: 'verified',
    primary: 'primary',
    blocked: 'blocked', // rename

    // temp field
    inactve: "__inactive",
  },
  // members base: payments table
  payments: {
    date: 'date',
    plans: 'plans',
    discount: 'discount',
    total: 'total',
    invoiceId: '_stripe_invoice_id',
    invoicePdf: '_stripe_invoice_pdf',
    invoiceUrl: '_stripe_invoice_url',
  },
  // members base: plans table
  plans: {
    type: 'type',
    typeValues: {
      attorney: 'attorney',
      student: 'student',
      lawNotes: 'law-notes',
    },
    status: 'status',
    fee: 'fee',
    salary: 'salary',
    termYears: 'term_years',
    stripeId: 'stripe_id',
  },
  // members base: cles table
  cles: {
    title: 'title',
    date: 'date',
    pdf: 'pdf',
    agenda: 'agenda',
    creditsText: 'credits_text',
    creditsTotal: 'credits_total',
    attended: 'attended',
  },
  // members base: cle_certs table
  cle_certs: {
    title: 'title',
    date: 'date',
    cert: 'cert',
    creditsTotal: 'credits_total',
  },

  /** `law notes` base */
  lawNotes: {
    // issues table
    issues: {
      date: 'date',
      title: 'title',
      pdf: 'pdf',
      sample: 'sample',
    }
  },
};
