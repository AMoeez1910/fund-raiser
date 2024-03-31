import { useState,useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import login from "../assets/signup.png";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const LoginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;
    try {
      const { data } = await axios.post("/login", {
        email,
        password,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        localStorage.setItem('userData', JSON.stringify(data))
        setData({});
        toast.success("Welcome Back");
        navigate("/");
      }
    } catch (error) {}
    //
  };
  return (
    <>
      <Navbar links={[{ button: true, path: "/register", btn_name: "Sign Up" }]} />
      <section className="py-4 py-md-5 my-5">
        <div className="container py-md-5">
          <div className="row">
            <div className="col-md-6 text-center">
              <img className="img-fluid w-100" src={login} />
            </div>
            <div className="col-md-5 col-xl-4 text-center text-md-start">
              <h2 className="display-6 fw-bold mb-5">
                <span className="underline pb-1">
                  <strong>Login</strong>
                  <br />
                </span>
              </h2>
              <form method="post" data-bs-theme="light" onSubmit={LoginUser}>
                <div className="mb-3">
                  <input
                    className="shadow form-control"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={data.email}
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="shadow form-control"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={data.password}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                  />
                </div>
                <div className="mb-5">
                  <button className="btn btn-primary shadow" type="submit">
                    Log in
                  </button>
                </div>
              </form>
              <p className="text-muted">
                <a href="/ResetPassword">Forgot your password?</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

