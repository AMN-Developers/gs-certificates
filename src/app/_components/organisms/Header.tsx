import Image from 'next/image';
import logo from '@assets/logo.png';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="via-[#18183b]/93 h-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand to-[#181a3d] p-4">
      <div className="mx-auto flex max-w-screen-xl">
        <Link href="/">
          <Image
            src={logo}
            alt="G&S Home Solutions Image Logo"
            className="max-w-[6.25rem]"
            draggable={false}
            priority
          />
        </Link>
      </div>
    </header>
  );
}
