// EmailVerify.jsx
import { useEffect, useState ,Fragment} from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const EmailVerify = () => {
  const navigate = useNavigate();
  const {id,expirationTimestamp} = useParams();
  const [validUrl, VerifyUrl] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const url=`https://fund-raiser-production.up.railway.app/verify/${id}/${expirationTimestamp}`
        const {data} = await axios.get(url)
        console.log(data)
        VerifyUrl(true)
      } catch (error) {
        console.log(error)
        VerifyUrl(false)
      }
    };

    verifyEmail();
  }, [id,expirationTimestamp]);

  return (
    <Fragment>
      {validUrl ? (
        <section className="py-5 mt-5">
        <div className="container py-5">
          <div className="row">
            <div className="col-md-8 col-xl-6 text-center mx-auto">
              <h2 className="display-6 fw-bold mb-4">Email Verified</h2>
            </div>
          </div>
          <div className="row d-flex justify-content-center">
            <div className="col-md-6">
              <div>
                <form className="p-3 p-xl-4" method="post" data-bs-theme="light">
                  <div>
                    <Link to="/login">
                      <button
                        className="btn btn-primary shadow d-block w-100"
                        type="submit"
                      >
                        Login
                      </button>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      ) : (
        navigate("/vgsdfvgdfbgdfbgf")
      )}
    </Fragment>
  );
};





export default EmailVerify;