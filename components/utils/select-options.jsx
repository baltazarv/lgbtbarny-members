// antd select option generation functions
import { Select } from 'antd';

const { Option } = Select;

export const selectOptionsFromArray = (array) => {
  console.log('selectOptionsFromArray', array);
  let options = array.map(val => <Option
    key={val}
    value={val}
  >
    {val}
  </Option>);
  return options;
};

// uses label both for value and option
export const selectOptionsFromObject = (valObj) => {
  let options = [];
  for (const key in valObj) {
    options.push(<Option
        key={key}
        value={valObj[key].label}
      >
        {valObj[key].label}
      </Option>);
  }
  return options;
};