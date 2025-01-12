import React from 'react';
import { useRouter } from 'next/router';
import MainNav from './side-nav';

const disableNavbar = ["/login","/","/unauthorized"];

const AppShell = ({ children }) => {
  const { pathname } = useRouter();
  return (
    <main>
      {!disableNavbar.includes(pathname) && <MainNav>{children}</MainNav>}
      {disableNavbar.includes(pathname) && children}
    </main>
  );
};

export default AppShell;
