import PaymentFields from '../../../../payments/payment-fields';

const CardInfoForm = ({
  loading,
}) => {
  return <>
    <PaymentFields
      loading={loading}
    />
  </>;
};

export default CardInfoForm;