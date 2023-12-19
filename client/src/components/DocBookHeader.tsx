import { useSelector } from "react-redux";
import { selectUser } from "../store/slices/login_slice";
import { useTranslation } from "react-i18next";
import { useState } from "react";

function DocBookHeader() {
  const { t, i18n, ready } = useTranslation("common", { useSuspense: false });
  const [language, setLanguage] = useState<string>("en");

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "tel" : "en";
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const isProfileLinkVisible = useSelector(selectUser);
  return (
    <>
      <div className="header">
        <a
          className="DocBook"
          href="/"
          style={{ textDecoration: "none", color: "black" }}
        >
          Docbook
        </a>
        <div className="navigation">
          <div className="form-check form-switch d-flex justify-content-center">
            <input
              className="form-check-input"
              type="checkbox"
              id="languageToggle"
              checked={language === "tel"}
              onChange={toggleLanguage}
            />
            <span className="form-check-label ms-2">
              {t("common.toggleLanguage")}
            </span>
          </div>
          <a href="/search">Browse</a>
          <a href="/help">Help</a>
          {isProfileLinkVisible != null ? (
            <a href="/profile">Profile</a>
          ) : (
            <a href="/login">Log in / Sign up</a>
          )}
        </div>
      </div>
    </>
  );
}

export default DocBookHeader;
