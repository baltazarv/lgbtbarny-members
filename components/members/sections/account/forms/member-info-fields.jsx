/**
 * TODO: refactor to pull non-editing text outside of Form.Item b/c get error:
 *   Warning: [antd: Form.Item] `name` is only used for validate React element. If you are using Form.Item as layout display, please remove `name` instead.
 *  */
import { useState, useEffect, useMemo, useContext } from 'react';
import { Form, Input, Select, Button, Row, Col, Tooltip, DatePicker, Divider, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
// data
import { MembersContext } from '../../../../../contexts/members-context';
import { dbFields } from '../../../../../data/members/airtable/airtable-fields';
import * as memberTypes from '../../../../../data/members/member-types';
import { practiceSettingOptions, certifyOptions, certifyOptionsNoStudent, getCertifyType } from '../../../../../data/members/airtable/airtable-values';
// utils
import { getMemberPlanFee, getPlanFee, getMemberStatus } from '../../../../../utils/members/airtable/members-db';
import { getSalaryOptions } from '../../../../../utils/members/airtable/airtable-select-options';
// styles
import '../account.less';

const { Text } = Typography;

const MemberInfoFields = ({
  memberType,
  longFieldFormat,
  onLink,
  loading,
  editing,
}) => {
  const { member, memberPlans, userPayments } = useContext(MembersContext);
  const [updateFee, setUpdateFee] = useState(null);
  // change of certify status
  const [isAttorney, setIsAttorney] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  // student graduated
  const [studentHasGraduated, setStudentHasGraduated] = useState(false);

  /**
   * Results:
   * * `pending`
   * * `attorney` (active)
   * * `student` (active)
   * * `expired (attorney)`
   * * `graduated (student)`
   */
  const memberStatus = useMemo(() => {
    const status = getMemberStatus({
      userPayments,
      memberPlans,
      member, // for student grad year
    });
    return status;
  }, [userPayments, memberPlans, member]);

  /**
   * CERTIFY STATUS - ALL MEMBERS
   */

  useEffect(() => {
    setCertifyStatus(member.fields[dbFields.members.certify]);
  }, [member.fields[dbFields.members.certify]]);

  const onMemberTypeSelect = (value) => {
    setCertifyStatus(value);
  };

  const setCertifyStatus = (certifyStatus) => {
    const certifyType = getCertifyType(certifyStatus);
    if (!certifyStatus || certifyType === memberTypes.USER_NON_MEMBER) {
      setIsAttorney(false);
      setIsStudent(false);
    } else if (certifyType === memberTypes.USER_STUDENT) {
      setIsAttorney(false);
      setIsStudent(true);
    } else {
      setIsAttorney(true);
      setIsStudent(false);
    }
  };

  /**
   * STUDENT - PAST GRADUATION YEAR
   */

  // when cancel & gradyear not saved
  useEffect(() => {
    if (!editing && member.fields[dbFields.members.gradYear]) {
      // console.log('GRAD YR', member.fields[dbFields.members.gradYear], 'vs', new Date().getFullYear());
      if (member.fields[dbFields.members.gradYear] < new Date().getFullYear()) {
        setStudentHasGraduated(true);
      } else {
        setStudentHasGraduated(false);
      }
    }
  }, [member.fields[dbFields.members.gradYear]]); // editing

  const onGradYearUpdate = (date) => {
    const thisYear = new Date().getFullYear();
    setStudentHasGraduated(date.year() < thisYear);
  };

  const certifyStatus = useMemo(() => {
    return <>
      <Form.Item
        name={dbFields.members.certify}
        label="Certify Status"
        rules={[
          {
            required: true,
            message: 'Please certify your status.',
          },
        ]}
        hasFeedback
      >
        {editing
          ?
          <Select
            style={{ width: '100%' }}
            placeholder="Choose one..."
            autoFocus
            suffixIcon={<UserOutlined />}
            disabled={loading}
            onChange={onMemberTypeSelect}
          >
            {(isAttorney || memberStatus === 'graduated') ?
              certifyOptionsNoStudent() :
              certifyOptions()
            }
          </Select>
          :
          <>{member.fields && member.fields[dbFields.members.certify]}</>
        }
      </Form.Item>
    </>;
  });

  /**
   * ATTORNEY CONTENT
   */

  const onSalaryChange = (value) => {
    if (value !== member.fields[dbFields.members.salary]) {
      setUpdateFee(`${getPlanFee(value, memberPlans)}`);
    } else {
      setUpdateFee(null);
    }
  };

  const salaryOptions = useMemo(() => {
    if (memberPlans) return getSalaryOptions(memberPlans);
    return null;
  }, [memberPlans]);

  const fee = useMemo(() => {
    if (member && memberPlans) {
      return getMemberPlanFee(member, memberPlans);
    }
    return null;
  }, [member, memberPlans]);

  const attorneyContent = useMemo(() => {
    let content = null;
    // payment type or user certified is attorney
    if (memberType === memberTypes.USER_ATTORNEY || isAttorney) {
      content = <>

        {/* salary */}
        <Form.Item
          name={dbFields.members.salary}
          label={<Tooltip title="Membership dues are based on the amount of member salaries">
            <span style={{ borderBottom: '1px dotted' }}>Salary</span>
          </Tooltip>}
          rules={[
            {
              required: true,
              message: 'Enter your salary to calculate fee.',
            },
          ]}
          hasFeedback
          className="mt-2"
        >
          {editing
            ?
            <Select
              placeholder="Choose salary to calculate fee..."
              disabled={loading}
              onChange={onSalaryChange}
            >
              {salaryOptions}
            </Select>
            :
            <>{member && member.fields[dbFields.members.salary]} {fee && <Text code><span className="text-nowrap">${fee} members fee</span></Text>}</>
          }
        </Form.Item>

        {/* TODO: only show when there is an active subscription */}
        {updateFee &&
          <div className="text-danger">Membership fees are based on members' salaries. Your next membership fee will change to <strong>${updateFee}</strong> per year.</div>
        }

        {/* employer */}
        <Divider>Employment</Divider>

        <Form.Item
          name={dbFields.members.employer}
          label="Employer"
        >
          {editing
            ?
            <Input
              placeholder="Employer - if relevant"
              disabled={loading}
            />
            :
            member.fields[dbFields.members.employer]
          }
        </Form.Item>

        {/* practice settings */}
        <Form.Item
          name={dbFields.members.practiceSetting}
          label="In what setting do you practice/work?"
          colon={false}
          className="mt-2"
          labelAlign="center"
          {...longFieldFormat}
        >
          {editing
            ?
            <Select
              placeholder="Choose one..."
              disabled={loading}
            >
              {practiceSettingOptions()}
            </Select>
            :
            member.fields[dbFields.members.practiceSetting]
          }
        </Form.Item>

        {/* primary area of practice */}
        <Form.Item
          name={dbFields.members.practiceAreas}
          label="Primary practice area(s)"
          className="mt-2"
          labelAlign="center"
          labelCol={{
            xs: { span: 24 },
          }}
          wrapperCol={{
            xs: { span: 24 },
            md: { span: 23 },
            lg: { span: 22 },
          }}
        >
          {editing
            ?
            <Input
              placeholder="Adoption, Criminal, Family Law, Immigration, Marriage/Civil Union, Disability..."
              disabled={loading}
            />
            :
            member.fields[dbFields.members.practiceAreas]
          }
        </Form.Item>

      </>;
    }
    return content;
  }, [isAttorney, member.fields, editing, updateFee]);

  /**
   * STUDENT CONTENT
   */

  const studentContent = useMemo(() => {
    let content = null;
    if (memberType !== memberTypes.USER_NON_MEMBER) {
      content = <>

        {/* title not necessary for students */}
        {(memberType !== memberTypes.USER_STUDENT || isAttorney) && <Divider>Education</Divider>}

        {/* law school */}
        <Form.Item
          name={dbFields.members.lawSchool}
          label="Law School"
          rules={[
            {
              required: (memberType === memberTypes.USER_STUDENT || isStudent) ? true : false,
              message: 'Enter the name of your law school.',
              whitespace: true,
            },
          ]}
        >
          {editing
            ?
            <Input
              placeholder="Law School"
              disabled={loading}
            />
            :
            member.fields && member.fields[dbFields.members.lawSchool]
          }
        </Form.Item>

        {/* graduation year */}
        <Form.Item
          name={dbFields.members.gradYear}
          label="Graduation Year"
          // help="Please enter a year."
          rules={[
            {
              type: 'object',
              required: (memberType === memberTypes.USER_STUDENT || isStudent) ? true : false,
              message: 'Enter your graduation year.',
            },
          ]}
          hasFeedback
        >
          {
            editing
              ?
              <DatePicker
                picker="year"
                bordered={true}
                allowClear={false}
                disabled={loading}
                onChange={onGradYearUpdate}
              />
              :
              member.fields && member.fields[dbFields.members.gradYear]
          }
        </Form.Item>

        {/* upgrade student to attorney */}
        {(
          (memberType === memberTypes.USER_NON_MEMBER && isAttorney) || (memberType === memberTypes.USER_STUDENT && studentHasGraduated))
          && <Row justify="center">
            <Col xs={{ span: 20, offset: 2 }} sm={{ span: 18, offset: 3 }} className="text-center">
              <div className="my-2 text-danger">Since you are no longer a student, please upgrade your membership to an Attorney Membership:</div>
              <Button type="primary" onClick={() => onLink('signup')}>Upgrade membership</Button>
            </Col>
          </Row>
        }
      </>;
    }
    return content;
  }, [memberType, member.fields, editing, isAttorney, isStudent, studentHasGraduated]);

  /**
   * NON-MEMBER CONTENT
   */

  const nonMemberContent = useMemo(() => {
    let content = null;
    if (memberType === memberTypes.USER_NON_MEMBER) {
      if (isAttorney || isStudent) content = <>
        <Button type="primary" onClick={() => onLink('signup')}>Become a member</Button>
      </>;
    }
    return content;
  }, [memberType, member.fields, editing, isStudent, isAttorney]);

  return <>
    {certifyStatus}
    {attorneyContent}
    {studentContent}
    <Row className="mt-2">
      <Col sm={{ offset: 6 }}>{nonMemberContent}</Col>
    </Row>
  </>;
};

export default MemberInfoFields;