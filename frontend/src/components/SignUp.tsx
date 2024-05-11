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
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "@/graphql/actions/register.action";
import { toast } from "react-hot-toast";
const formSchema = z.object({
  name: z.string().min(3, "Password must be at least 3 characters long!"),
  phone_number: z
    .number()
    .min(9, "Phone number must be at least 9 characters long!"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long!"),
});
type SignUpSchema = z.infer<typeof formSchema>;

function SignUp({
  setActivateState,
}: {
  setActivateState: (e: string) => void;
}) {
    const [registerUserMutation, {loading,error,data}] = useMutation(REGISTER_USER)
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpSchema>({
    resolver: zodResolver(formSchema),
  });
 async function onSubmit(data: SignUpSchema) {
    try {
        const res = await registerUserMutation({
            variables: data,
        })
        console.log(res)
        toast.success(res.data.message)
    } catch (error: any) {
        toast.error(error.message)
    }
    reset();
  }
  return (
    <div>
      <div className="flex flex-col justify-center">
        <h1 className={`${styles.title}`}>Sign Up</h1>
        <form
          action=""
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center grow"
        >
          <div className="w-full mt-3 relative mb-1">
            <label className={`${styles.label}`}>Enter your name</label>
            <input
              type="text"
              placeholder="Alex"
              className={`${styles.input}`}
              {...register("name")}
            />
            {errors.name && (
              <span className="text-red-500 block mt-1">{`${errors.name.message}`}</span>
            )}
          </div>
          <div className="w-full mt-3 relative mb-1">
            <label className={`${styles.label}`}>Enter your phone number</label>
            <input
              type="number"
              placeholder="012345678"
              className={`${styles.input}`}
              {...register("phone_number", {valueAsNumber: true})}
            />
            {errors.phone_number && (
              <span className="text-red-500 block mt-1">{`${errors.phone_number.message}`}</span>
            )}
          </div>
          <div className="w-full mt-3 relative mb-1">
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
          <div className="w-full mt-3 relative mb-1">
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
          <div className="w-full mt-3">
           
            <input
              type="submit"
              value="signup"
              disabled={isSubmitting || loading}
              className={`${styles.button} mt-2`}
            />
          </div>
          <h5 className="text-center pt-4 text-[14px] text-white">
            Or join with
          </h5>
          <div className="flex items-center justify-center my-2">
            <AiFillGithub
              size={30}
              className="cursor-pointer mr-2"
            ></AiFillGithub>
            <FcGoogle size={30} className="cursor-pointer ml-2"></FcGoogle>
          </div>
          <h5 className="text-center pt-4 text-[14px] text-white">
            Already have an account ?
            <span
              className="text-blue-400 pl-1 cursor-pointer hover:underline"
              onClick={() => setActivateState("login")}
            >
              Login
            </span>
          </h5>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
