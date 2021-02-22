import { Select } from 'antd';

const { Option } = Select;

/**
 * @param {*} airtableArray - airtable array
 * @param {String} field - field to output in Select options
 * @return {Array} - options for antd Select component
 */
const getOptions = (airtableArray, field) => {
  let options = [...airtableArray].map(item => {
    return <Option
      key={item.id}
      value={item.fields[field]}
    >
      {item.fields[field]}
    </Option>;
  });
  return options;
};

export {
  // generic utils
  getOptions,
};