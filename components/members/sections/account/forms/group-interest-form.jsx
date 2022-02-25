import { useContext, useMemo, useEffect } from 'react'
import { Form, Select } from 'antd'
import { MembersContext } from '../../../../../contexts/members-context'
import { dbFields } from '../../../../../data/members/airtable/airtable-fields'
import './group-interest-form.less'

const { Option } = Select;

const GroupInterestForm = ({
  form,
  memberType,
  longFieldFormat,
  memberTypeGroups,
  loading,
  editing,
}) => {
  const { groups } = useContext(MembersContext)

  // memberTypeGroups is passed as initialValues, but since memberTypeGroups takes time to calculate, it will not show up on first render if value not set here.
  // if changes are cancelled and form is reset, initialValues is used.
  useEffect(() => {
    if (memberTypeGroups) {
      form.setFieldsValue({ [dbFields.members.interestGroups]: memberTypeGroups })
    }
  }, [memberTypeGroups])

  const groupList = useMemo(() => {
    if (memberTypeGroups && groups) {
      // if "student" show student-only
      // ... or if "attorney" show attorney-only
      return <ul>
        {memberTypeGroups.map((id) => {
          return <li key={id}>{groups.find((rec) => rec.id === id).fields[dbFields.groups.name]}</li>
        })}
      </ul>
    }
    return <em className="text-muted">No group interests chosen.</em>
  }, [memberTypeGroups, groups])

  const groupOptions = useMemo(() => {
    if (groups) {
      // if "student" show options for students only
      // ... or if "attorney" for attorneys only
      const groupOfType = groups.filter((rec) => rec.fields?.[dbFields.groups.type].find((type) => type === memberType))
      return groupOfType.map((group) => {
        return <Option
          key={group.id}
          value={group.id}
        >
          {group.fields[dbFields.groups.name]}
        </Option>
      })
    }
  }, [groups, memberType])

  return <>
    <Form.Item
      name={dbFields.members.interestGroups}
      label="Committees, Sections, and other groups you may be interested in joining:"
      {...longFieldFormat}
      colon={false}
      className="group-interest-form"
    >
      {editing
        ?
        <Select
          placeholder="Choose any..."
          disabled={loading}
          mode='multiple'
        >
          {groupOptions}
        </Select>
        :
        groupList
      }
    </Form.Item>
    <div className='mt-3'>See the <em>Participate</em> page for more information on these groups.</div>
  </>
}

export default GroupInterestForm