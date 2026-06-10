import Link from "next/link";
import RootLayout from "./layout";
import { LoginForm } from "../myComponents/LoginForm";


export default function Home() {

  const newDate = new Date()
  return (
    <RootLayout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 col-sm-6 bg-dark min-h-screen flex flex-col items-center justify-center">
            <img
              className="img-fluid"
              width={500}
              src="/cimseller_animated_logo.gif" />
            <p className="text-lg mb-6 text-white text-center max-w-2xl">
              © Powered by  <code>Kadjiv'Sarl</code> | @ <em>{newDate.getFullYear()}</em> .
            </p>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black text-zinc-900 dark:text-white px-4">
              <h1 className="text-4xl font-semibold mb-4 text-center">Bienvenue sur <em> <strong> Cim<code>seller</code></strong></em> </h1>
              <p className="text-lg mb-6 text-center max-w-2xl">
                Le logiciel de gestion de Ciment
              </p>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
