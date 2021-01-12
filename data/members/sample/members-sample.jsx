const users = {
  attorney: {
    id: '1b25f567-baa8-42da-8c64-85b1ef699d07',
    sample: true,
    auth: {
      picture: '/images/users/denzel.jpg',
    },
    fields: {
      "_payment_last_type": "attorney",
      "_payment_last_date": '4/5/2019',
      "_status": 'active',
      "first_name": 'Joe',
      "last_name": 'Miller',
      certify: 'A member of the bar in good standing',
      salary: 'Income Up to $150,000',
      employer: 'Cravath, Swaine & Moore LLP',
      "practice_areas": 'nonprofit',
      emails: [
        {
          id: '8011f1cb-d0f7-4537-8485-b757b3a82983',
          fields: {
            email: 'joe_miller@example.com',
            verified: true,
          }
        },
        {
          id: '57d58329-724b-43f0-a3d0-d0f3abfad7d1',
          fields: {
            email: 'joe@miller.com',
            verified: false,
          }
        },
      ],
      // review
      password: 'rX@J88aD',
      phone: '917-000-0000',
      "age_range": '30-39',
      race: 'Black',
      gender: 'Queer',
      memberstart: '4/5/2010',
      donation: 100,
      stripeCustomerId: 'cus_HPCQyo4yZKxSOY',
    }
  },
  student: {
    id: 'fde7d412-0336-4c17-81f9-438256f831e3',
    sample: true,
    auth: {
      picture: '/images/users/reese.jpg',
    },
    fields: {
      "_payment_last_type": "student",
      "first_name": 'Elle',
      "last_name": 'Woods',
      "law_school": 'Columbia Law School',
      certify: 'A law student',
      "grad_year": 2021,
      emails: [
        {
          id: 'c7dad4b9-8b45-4425-8932-73b90a0d92d9',
          fields: {
            email: 'elle_woods@example.com',
            verified: false,
          }
        }
      ],
      // review
      password: 'vW29my$F',
      phone: '718-000-0000',
      "age_range": '20-29',
      race: 'white',
      gender: 'lesbian',
      stripeCustomerId: 'cus_HPCPEND8CHcBXT',
    }
  },
  nonMember: {
    id: '0e0ae8bc-7bae-43f0-8e80-9fe4d6e4deb0',
    sample: true,
    auth: {
      picture: '/images/users/river.jpg',
    },
    fields: {
      "_payment_last_type": "non-member",
      "first_name": 'Mikey',
      "last_name": 'Waters',
      // certify: 'Not an attorney nor a law student',
      "age_range": '40-49',
      // review
      emails: [
        {
          id: '34cc9b0d-9482-4110-9e67-0054a99fed61',
          fields: {
            email: 'mikey_waters@example.com',
            verified: false,
          }
        }
      ],
      password: 'abc',
      phone: '212-000-0000',
      race: 'Azerbaijan',
      gender: 'gay, trans, he/his/him',
      stripeCustomerId: 'cus_HPCRNIKlfW7I8W',
    }
  },
};

export default users;
