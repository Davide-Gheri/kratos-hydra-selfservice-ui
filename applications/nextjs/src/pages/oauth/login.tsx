import { GetServerSideProps } from 'next';
import { Hydra } from '../../hydra';
import { asNextProps } from '../../helpers';

export default function OAuthLogin() {
  return (
    <div>Wait a moment...</div>
  )
}

export const getServerSideProps: GetServerSideProps = async context =>
  asNextProps(await Hydra.login(context) as any);
