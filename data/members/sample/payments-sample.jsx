const paymentsSample = [
  {
    id: 'f835f15e-e7d0-40fa-8be3-33fc9016b0bc',
    fields: {
      date: '4/5/2021',
      plan_name: ['Income Over $150,000'],
      total: '250.00',
      // review
      card: '4242',
      url: '/pdfs/billing/invoice-simple-template.pdf',
      type: ['Membership', 'Donation'],
    },
  },
  {
    id: '8fc5c51f-11ef-4aee-8cb8-deea5594a76c',
    fields: {
      date: '4/4/2020',
      plan_name: ['Law Student'],
      total: '50.00',
      // review
      type: ['Event'],
      card: '4242',
      url: '/pdfs/billing/invoice-simple-template.pdf',
    }
  },
  {
    id: '0daf3b16-f24f-4232-9032-319454ef2d9d',
    fields: {
      date: '4/1/2019',
      plan_name: ['Income Over $150,000'],
      total: '150.00',
      // review
      type: ['Membership'],
      card: '4242',
      url: '/pdfs/billing/invoice-simple-template.pdf',
    }
  },
];

export default paymentsSample;
