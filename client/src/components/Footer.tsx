import Test from "../media/test.png";
import { useNavigate } from "react-router-dom";
import { SearchCriteria } from "../types/DoctorTypes";
import "../Css/Footer.css";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n, ready } = useTranslation("common", { useSuspense: false });

  const navigateToDoctorSearch = (searchCriteria: SearchCriteria) => {
    navigate("/search", { state: { searchCriteria } });
  };

  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <h3 className="heading">{t("footer.page.title")}</h3>
            <div className="elementstyle">
              <p>
                <a href="./" className="link">
                {t("footer.page.home")}
                </a>
              </p>
              <p>
                <a href="./help" className="link">
                {t("footer.page.help")}
                </a>
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <h3 className="heading">{t("footer.page.contact")}</h3>
            <div className="elementstyle">
              <p>
                <a href="#" className="link">
                  service@zocdoc.com
                </a>
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <h3 className="heading">{t("footer.page.insurance")}</h3>
            <div className="elementstyle">
              <p>
                <a
                  href="https://www.aetna.com"
                  className="link"
                  target="_blank"
                >
                  Aetna
                </a>
              </p>
              <p>
                <a
                  href="https://www.ambetterhealth.com"
                  className="link"
                  target="_blank"
                >
                  Ambetter
                </a>
              </p>
              <p>
                <a href="https://www.bcbs.com" className="link" target="_blank">
                  Blue Cross Blue Shield
                </a>
              </p>
              <p>
                <a
                  href="https://www.cigna.com"
                  className="link"
                  target="_blank"
                >
                  Cigna
                </a>
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <h3 className="heading">{t("footer.page.specialities")}</h3>
            <div className="elementstyle">
              <p>
                <a
                  href="javascript:void(0)"
                  className="link"
                  onClick={() =>
                    navigateToDoctorSearch({
                      name: "",
                      specialty: "Primary care",
                      location: "",
                    })
                  }
                >
                  {t("footer.page.primarydoc")}
                </a>
              </p>
              <p>
                <a
                  href="javascript:void(0)"
                  className="link"
                  onClick={() =>
                    navigateToDoctorSearch({
                      name: "",
                      specialty: "Dermatology",
                      location: "",
                    })
                  }
                >
                  {t("footer.page.dermatology")}
                </a>
              </p>
              <p>
                <a
                  href="javascript:void(0)"
                  className="link"
                  onClick={() =>
                    navigateToDoctorSearch({
                      name: "",
                      specialty: "Psychiatry",
                      location: "",
                    })
                  }
                >
                  {t("footer.page.psychiatrist")}
                </a>
              </p>
              <p>
                <a
                  href="javascript:void(0)"
                  className="link"
                  onClick={() =>
                    navigateToDoctorSearch({
                      name: "",
                      specialty: "Nutrition",
                      location: "",
                    })
                  }
                >
                  {t("footer.page.nutritionist")}
                </a>
              </p>
              <p>
                <a
                  href="javascript:void(0)"
                  className="link"
                  onClick={() =>
                    navigateToDoctorSearch({
                      name: "",
                      specialty: "Dental",
                      location: "",
                    })
                  }
                >
                  {t("footer.page.dentist")}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            <ul className="nav-links li list-inline text-center">
              <li className="list-inline-item">&copy;&nbsp;DocBook, Inc.</li>
              <li className="list-inline-item">
                <a href="#" className="link">
                  {t("footer.page.terms")}
                </a>
              </li>
              <li className="list-inline-item">
                <a href="#" className="link">
                {t("Footer.page.privacy")}
                </a>
              </li>
              <li className="list-inline-item">
                <a href="#" className="link">
                {t("Footer.page.sitemap")}
                </a>
              </li>
              <li className="list-inline-item">
                <a href="#" className="link">
                  <img src={Test} className="privacy-image" alt="Privacy" />{" "}
                  {t("Footer.page.privacychoices")}
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://twitter.com/zocdoc" target="_blank">
                  <i className="fab fa-twitter twitter"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://www.instagram.com/zocdoc/" target="_blank">
                  <i className="fab fa-instagram insta"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://www.facebook.com/Zocdoc/" target="_blank">
                  <i className="fab fa-facebook fb"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="https://www.linkedin.com/company/zocdoc/"
                  target="_blank"
                >
                  <i className="fab fa-linkedin linkedin"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
