import styles from "@/utils/styles";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long!"),
});
type LoginSchema = z.infer<typeof formSchema>;
function Login({
  setActivateState,
}: {
  setActivateState: (e: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
  });
  function onSubmit(data: LoginSchema) {
    console.log(data);
    reset();
  }
  return (
    <div className="flex flex-col justify-center">
      <h1 className={`${styles.title}`}>Login</h1>
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center grow"
      >
        <div>
          <label className={`${styles.label}`}>Enter your email</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            className={`${styles.input}`}
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 block mt-1">{`${errors.email.message}`}</span>
          )}
        </div>
        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="password" className={`${styles.label}`}>
            Enter your password
          </label>
          <input
            type={!showPassword ? "password" : "text"}
            placeholder="password"
            className={`${styles.input}`}
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500 block mt-1">{`${errors.password.message}`}</span>
          )}
          {!showPassword ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShowPassword(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>
        <div className="w-full mt-5">
          <span
            className={`${styles.label} text-blue-400 block text-right cursor-pointer hover:underline`}
          >
            Forgot your password?{" "}
          </span>
          <input
            type="submit"
            value="login"
            disabled={isSubmitting}
            className={`${styles.button} mt-2`}
          />
        </div>
        <h5 className="text-center pt-4 text-[14px] text-white">
          Or Sign in with
        </h5>
        <div className="flex items-center justify-center my-2">
          <AiFillGithub
            size={30}
            className="cursor-pointer mr-2"
          ></AiFillGithub>
          <FcGoogle size={30} className="cursor-pointer ml-2"></FcGoogle>
        </div>
        <h5 className="text-center pt-4 text-[14px] text-white">
          Don&apos;t have any account ?
          <span className="text-blue-400 pl-1 cursor-pointer hover:underline" onClick={()=> setActivateState("signup")}>
            Sign Up
          </span>
        </h5>
      </form>
    </div>
  );
}

export default Login;
