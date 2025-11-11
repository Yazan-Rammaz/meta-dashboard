import Image from 'next/image';

function LogoInner() {
  return (
    <Image
      src="/static/images/logo/logo.svg"
      alt="logo"
      width={50}
      height={50}
    />
  );
}

export default LogoInner;
