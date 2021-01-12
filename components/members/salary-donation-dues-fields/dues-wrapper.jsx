// DuesForm < DuesWrapper < SalaryFields
import { useState, useMemo, useEffect, useReducer } from 'react';
import { Select, Row, Col } from 'antd';
import SalaryFields from './salary-fields';
import DonationFields from './donation-fields';
import LawNotesField from './law-notes-field';
// data
import * as memberTypes from '../../../data/members/values/member-types';
import { salaryOptions } from '../../../data/members/values/member-values';
import { getDonationValues } from '../../../data/members/values/donation-values';

const { Option } = Select;

const DuesWrapper = ({
  memberType,
  hasDiscount = false,
}) => {

  const onFieldChange = (field, value) => {
    // console.log('onFieldChange field', field, 'val', value);
  };

  // build options for donation select component
  const suggestDonationAmts = useMemo(() => {
    if (memberType) {
      return getDonationValues(memberType);
    }
    return null;
  }, [memberType]);

  const lawNotesField = useMemo(() => {
    let field = null;
    if (memberType === memberTypes.USER_NON_MEMBER) field = <LawNotesField
      onChange={onFieldChange}
    />;
    return field;
  });

  return <>
    <SalaryFields
      hasDiscount={hasDiscount}
      salaryOptions={memberType === memberTypes.USER_ATTORNEY ? salaryOptions() : null}
      onChange={onFieldChange}
      />
    {lawNotesField}
    <DonationFields
      suggestedAmounts={suggestDonationAmts}
      onChange={onFieldChange}
    />
  </>;
};

export default DuesWrapper;