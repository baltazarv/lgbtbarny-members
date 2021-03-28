import Spinner from '../../../elements/spinner';
// utils
import { useCles } from '../../../../utils/cles/cles-utils';

const Cles = ({
  type,
  memberType,
  memberStatus,
  previewUser,
  onLink,
  render,
}) => {

  const { cles, isLoading, isError } = useCles();

  isLoading && <Spinner loading={isLoading} />;

  return <>
    {render({
      cles,
      type,
      memberType,
      memberStatus,
      previewUser,
      onLink,
      render,
    })}
  </>;
};

export default Cles;