import SvgIcon from './svg-icon';

export const TitleIcon = ({
  name,
  ariaLabel,
  fill='currentColor'
}) =>
  <span role="img" aria-label={ariaLabel}>
    <SvgIcon
      name={name}
      width="1em"
      height="1em"
      fill={fill}
    />
  </span>