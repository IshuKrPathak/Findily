"use client";

import React from "react";
import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useRegisterModel from "@/app/hooks/useRegisterModel";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../Inputs/Input";
import { toast } from "react-hot-toast/headless";
import Button from "../Button";
import useLoginModel from "@/app/hooks/useLoginModel";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginModel = () => {
  const router = useRouter();

  const RegisterModel = useRegisterModel();
  const LoginModel = useLoginModel();

  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);
      if (callback?.ok) {
        toast.success("Logged in ");
        router.refresh();
        LoginModel.onClose();
      }
      if (callback?.error) {
        toast.error(callback?.error);
      }
    });
  };
  const toggle = useCallback(() => {
    LoginModel.onClose();
    RegisterModel.onOpen();
  }, [LoginModel, RegisterModel]);

  const bodyContent = (
    <div className=" flex flex-col gap-4">
      <Heading
        title="Welcome back to Findily"
        subtitle="Login to your account "
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <Input
        id="password"
        type="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      />

      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => signIn("github")}
      />
      <div className=" text-neutral-500 text-center mt-4 font-light ">
        <div className=" justify-center flex flex-row items-center gap-2">
          <div>First time using Findily ? </div>
          <div
            className=" text-gray-800 cursor-pointer hover:underline"
            onClick={toggle}
          >
             Create an account
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={LoginModel.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={LoginModel.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModel;
