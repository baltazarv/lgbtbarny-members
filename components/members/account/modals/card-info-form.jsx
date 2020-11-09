import PaymentFields from '../../payment-fields';

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