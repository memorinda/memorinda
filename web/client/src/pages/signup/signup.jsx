import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import "./signup.css";
import { useNavigate } from "react-router";

const signUpSchema = z
  .object({
    username: z.string().nonempty(),
    firstname: z.string().nonempty(),
    lastname: z.string().nonempty(),
    birthdate: z.string().nonempty(),
    phone: z.string().nonempty(),
    email: z.string().email("Please enter a valid email"),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 character" })
      .regex(
        // eslint-disable-next-line max-len
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*';."_)(+,/:>\]<=?@\\^`|[}{~-])/,
        {
          message:
            // eslint-disable-next-line max-len
            "Password must contain uppercase, lowercase, numeric and special character",
        },
      ),
    passwordConfirm: z.string(),

    privacyAgreement: z
      .boolean()
      .refine((val) => val, {
        message: "You have to accept privacy policy",
      }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords are not the same",
    path: ["passwordConfirm"],
  });

function Signup() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "all",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const onSubmit = useCallback((data) => {
    const newUser = {
      firstname: data.firstname,
      lastname: data.lastname,
      birthdate: data.birthdate,
      username: data.username,
      phone: data.phone,
      email: data.email,
      password: data.password,
    };
    console.log(newUser);
    axios
      .post(`${process.env.REACT_APP_URL}/users/signup/add`, newUser)
      .then((res) => {
        console.log(res);
        if (res.data.message) {
          setErrorMessage(res.data.message);
        } else if (res.status === 200) {
          setErrorMessage(`You created your account successfully,
            please login to use`);
          reset();
          navigate("/login")
        } else {
          setErrorMessage("Error! Please try again.");
        }
      })
      .catch((err) => {
        console.log("Error:", err);
        setErrorMessage("Error! Please try again.");
      });
  }, [reset, navigate]);

  return (
    <div className="imge">
      <div className="fullscreen row justify-content-center align-items-center">
        <div className="col-4 justify-content-start">
          <div className="card p-1 mb-0">
            <div className="card-body">
              <div className="text-center">
                <h2 className="mt-2">
                  <b>SIGN UP</b>
                </h2>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <p className="errorMessage">{errorMessage}</p>
                  <div className="mt-3 d-flex flex-column">
                    <input
                        {...register("firstname")}
                        className="btn-border input-style form-control"
                        placeholder="First Name"
                        type="text"
                      >
                      </input>
                    

                  </div>

                  <div className="mt-3 d-flex flex-column">
                    <input
                      {...register("lastname")}
                      className="btn-border input-style form-control"
                      placeholder="Last Name"
                      type="text"
                    >
                    </input>
                   
                  </div>

                  <div className="mt-3 d-flex flex-column">
                    <input
                      {...register("phone")}
                      className="btn-border input-style form-control"
                      placeholder="Phone number"
                      type="text"
                    >
                    </input>
                   
                  </div>

                  <div className="mt-3 d-flex flex-column">
                    <input
                      {...register("birthdate")}
                      className="btn-border input-style form-control"
                      placeholder="Birth Date"
                      type="string"
                    >
                    </input>
                   
                  </div>

                <div className="mt-3 d-flex flex-column">
                  <input
                    {...register("username")}
                    className="btn-border input-style form-control"
                    placeholder="Username"
                    type="text"
                  >
                  </input>
                  <small className="align-self-start error-text">
                    {errors.username?.message}
                  </small>

                </div>
               
                <div className="mt-3 d-flex flex-column">
                  <input
                    {...register("email")}
                    className="btn-border input-style form-control"
                    placeholder="E-mail"
                    type="email"
                  >
                  </input>
                  <small className="align-self-start error-text">
                    {errors.email?.message}
                  </small>

                </div>
                <div className="mt-3 d-flex flex-column">
                  <input
                    {...register("password")}
                    className="btn-border input-style form-control"
                    placeholder="Password"
                    type="password"

                  >
                  </input>
                  <small className="align-self-start error-text">
                    {errors.password?.message}
                  </small>
                </div>

                <div className="mt-3 d-flex flex-column">
                  <input
                    {...register("passwordConfirm")}
                    className="btn-border form-control input-style"
                    placeholder="Confirm Password"
                    type="password"

                  >
                  </input>
                  <small className="align-self-start error-text">
                    {errors.passwordConfirm?.message}
                  </small>
                </div>

                <div className="mt-3 d-flex flex-row">
                  <input
                    {...register("privacyAgreement")}
                    className="form-check-input"
                    id="checkbox"
                    type="checkbox"
                  >
                  </input>
                  <small>
                    I have read and accepted <a href="s">Document1</a>
                  </small>

                </div>
                <small className="align-self-start error-text">
                  {errors.privacyAgreement?.message}
                </small>


                <div className="mt-5 row text-center justify-content-center">
                  <div className="col-12">
                    <button
                      className="btn btn-block col-6 btn-warning"
                      type='submit'
                    >
                      SIGN UP
                    </button>
                  </div>
                </div>

                <div className="mt-2 row text-center justify-content-center">
                  <div className="col-12">
                    <Link to="/login"> <p> Already have an account? </p> </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
