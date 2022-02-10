// Airtable bases with table fields

// shared by both members.listsUnsubscribed and emails.mailingLists
const listNewsletter = 'Newsletter'

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
    practiceSetting: 'practice_setting', // single select
    practiceAreas: 'practice_areas', // string
    interestGroups: 'interest_groups',
    gradYear: 'grad_year',
    lawSchool: 'law_school',
    payments: 'payments',
    ageRange: 'age_range',
    race: 'race_ethnicity',
    sexGender: 'sex_gender',
    specialAccom: 'special_accom',
    howFound: 'how_found',
    stripeId: 'stripe_id',
    lastLoggedIn: '_last_logged_in',
    coupons: 'coupons',

    listsUnsubscribed: 'exclude_mailings',
    listNewsletter,
    listMembers: 'Members',
    listLawNotes: 'Law Notes',

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
    mailingLists: 'mailing_lists',
    listNewsletter,

    // temp field
    inactve: "__inactive",
  },
  // members base: payments table
  payments: {
    date: 'date',
    plans: 'plans',
    coupon_id: 'stripe_coupon',
    coupon_name: 'coupon_name',
    discount: 'discount',
    total: 'total',
    invoiceId: '_stripe_invoice_id',
    invoicePdf: '_stripe_invoice_pdf',
    invoiceUrl: '_stripe_invoice_url',
  },
  // members base: plans table
  plans: {
    name: 'name',
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
  groups: {
    name: 'name',
    type: 'type', // "attorney" or "student"
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
