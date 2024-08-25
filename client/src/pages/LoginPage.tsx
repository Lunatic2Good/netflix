import { createContext, useState } from "react";
import Input from "../components/Input";
import NavBar from "../components/Navbar";
import {
  useForm,
  SubmitHandler,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";

export type Inputs = {
  username: string;
  email: string;
  password: string;
};

enum Variant {
  SIGN_UP,
  LOGIN_IN,
}

interface AuthFormContextType {
  register: UseFormRegister<Inputs> | null;
  errors: FieldErrors<Inputs>;
}

export const AuthFormContext = createContext<AuthFormContextType>({
  register: null,
  errors: {},
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Inputs>();
  const [variant, setVariant] = useState(Variant.SIGN_UP);
  console.log(errors);
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <div className="relative bg-black h-screen w-screen bg-opacity-50">
      <NavBar />
      <div className="flex justify-center items-center h-full">
        <div className="bg-black bg-opacity-70 p-16 self-center mt-2 w-full max-w-md rounded-md">
          {variant === Variant.SIGN_UP ? (
            <h2 className="text-white text-4xl mb-8 font-semibold">Sign in</h2>
          ) : (
            <h2 className="text-white text-4xl mb-8 font-semibold">Log in</h2>
          )}
          <AuthFormContext.Provider value={{ register, errors }}>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              {variant === Variant.SIGN_UP && (
                <Input
                  id="username"
                  type="username"
                  label="Username"
                  name="username"
                />
              )}
              <Input
                id="email"
                type="email"
                label="Email address"
                name="email"
              />
              <Input
                id="password"
                type="password"
                label="Password"
                name="password"
                validate={
                  variant === Variant.SIGN_UP
                    ? () => {
                        const password = getValues("password");
                        if (password.length < 8) {
                          return "Password must be at least 8 characters long";
                        }
                        if (!/[a-z]/.test(password)) {
                          return "Password must contain at least one lowercase letter";
                        }
                        if (!/[A-Z]/.test(password)) {
                          return "Password must contain at least one uppercase letter";
                        }
                        if (!/\d/.test(password)) {
                          return "Password must contain at least one number";
                        }
                        if (!/[@$!%*?&#]/.test(password)) {
                          return "Password must contain at least one special character";
                        }
                        return true;
                      }
                    : undefined
                }
              />
              <input
                type="submit"
                className="bg-red-400 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700"
              />
            </form>
          </AuthFormContext.Provider>
          {variant === Variant.LOGIN_IN ? (
            <p
              className="text-neutral-500 mt-12"
              onClick={() => setVariant(Variant.SIGN_UP)}
            >
              <span className="text-white ml-1 hover:underline cursor-pointer">
                First time using Netflix?
              </span>
            </p>
          ) : (
            <p
              className="text-neutral-500 mt-12"
              onClick={() => setVariant(Variant.LOGIN_IN)}
            >
              <span className="text-white ml-1 hover:underline cursor-pointer">
                Already have an account?
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
