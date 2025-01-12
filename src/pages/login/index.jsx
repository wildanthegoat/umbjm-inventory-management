import FormLogin from "@/components/form-login";
import Head from "next/head";
const LoginPage = () => {
  return (
    <main>
      <Head>
        <title>Login Page</title>
      </Head>
      <div className="flex items-center justify-center h-screen w-full px-4 bg-blue-500">
        <FormLogin />
      </div>
    </main>
  );
};

export default LoginPage;
