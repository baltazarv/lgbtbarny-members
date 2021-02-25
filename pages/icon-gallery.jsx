import SvgIcon from '../components/elements/svg-icon';

const createIcon = (name) => {
  const size = '2em';
  return <div
    style={{
      width: '4em',
      textAlign: 'center',
      display: 'inline-block',
      margin: '1em',
    }}
s  >
    <div>
      <span role="img" aria-label={name} className="anticon">
        <SvgIcon
          name={name}
          width={size}
          height={size}
          fill="black"
        />
      </span>
    </div>
    <div style={{}}>{name}</div>
  </div>;
};

const IconGallery = () => {
  return <>
    <h1 style={{ textAlign: 'center' }}>Icon Gallery</h1>
    {createIcon('bell')}
    {createIcon('customer-profile')}
    {createIcon('annotate')}
    {createIcon('download')}
    {createIcon('demographic')}
    {createIcon('bookmark')}
    {createIcon('government')}
    {createIcon('star')}
    {createIcon('briefcase')}
    {createIcon('email-gear')}
    {createIcon('logout')}
    {createIcon('lock')}
    {createIcon('email')}
    {createIcon('link-out')}
    {createIcon('modal-window')}
    {createIcon('ribbon')}
    {createIcon('border')}
    {createIcon('user-admin')}
    {createIcon('delegate')}
    {createIcon('gift')}
    {createIcon('people-group')}
  </>;
};

export default IconGallery;