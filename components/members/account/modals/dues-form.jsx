import { useEffect, useReducer } from 'react';
import { Typography, Form, Row, Col } from 'antd';
import DuesWrapper from '../../salary-donation-dues-fields/dues-wrapper';
import DuesSummList from '../../salary-donation-dues-fields/dues-summ-list';
// utils
import { duesInit, duesReducer, getMemberFee, setDonation } from '../../../utils/dues';
// data
import { FORMS, SIGNUP_FIELDS } from '../../../../data/member-form-names';
import * as memberTypes from '../../../../data/member-types';
import { LAW_NOTES_PRICE } from '../../../../data/law-notes-values';

const { Link } = Typography;

const DuesForm = ({
  user,
  memberType,
}) => {
  const [form] = Form.useForm();
  const [dues, setDues] = useReducer(duesReducer, duesInit);
  const updateDues = (value) => {
    setDues({
      type: 'update',
      value,
    });
  };

  const setLawNotes = () => {
    if (
      memberType === memberTypes.USER_LAW_NOTES ||
      (memberType === memberTypes.USER_NON_MEMBER && form.getFieldValue(SIGNUP_FIELDS.lawNotes))
    ) {
        console.log('setLawNotes:', LAW_NOTES_PRICE);
        updateDues({ lawNotesAmt: LAW_NOTES_PRICE });
      } else {
        console.log('setLawNotes:', 0);
        updateDues({ lawNotesAmt: 0 });
    }
  };

  useEffect(() => {
    setLawNotes(); // for law notes subscriber
  }, [memberType]);

  const duesSummList = (memberType) => {
    let showSalary = memberType === memberTypes.USER_ATTORNEY;
    let showLawNotes = memberType === memberTypes.USER_LAW_NOTES || memberType === memberTypes.USER_NON_MEMBER;
    let showTotal = memberType === memberTypes.USER_ATTORNEY;
    return <DuesSummList
      fee={dues.memberFee}
      discount={dues.discount}
      lawNotesAmt={dues.lawNotesAmt}
      donation={dues.donation}

      showSalary={showSalary}
      showDiscount={false}
      showDonation={true}
      showLawNotes={showLawNotes}
      showTotal={showTotal}

      formItemLayout={{
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 8 },
      }}
    />;
  };

  const onFieldsChange = (changedFields, allFields) => {
    // console.log('onFieldsChange changed', changedFields, 'all', allFields);
    changedFields.forEach((field) => {
      const fieldName = field.name[0];
      const value = field.value;
      if (fieldName === SIGNUP_FIELDS.salary) {
        const hasDiscount = false;
        updateDues(getMemberFee(form, hasDiscount));
      } else if (
        fieldName === SIGNUP_FIELDS.donation ||
        fieldName === SIGNUP_FIELDS.customDonation
      ) {
        updateDues(setDonation(form));
      } else if (fieldName === SIGNUP_FIELDS.lawNotes) {
        setLawNotes();
      }
    });
  };

  const onValuesChange = (changedFields, allFields) => {
    // console.log('onValuesChange changed', changedFields, 'all', allFields);
  };

  return <>
    <Form
      labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
      wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
      name={FORMS.editSalaryDontaion}
      form={form}
      initialValues={{
        [SIGNUP_FIELDS.donationrecurrence]: SIGNUP_FIELDS.donationrecurs,
      }}
      scrollToFirstError
      onFieldsChange={onFieldsChange}
      onValuesChange={onValuesChange}
    >
      <DuesWrapper
        memberType={memberType}
      />
      {duesSummList(memberType)}
      <Row>
        <Col sm={{ offset: 8 }}>
          {user && user.memberstart
            && <div className="mt-2" style={{fontSize: '.9em'}}>Your payment method will be charged with the updated {memberTypes.USER_ATTORNEY && "fee/"}donation on&nbsp;{user.memberstart}.</div>}
        </Col>
      </Row>
    </Form>
  </>;
};

export default DuesForm;