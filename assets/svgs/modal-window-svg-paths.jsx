export default ({ fill }) => {
  const cls1Style = {
    fill, // '#ff13dc'
    fillOpacity: 0,
  };
  const cls2Style = {
    fill, // '#6e6e6e'
  };
  const cls3Style = {
    fill: 'none',
    stroke: fill, // '#6e6e6e'
    strokeMiterlimit: 10,
    strokeWidth: '1.5px',
  };
  return <>
    <rect style={cls1Style} width="18" height="18"/>
    <path style={cls2Style} d="M14.05,10.22h-.84a.42.42,0,0,0-.42.42V15.3H2.68V5.13H7.32a.42.42,0,0,0,.42-.42V3.86a.42.42,0,0,0-.42-.42H1.42A.42.42,0,0,0,1,3.86V16.58a.42.42,0,0,0,.42.42H14.05a.42.42,0,0,0,.43-.42V10.64A.42.42,0,0,0,14.05,10.22Z"/>
    <rect style={cls3Style} x="9.33" y="1.84" width="6.79" height="6.79" rx="0.01"/>
  </>
}
