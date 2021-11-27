// returns error with Ant Form styles
import styled from 'styled-components'

const Error = ({
  message,
  style,
}) => {
  if (!message) return null
  return <ErrorStyled
    role="alert"
    style={style}
  >
    {message}
  </ErrorStyled>
}

const ErrorStyled = styled.div`
  color: #ff4d4f;
`

export default Error